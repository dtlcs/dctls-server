var mysql = require('mysql');

var connection = mysql.createPool({
  host: "35.226.99.182",
  user: "ivantha",
  password: "cat",
  dateStrings: true,
  database: "stls_db"
});

module.exports = connection;
