var express = require("express");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var mqttRouter = require('./routes/mqtt-router');

// var connection = mysql.createConnection(process.env.JAWSDB_URL);

var connection = mysql.createPool({
    host: "yhrz9vns005e0734.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "ae8ptu9hakhbthtj",
    password: "jy5105xcnjkesh5i",
    dateStrings: true,
    database: "j95ambgc4f7zrfai"
});

var app = express();
app.use(bodyParser.json());
app.use('/pi', mqttRouter);

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({
        "error": message
    });
    throw err;
}

// Get all users
app.get("/api/users/all", function(req, res) {
    connection.query('SELECT * FROM user', function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(rows);
        }
    });
});

// Get all users
app.get("/api/user/:id", function(req, res) {
    connection.query(`SELECT * FROM user WHERE id = '${req.params.id}'`, function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to get user details.");
        } else {
            res.status(200).json(rows);
        }
    });
});

// Add junction
app.post("/api/junction/add", function(req, res) {
    var newJunction = req.body;
    newJunction.createDate = new Date();

    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else if (!req.body.street) {
        handleError(res, "Invalid user input", "Must provide a street.", 400);
    } else if (!req.body.city) {
        handleError(res, "Invalid user input", "Must provide a city.", 400);
    } else if (!req.body.province) {
        handleError(res, "Invalid user input", "Must provide a province.", 400);
    } else if (!req.body.postal_code) {
        handleError(res, "Invalid user input", "Must provide a postal code.", 400);
    } else if (!req.body.latitude) {
        handleError(res, "Invalid user input", "Must provide a latitude value.", 400);
    } else if (!req.body.longitude) {
        handleError(res, "Invalid user input", "Must provide a longitude value.", 400);
    }

    connection.query(`SELECT * FROM junction WHERE name = '${req.body.name}'`, function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to add junction.");
        } else if (rows.length > 0) {
            res.status(400).json("Junction name already exist.");
        } else {
            connection.query(`INSERT INTO junction (name, description, street, city, province, postal_code, latitude, longitude)
                VALUES (
                '${req.body.name}',
                '${req.body.description}',
                '${req.body.street}',
                '${req.body.city}',
                '${req.body.province}',
                '${req.body.postal_code}',
                '${req.body.latitude}',
                '${req.body.longitude}'
                )`, function(err, result) {
                if (err) {
                    handleError(res, err.message, "Failed to add junction.");
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });
});

// Get junction name list
app.get("/api/junctions/name", function(req, res) {
    connection.query('SELECT name FROM junction', function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to get junction names.");
        } else {
            res.status(200).json(rows);
        }
    });
});

// Authenticate user
app.post("/api/user/authenticate", function(req, res) {
    var newJunction = req.body;
    newJunction.createDate = new Date();

    if (!req.body.username) {
        handleError(res, "Invalid user input", "Must provide a username.", 400);
    } else if (!req.body.password) {
        handleError(res, "Invalid user input", "Must provide a password.", 400);
    }

    connection.query(`SELECT * FROM user 
     INNER JOIN login ON user.id = login.user_id 
     WHERE username = '${req.body.username}' AND password = '${req.body.password}'`, function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to authenticate.");
        } else if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(400).json("Username/password incorrect.");
        }
    });
});

// Get user junction list
app.get("/api/user/junctions/:userid", function(req, res) {
    connection.query(`SELECT * FROM junction 
    INNER JOIN junction_has_traffic_officer ON junction.id = junction_has_traffic_officer.junction_id 
    WHERE junction_has_traffic_officer.traffic_officer_user_id = '${req.params.userid}'`, function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to get junction list.");
        } else {
            res.status(200).json(rows);
        }
    });
});

// Add new admin-user -system user
app.post("/api/user/add", function(req, res) {
    if (!req.body.name) {
        handleError(res, "Invalid user input", "Must provide a name.", 400);
    } else if (!req.body.nic) {
        handleError(res, "Invalid user input", "Must provide a nic no.", 400);
    } else if (!req.body.role_id) {
        handleError(res, "Invalid user input", "Must provide a Role type.", 400);
    } else if (!req.body.email) {
        handleError(res, "Invalid user input", "Must provide an email.", 400);
    } else if (!req.body.password) {
        handleError(res, "Invalid user input", "Must provide a password.", 400);
    }

    connection.query(`SELECT * FROM user WHERE nic = '${req.body.nic}'`, function(err, rows, fields) {
        if (err) {
            handleError(res, err.message, "Failed to add user.");
        } else if (rows.length > 0) {
            res.status(400).json("user NIC already exist.");
        } else {
            connection.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, function(err, rows, fields) {
                if (err) {
                    handleError(res, err.message, "Failed to add user.");
                } else if (rows.length > 0) {
                    res.status(400).json("Email already exist.");
                } else {
                    var lastId = 0;
                    connection.query(`INSERT INTO user (name, nic, role_id, email) VALUES(
                            '${req.body.name}',
                            '${req.body.nic}',
                            '${req.body.role_id}',
                            '${req.body.email}'
                        )`, function(err, result) { 
                        if (err) {
                            handleError(res, err.message, "Failed to add user.");
                        } else {
                            connection.query(`INSERT INTO login (user_id, username, password) VALUES(
                                '${result.insertId}',
                                '${req.body.email}',
                                '${req.body.password}'          
                            )`, function(err2, result2) {
                            if (err2) {
                                handleError(res, err2.message, "Failed to add system user.");
                            } else {
                                // res.status(200).json(result);
                                res.status(200).json(result2);
                            }
                        });
                        }
                    });
                }
            });
        }
    });
});