var express    = require('express')
var piRouter   = express.Router()
var mqtt       = require('mqtt')
var url        = require('url')
var connection = require('../database/mysql-connection')

// Parse
var mqtt_url = url.parse(process.env.CLOUDMQTT_URL || 'mqtt://localhost:1883')
var auth     = (mqtt_url.auth || ':').split(':')
var client   = mqtt.connect(mqtt_url)

// When connected
client.on('connect', function () {
    // Subscribe to the pi data stream
    client.subscribe('pi/+/data', function () {
        client.on('message', function (topic, message, packet) {
            console.log('Received \'' + message + '\' on \'' + topic + '\'')

            // pimac:r1l1:r1l2:r1l3:r1l4:...:r4l6 - 24 lane density values
            let data    = message.toString()
            let piMac   = data.substring(0, data.indexOf(':'))
            let density = data.substring(data.indexOf(':') + 1)

            let date   = new Date()
            let year   = date.getFullYear()
            let month  = date.getMonth()
            let day    = date.getDate()
            let hour   = date.getHours()
            let minute = date.getMinutes()

            connection.query(`SELECT id FROM junction WHERE pi_mac = '${piMac}'`, function (err, rows, fields, next) {
                if (err) {
                    next(err)
                } else if (rows.length == 1) {
                    connection.query(`INSERT INTO traffic (year, month, day, hour, minute, junction_id, density) VALUES
          ('${year}', '${month}', '${day}', '${hour}', '${minute}', '${rows[0].id}', '${density}')
          `, function (err, result) {
                        if (err) {
                            console.log('Failed to add traffic data.')
                        }
                    })
                } else {
                    console.log('Unknown error.')
                }
            })
        })
    })

    // Publish commands to pi
    piRouter.post('/*/cmd', function (req, res, next) {
        client.publish('pi/' + req.body.pimac + '/cmd', req.body.msg, function () {
            res.writeHead(204, {'Connection': 'keep-alive'})
            res.end()
        })
    })
})

module.exports = piRouter
