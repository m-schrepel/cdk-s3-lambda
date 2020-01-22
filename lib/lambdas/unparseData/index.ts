import Papa = require('papaparse')
import AWS = require('aws-sdk')

const s3 = new AWS.S3()

const headerRow = [
    'brand',
    'category',
    'description',
    'imageUrl',
    'mfrWarrantyParts',
    'mfrWarrantyLabor',
    'mfrWarrantyUrl',
    'price',
    'title',
    'referenceId',
    'sku',
    'gtin',
    'upc',
    'asin',
    'barcode',
    'warrantyProductStatus',
    'warrantyProductApproved',
    'warrantyCategory',
    'planId',
    'planId',
    'planId',
]

const product = [
    'Stamm - Keebler',
    'Games',
    'Description for Unbranded Concrete Bacon',
    'http://lorempixel.com/640/480/transport',
    999,
    999,
    'https://example.com',
    6301,
    'Title - Unbranded Concrete Bacon',
    '7d2d4d14-e751-40a6-a677-6603cd2aa939',
    'sku-7d2d4d14-e751-40a6-a677-6603cd2aa939',
    'gtin-7d2d4d14-e751-40a6-a677-6603cd2aa939',
    '',
    '',
    '',
    '',
    '',
    'Games',
    '10001-misc-elec-adh-replace-1y',
    '10001-misc-elec-adh-replace-2y',
    ''
]
exports.handler = async () => {

    const result: string = Papa.unparse([headerRow, product])

    const s3Result = s3.putObject({ Bucket: process.env.targetS3Bucket || 'product', Key: 'test-unparse.csv', ContentType: 'text/csv', Body: result }, (error, result) => {
        console.log('error', error)
        console.log('result', result)
    })

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: s3Result
    }

}