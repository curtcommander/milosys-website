'use strict';

const sendGridMail = require('@sendgrid/mail');
const queryString = require('querystring');

const { getParam } = require('./utils/getParam');

const to = 'curtcommander@gmail.com';
const from = 'contact@milosys.com';

let apiKey;

async function handler(event) {
    if (!apiKey) {
        apiKey = await getParam('sendGridApiKey');
        sendGridMail.setApiKey(apiKey);
    }

    const inputQueryString = decodeURIComponent(event.body);
    const input = queryString.parse(inputQueryString);

    // prepare email body
    let body = `New message from contact form on Milosys website:

    Name: ${input.name}
    Email: ${input.email}
    Subject: ${input.subject}

    Message:
    ${input.message}`;

    body = body.trim();
    for (const match of body.matchAll(/\n[ ]+/g)) {
        body = body.replace(match[0], '\n');
    }
    
    // send email
    const params = {
        to,
        from,
        subject: `MILOSYS: ${input.subject}`,
        text: body
    }

    try {
        await sendGridMail.send(params);
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 'success',
                text: `Hi ${input.name}! Your message has been sent. We'll get back to you soon!`
            })
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                type: 'error',
                text: `Looks like something went wrong. Error message: ${err.message}`
            })
        }
    }
}

module.exports = { handler };