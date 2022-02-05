'use strict';

const aws = require('aws-sdk');
const ssm = new aws.SSM();

// get data on parameter from ssm paramter store
function getParamData(name) {
    const params = {
        Name: name,
        WithDecryption: true
    }
    return ssm.getParameter(params).promise();
}

// read a secure string parameter from ssm parameter store
async function getParam(name) {
    const resGetParam = await getParamData(name);
    let val = resGetParam.Parameter.Value;
    try {
        val = JSON.parse(val);
    } finally {
        return val;
    }
}

module.exports = { getParam };