var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');

// var connection = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     dateStrings:true,
//     database: "j95ambgc4f7zrfai"
// });

// var connection = mysql.createConnection(process.env.JAWSDB_URL);

var connection = mysql.createPool({
    host: "yhrz9vns005e0734.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ae8ptu9hakhbthtj",
    password: "jy5105xcnjkesh5i",
    dateStrings:true,
    database: "j95ambgc4f7zrfai"
});

var app = express();
app.use(bodyParser.json());

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
    throw err;
}

app.get("/api/users", function(req, res) {
    connection.query('SELECT * FROM user', function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(rows);
        }
    });
});