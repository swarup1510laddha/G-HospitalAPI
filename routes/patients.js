const express = require("express");
const router = express.Router();
const validate = require("../models/patient");
const auth = require('../middleware/auth');
const db = require('../db');
const { hash } = require("../common/hash");
const { sendCredentials } = require("../common/sms");
const multer = require("multer");
const _ = require("lodash");
var passwordGenerator = require('generate-password');
const { generateID } = require('../common/generateID');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

//! (GET) request for retrieving all patients..
router.get("/", auth, async (req, res) => {
  try {
    let sql = 'SELECT * FROM patients';
    db.query(sql, (err, result) => {
      if(err) {
        throw err;
      }

      res.status(200).send(result);
    });
  }
  catch(ex) {
    res.send(ex.message);
  }
});


// ! (POST) request for creating new patients...
router.post("/", auth, upload.single('digitalSign'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const password = passwordGenerator.generate({
      length: 10,
      numbers: true,
      symbols: true
    });
    
    //console.log(password);
    //const date = new Date(req.body.dob);
   
    const Patient = {
      id: generateID(),
      dob: req.body.dob,
      //dob: date,
      diagnosis: req.body.diagnosis,
      email: req.body.email,
      ergonomic_advice: req.body.ergonomic_advice,
      fee: req.body.fee,
      gender: req.body.gender,
      referred_by_dr: req.body.referred_by_dr,
      treatment: req.body.treatment,
      weight: req.body.weight,
      password: await hash(password),
      digitalSign: req.file.path
    };

    let sql = 'INSERT INTO patients SET ?';
    let insertQueryResult = db.query(sql, Patient, (err, result) => {
      if (err) {
        throw err;
      }
    });

    let updateQuery = `UPDATE appointments SET patientID = ? WHERE id = ?`;
    db.query(updateQuery, [insertQueryResult.values.id, req.body.appointmentId], (err, result) => {
      if (err) {
        throw err;
      }
    });
    
    let selectQuery = 'SELECT * from appointments WHERE id = ?';
    db.query(selectQuery, req.body.appointmentId, async (err, result) => {
      if(err) {
        throw err;
      }
      let appointment = result[0];
      await sendCredentials(appointment.fullName, password, appointment.phone);
    });
    res.status(200).send(_.pick(insertQueryResult.values, ['id', 'dob', 'diagnosis', 'email', 'ergonomic_advice', 'fee', 'gender', 'treatment', 'weight', 'referred_by_dr', 'patientImage', 'digitalSign']));
  } 
  catch (ex) {
    res.status(400).send(ex.message);
  }
});

module.exports = router;
