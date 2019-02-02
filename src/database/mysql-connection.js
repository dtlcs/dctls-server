var mysql = require('mysql')

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    dateStrings: true,
    database: 'stls_db'
})

module.exports = connection
