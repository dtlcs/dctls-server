var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL);

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
}

app.get("/api/users", function(req, res) {
    connection.connect();

    connection.query('SELECT * FROM user', function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(rows);
        }
    });

    connection.end();
});
