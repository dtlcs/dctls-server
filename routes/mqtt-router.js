var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
url = require('url');
var mysql = require('mysql');

var mqttMysqlConnection = mysql.createPool({
  host: "yhrz9vns005e0734.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "ae8ptu9hakhbthtj",
  password: "jy5105xcnjkesh5i",
  dateStrings: true,
  database: "j95ambgc4f7zrfai"
});

// Parse
var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');
var client = mqtt.connect(mqtt_url);

// Middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
})

// When connected
client.on('connect', function () {
  // Subscribe to the pi data stream
  client.subscribe('pi/+/data', function () {
    client.on('message', function (topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");

      // pimac:r1l1:r1l2:r1l3:r1l4:...:r4l6 - 24 lane density values
      let data = message.toString();
      let piMac = data.substring(0, data.indexOf(':'))
      let density = data.substring(data.indexOf(':') + 1)

      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();

      mqttMysqlConnection.query(`SELECT id FROM junction WHERE pi_mac = '${piMac}'`, function (err, rows, fields) {
        if (err) {
          handleError(res, err.message, "Failed to add traffic data.");
        } else if (rows.length == 1) {
          mqttMysqlConnection.query(`INSERT INTO traffic (year, month, day, hour, minute, junction_id, density) VALUES
          ('${year}', '${month}', '${day}', '${hour}', '${minute}', '${rows[0].id}', '${density}')
          `, function (err, result) {
              if (err) {
                console.log("Failed to add traffic data.");
              } 
            });
        } else {
          console.log("Unknown error.");
        }
      });
    });
  });

  // Publish commands to pi
  router.post('/*/cmd', function (req, res) {
    // var msg = JSON.stringify({
    //   date: new Date().toString(),
    //   msg: req.body.msg
    // });
    client.publish('pi/' + req.body.pimac + '/cmd', req.body.msg, function () {
      res.writeHead(204, { 'Connection': 'keep-alive' });
      res.end();
    });
  });
});

module.exports = router;