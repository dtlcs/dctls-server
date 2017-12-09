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
      // pimac:r1l1:r1l2:r1l3:r1l4:...:r4l6 - 24 lane density values
      param = message.split(':');

      console.log("Received '" + message + "' on '" + topic + "'");
      connection.query(`INSERT INTO traffic (year, month, day, hour, minute, junction_id, road_id, lane_id, density) VALUES(
        '${param[0]}',
        '${param[1]}',
        '${param[2]}',
        '${param[3]}',
        '${param[4]}',
        '${param[5]}',
        '${param[6]}',
        '${param[7]}',
        '${param[8]}'          
      )`, function(err, result) {
      if (err2) {
          handleError(res, err.message, "Failed to add the traffic data.");
      } else {
          res.status(200).json(result);
      }
    });
    });
  });

  // Publish commands to pi
  router.post('/cmd', function (req, res) {         
    var msg = JSON.stringify({
      date: new Date().toString(),
      msg: req.body.msg
    });
    client.publish('pi/' + req.body.pimac + '/cmd', msg, function () {
      res.writeHead(204, { 'Connection': 'keep-alive' });
      res.end();
    });
  });
});

module.exports = router;