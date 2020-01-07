import { S3Event } from 'aws-lambda'
import Papa = require('papaparse')
import AWS = require('aws-sdk')

const s3 = new AWS.S3({
    signatureVersion: 'v4',
})

interface CSVIndexMap {
    [key: string]: number
}

function createKeyMapObject(headers: string[]): CSVIndexMap {
    return headers.reduce((result: object, header: string, index: number) => {
        if (header !== 'planId') {
            return { ...result, [header]: index }
        }
        return result
    }, {})
}

exports.handler = (event: S3Event) => {
    let processedChunks = 0
    let indexMap: CSVIndexMap
    let planIdIndex: number
    let sqsProductBlock: any = []

    function handleChunks(results: Papa.ParseResult): void {
        const { data } = results
        if (processedChunks === 0) {
            const headers = data[0]
            indexMap = createKeyMapObject(headers)
            planIdIndex = headers.indexOf('planId')
            data.shift()
        }
        const products = data.reduce((result, row) => {
            const transformedRow = {
                brand: row[indexMap.brand],
                category: row[indexMap.category],
                description: row[indexMap.description],
                enabled: row[indexMap.enabled],
                imageUrl: row[indexMap.imageUrl],
                mfrWarranty: {
                    parts: row[indexMap.mfrWarrantyParts],
                    labor: row[indexMap.mfrWarrantyLabor],
                    url: row[indexMap.mfrWarrantyUrl],
                },
                price: row[indexMap.price],
                title: row[indexMap.title],
                referenceId: row[indexMap.referenceId],
                parentReferenceId: row[indexMap.parentReferenceId],
                plans: row.slice(planIdIndex),
                identifiers: {
                    sku: row[indexMap.sku],
                    gtin: row[indexMap.gtin],
                    upc: row[indexMap.upc],
                    asin: row[indexMap.asin],
                    barcode: row[indexMap.barcode],
                },
            }

            return [...result, transformedRow]
        }, [])

        if (sqsProductBlock.length + products.length >= 1000) {
            sqsProductBlock = []
        } else {
            sqsProductBlock = [...sqsProductBlock, ...products]
        }

        processedChunks += 1
    }

    return new Promise((resolve, reject) => {
        // There should only be one of these
        const s3Record = event.Records.find(record => record.eventName === 'ObjectCreated:Put')

        if (s3Record) {
            const params = {
                Bucket: s3Record.s3.bucket.name,
                Key: s3Record.s3.object.key,
            }

            const readStream = s3
                .getObject(params)
                .createReadStream()

            readStream.on('error', (err) => {
                console.log('There was an error with the s3 read stream: \n', JSON.stringify(err, null, 2))
                reject()
            })

            readStream.on('end', () => console.log('Chunks processed', processedChunks))

            Papa.parse(readStream, {
                chunk: (results, parser) => {
                    handleChunks(results)
                },
                complete: () => {
                    resolve()
                    console.log(`Parsing complete. ${processedChunks} chunks processed.`)
                }
            })
        }
    })
} 