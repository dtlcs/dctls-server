var express        = require('express')
var junctionRouter = express.Router()
var connection     = require('../database/mysql-connection')

// Add junction
junctionRouter.post('/add', function (req, res, next) {
    var newJunction        = req.body
    newJunction.createDate = new Date()

    var err        = new Error()
    err.statusCode = 400
    if (!req.body.name) {
        err.status = 'Invalid name'
    } else if (!req.body.street) {
        err.status = 'Invalid street'
    } else if (!req.body.city) {
        err.status = 'Invalid city'
    } else if (!req.body.province) {
        err.status = 'Invalid province'
    } else if (!req.body.postal_code) {
        err.status = 'Invalid postal code'
    } else if (!req.body.latitude) {
        err.status = 'Invalid latitude'
    } else if (!req.body.longitude) {
        err.status = 'Invalid longitude'
    } else if (!req.body.pi_mac) {
        err.status = 'Invalid Pi MAC address'
    }
    if (err.statusCode) {
        next(err)
        return
    }

    connection.query(`SELECT * FROM junction WHERE name = '${req.body.name}'`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else if (rows.length > 0) {
            res.status(400).json('Junction name already exist.')
        } else {
            connection.query(`INSERT INTO junction (name, description, street, city, province, postal_code, latitude, longitude, pi_mac)
                VALUES (
                '${req.body.name}',
                '${req.body.description}',
                '${req.body.street}',
                '${req.body.city}',
                '${req.body.province}',
                '${req.body.postal_code}',
                '${req.body.latitude}',
                '${req.body.longitude}',
                '${req.body.pi_mac}'
                )`, function (err, result) {
                if (err) {
                    handleError(res, err.message, 'Failed to add junction.')
                } else {
                    res.status(200).json(result)
                }
            })
        }
    })
})

// Get junction name list
junctionRouter.get('/name', function (req, res, next) {
    connection.query('SELECT name FROM junction', function (err, rows, fields) {
        if (err) {
            next(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

// Get all junctions
junctionRouter.get('/all', function (req, res, next) {
    connection.query('SELECT * FROM junction', function (err, rows, fields) {
        if (err) {
            next(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

module.exports = junctionRouter
