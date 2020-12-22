const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const db = require('../db');

// ! (POST) login...
router.post("/", (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // let patient = await Patient.findOne({ email: req.body.email }).exec();
    let sql = 'SELECT * FROM patients WHERE email = ?';
    db.query(sql, req.body.email, async (err, result) => {
      if(err) {
        throw err;
      }
      
      let patient = result[0];
      if(!patient) return res.status(400).send("Invalid Email or Password");

      //Validating password
      const validPassword = await bcrypt.compare(
        req.body.password,
        patient.password
      );

      if (!validPassword) return res.status(400).send("Invalid Email or Password");

      //Generating a new token
      const token = jwt.sign(
        { id: patient.id, name: patient.email },
        config.get("jwtPrivateKey")
      );

      res.status(200).send(token);
    });
  }
  catch (ex) {
    res.status(400).send(ex.message);
  }
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validateAsync(req);
}

module.exports = router;
