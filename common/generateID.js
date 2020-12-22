const uuid = require('uuid-random');

const generateID = function() {
    let id = uuid().toString();
    let finalValue = id.replace(/-/g, '');
    return finalValue;
}

module.exports.generateID = generateID;