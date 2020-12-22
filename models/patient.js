const Joi = require('joi');

function validate(patient) {
    const schema = Joi.object({
      appointmentId: Joi.string().required(),
      dob: Joi.string().required(),
      diagnosis: Joi.string().max(255),
      email: Joi.string().min(5).max(255).required().email(),
      ergonomic_advice: Joi.string().max(255),
      fee: Joi.string().max(50).required(),
      gender: Joi.string().max(10).required(),
      referred_by_dr: Joi.string().max(50),
      treatment: Joi.string().max(255).required(),
      weight: Joi.string().max(20),
    });
  
    return schema.validate(patient);
};

module.exports = validate;