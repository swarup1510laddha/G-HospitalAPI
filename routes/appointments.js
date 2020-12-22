const express = require('express');
const router = express.Router();
const db = require('../db');
const validate = require('../models/appointment');
const { sendSms } = require('../common/sms');
const { generateID } = require('../common/generateID');
const auth = require('../middleware/auth');
   
//! (GET) request for retrieving all appointments..

router.get('/', auth, async (req, res) => {
    try{
        const sql = 'SELECT * FROM appointments';
        db.query(sql, (err, result) => {
            if(err) {
                throw err;
            }
            res.status(200).send(result);
        });
    }
    catch(ex){
        res.send(ex.message);
    }
});

// ! (POST) request for creating new appointments...

router.post('/', async (req, res) => {
    const { error } = validate(req.body);   
    if (error) return res.status(400).send(error.details[0].message);

   // For testing purpose converting string to date
   //const date = new Date(req.body.preferredDate);
   let appointment ={
        id: generateID(),
        fullName: req.body.fullName,
        phone: req.body.phone,
        preferredDate: req.body.preferredDate,
        //preferredDate: date,
        message: req.body.message,
        age: req.body.age
   };
   
   try {
        let sql = 'INSERT INTO appointments SET ?';
        let result = db.query(sql, appointment, (err, result) => {
            if(err) {
                throw err;
            }
        });
 
        await sendSms(result.values.fullName, result.values.phone);
        res.status(200).send(result.values);
   }
   catch(ex) {
      res.send(ex.message);
   }
});

module.exports = router;