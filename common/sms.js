const fast2sms= require('fast-two-sms');
var url = 'http://majalgaonphysiotherapy.in/';
let phoneNumber = [];
var options = { 
    authorization : '', 
    sender_id: 'clinic',
    language: 'english',
    numbers : [], 
    message : ''
};

const sendSms = async function(name, phone){
    phoneNumber.push(phone);
    send(`A new appointment is booked by ${name}`, '7709473600');
    return send(`Dear ${name}, your appointment is booked successfully.`, phoneNumber);
}

const sendCredentials = async function(name, password, phone) {
    phoneNumber.push(phone);
    return send(`Dear ${name}, your account password is ${password}. Use this password and click on this link to continue ${url}`, phoneNumber);
}

const send = async function(message, phone) {
    options.authorization = process.env.SMS_API_KEY;
    options.message = message;
    options.numbers = phone;

    const msgResponse = await fast2sms.sendMessage(options);
    return msgResponse;
}

module.exports.sendSms = sendSms;
module.exports.sendCredentials = sendCredentials;
