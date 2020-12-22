const express = require("express");
const db = require('./db');
const app = express();
const appointments = require("./routes/Appointments");
const patients = require("./routes/patients");
const login = require("./routes/login");
const config = require("config");
require("dotenv").config();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not define.");
  process.exit(1);
}

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE clinic_db';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Database created');
  });
});

app.get('/createappointmenttable', (req, res) => {
  let sql = 'CREATE TABLE appointments(id VARCHAR(255) PRIMARY KEY, fullName VARCHAR(50), phone VARCHAR(15), preferredDate DATE, message VARCHAR(255) null, age INT, patientID VARCHAR(255) null)';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Appointments table created');
  });
});

app.get('/createpatienttable', (req, res) => {
  let sql = 'CREATE TABLE patients(id VARCHAR(255) PRIMARY KEY, dob DATE, diagnosis VARCHAR(255), digitalSign VARCHAR(255), email VARCHAR(255), ergonomic_advice VARCHAR(255), fee VARCHAR(50), gender VARCHAR(10), password VARCHAR(1024), referred_by_dr VARCHAR(50), treatment VARCHAR(255), weight VARCHAR(20))';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send('Appointments table created');
  });
});

app.use(express.json());

app.use("/api/appointments", appointments);

app.use("/api/patients", patients);

app.use("/api/login", login);

const port = process.env.PORT || 3000;

app.listen(port);

