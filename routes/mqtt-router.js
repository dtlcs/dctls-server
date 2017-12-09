var express = require('express');
var router = express.Router();
var mqtt = require('mqtt');
url = require('url');

// Parse
var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883');
var auth = (mqtt_url.auth || ':').split(':');

// // Create a client connection
// var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
//   username: auth[0],
//   password: auth[1]
// });

// // Middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// })

// // When connected
// client.on('connect', function() { 

//   // Subscribe to the pi data stream
//   client.subscribe('pi/data', function() {
//     client.on('message', function(topic, message, packet) {
//       console.log("Received '" + message + "' on '" + topic + "'");
//     });
    
//   });

//   // Publish a message to a topic
//   client.publish('pi/function', 'my message', function() {
//     // console.log("Message is published");
//     // client.end(); // Close the connection when published
//     router.get('/about', function (req, res) {
//       res.send('About birds');
//     });

//     router.post('/publish', function(req, res) {
//       var msg = JSON.stringify({
//         date: new Date().toString(),
//         msg: req.body.msg
//       });
//         client.publish(topic, msg, function() {
//           res.writeHead(204, { 'Connection': 'keep-alive' });
//           res.end();
//         });
//       });

//   });
// });

module.exports = router;