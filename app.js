//export AWS_XRAY_CONTEXT_MISSING=LOG_ERROR
const AWSXRay = require('aws-xray-sdk-core'),
    AWS = AWSXRay.captureAWS(require('aws-sdk'));

const documentClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    convertEmptyValues: true
});

const dynamoPut = (params) => {
    return documentClient.put(params).promise().catch(err => console.log(err))
}

const dynamoQuery = (params) => {
    return documentClient.query(params).promise().catch(err => console.log(err))
}

const generateResponse = (statusCode, body) => {
    return {
        'statusCode': statusCode,
        'body': JSON.stringify(body)
    }
}

const putTask = async (event, context, callback) => {
    try {
        const body = JSON.parse(event.body)
        const put = await dynamoPut({
            TableName: process.env.TABLE_NAME,
            ReturnValues: "ALL_OLD",
            Item: {
                Id: parseInt(event.pathParameters.taskId),
                Task: String(body.Task),
                Complete: Boolean(body.Complete)
            }
        })

        callback(null, generateResponse(200, {
            put
        }))
    } catch (err) {
        console.log(err);
        callback(err, generateResponse(500, {
            err
        }))
    }
};

const getTask = async (event, context, callback) => {
    try {
        const get = await dynamoQuery({
            TableName: process.env.TABLE_NAME,
            KeyConditionExpression: 'Id = :id',
            ExpressionAttributeValues: {
                ':id': parseInt(event.pathParameters.taskId)
            }
        })


        if(get.Count === 0) {
            callback(null, generateResponse(404, "NOT FOUND"))
        }
        geaasdawd
        callback(null, generateResponse(200, {
            get
        }))
    } catch (err) {
        console.log(err);
        callback(err, generateResponse(500, {
            err
        }))
    }
};

module.exports = {
    getTask,
    putTask,
    generateResponse
}