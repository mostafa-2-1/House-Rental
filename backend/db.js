const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'ROOT', 
  database: 'house_rental' 
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;
