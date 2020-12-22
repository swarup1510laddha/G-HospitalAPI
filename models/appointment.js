const Joi = require('joi');

function validate(appointment) {
    const schema = Joi.object({
      fullName: Joi.string().max(50).required(),
      phone: Joi.string().max(15).required(),
      preferredDate: Joi.date().required(),
      message: Joi.string().max(255),
      age: Joi.number().required()
    });
    return schema.validate(appointment);
} 

module.exports = validate;