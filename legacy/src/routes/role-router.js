var express    = require('express')
var roleRouter = express.Router()
var connection = require('../database/mysql-connection')

// Get all roles
roleRouter.get('/all', function (req, res, next) {
    connection.query('SELECT * FROM role', function (err, rows, fields) {
        if (err) {
            next(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

module.exports = roleRouter
