const mysql = require('mysql');

// Creating a new connection
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'Rohan',
    password : '12345',
    database : 'clinic_db'
});
  
db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('Connected to database');
});
module.exports = db;