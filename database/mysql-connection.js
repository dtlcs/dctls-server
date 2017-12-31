var mysql = require('mysql');

// var connection = mysql.createPool({
//   host: "yhrz9vns005e0734.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//   user: "ae8ptu9hakhbthtj",
//   password: "jy5105xcnjkesh5i",
//   dateStrings: true,
//   database: "j95ambgc4f7zrfai"
// });

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  dateStrings: true,
  database: "j95ambgc4f7zrfai"
});

module.exports = connection;
