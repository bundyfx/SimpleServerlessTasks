'use strict';

const app = require('../../app.js');
const event = require('../../event.json')
var context;

describe('Test generateResponse',  () => {
    it('verifies successful response', async () => {
        const generateResponse = app.generateResponse(200, {"msg": "body"})

        expect(generateResponse.statusCode).toEqual(200)
        expect(generateResponse.body).toEqual(JSON.stringify({"msg": "body"}))
    })
})