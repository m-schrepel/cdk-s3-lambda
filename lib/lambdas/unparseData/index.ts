import Papa = require('papaparse')
import AWS = require('aws-sdk')

const s3 = new AWS.S3({
    signatureVersion: 'v4',
})

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
    console.log('parse result', result)
    console.log('Executing...')

    const params = { 
        Bucket: 's3lambdacdkstack-productcsvupload18421a24-15jc9rq10joad', 
        Key: 'test-unparse.csv', 
        Body: result,
        ContentType: 'text/csv'
    }

    const s3Result = await s3.putObject(params).promise()
    console.log(s3Result)
    return {
        statusCode: s3Result && s3Result.ETag ? 200 : 500,
        body: s3Result.ETag || s3Result
    }
}