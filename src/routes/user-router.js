var express    = require('express')
var userRouter = express.Router()
var connection = require('../database/mysql-connection')

// Get all users
userRouter.get('/all', function (req, res, next) {
    connection.query(`SELECT user.id, user.name, user.nic, user.email, user.telephone, user.street,
  user.city, user.province, user.postal_code, role.name AS role FROM user 
  INNER JOIN role WHERE user.role_id = role.id`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

// Get user by id
userRouter.get('/:id', function (req, res, next) {
    connection.query(`SELECT * FROM user WHERE id = '${req.params.id}'`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

// Authenticate user
userRouter.post('/authenticate', function (req, res, next) {
    var newJunction        = req.body
    newJunction.createDate = new Date()

    if (!req.body.username) {
        var err        = new Error()
        err.status     = 'Invalid username'
        err.statusCode = 400
        next(err)
        return
    } else if (!req.body.password) {
        var err        = new Error()
        err.status     = 'Invalid password'
        err.statusCode = 400
        next(err)
        return
    }

    connection.query(`SELECT * FROM user 
     INNER JOIN login ON user.id = login.user_id 
     WHERE username = '${req.body.username}' AND password = '${req.body.password}'`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else if (rows.length > 0) {
            res.status(200).json(rows)
        } else {
            res.status(400).json('Username/password incorrect.')
        }
    })
})

// Get user junction list
userRouter.get('/junctions/:userid', function (req, res, next) {
    connection.query(`SELECT * FROM junction 
    INNER JOIN junction_has_traffic_officer ON junction.id = junction_has_traffic_officer.junction_id 
    WHERE junction_has_traffic_officer.traffic_officer_user_id = '${req.params.userid}'`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else {
            res.status(200).json(rows)
        }
    })
})

// Add user
userRouter.post('/add', function (req, res, next) {
    if (!req.body.name) {
        var err        = new Error()
        err.status     = 'Invalid name'
        err.statusCode = 400
        next(err)
        return
    } else if (!req.body.nic) {
        var err        = new Error()
        err.status     = 'Invalid nic number'
        err.statusCode = 400
        next(err)
        return
    } else if (!req.body.role_id) {
        var err        = new Error()
        err.status     = 'Invalid role type'
        err.statusCode = 400
        next(err)
        return
    } else if (!req.body.email) {
        var err        = new Error()
        err.status     = 'Invalid email'
        err.statusCode = 400
        next(err)
        return
    } else if (!req.body.password) {
        var err        = new Error()
        err.status     = 'Invalid password'
        err.statusCode = 400
        next(err)
        return
    }

    connection.query(`SELECT * FROM user WHERE nic = '${req.body.nic}'`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else if (rows.length > 0) {
            res.status(400).json('User NIC already exist.')
        } else {
            connection.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, function (err, rows, fields) {
                if (err) {
                    next(err)
                } else if (rows.length > 0) {
                    res.status(400).json('Email already exist.')
                } else {
                    var lastId      = 0
                    var telephone   = (req.body.telephone == undefined) ? 'NULL' : req.body.telephone
                    var street      = (req.body.street == undefined) ? 'NULL' : req.body.street
                    var city        = (req.body.city == undefined) ? 'NULL' : req.body.city
                    var province    = (req.body.province == undefined) ? 'NULL' : req.body.province
                    var postal_code = (req.body.postal_code == undefined) ? 'NULL' : req.body.postal_code

                    connection.query(`INSERT INTO user (name, nic, role_id, email, telephone, street, city, province, postal_code) VALUES(
                            '${req.body.name}',
                            '${req.body.nic}',
                            '${req.body.role_id}',
                            '${req.body.email}',
                            '${telephone}',
                            '${street}',
                            '${city}',
                            '${province}',
                            '${postal_code}'
                        )`, function (err, result) {
                        if (err) {
                            next(err)
                        } else {
                            console.log('cat4')
                            connection.query(`INSERT INTO login (user_id, username, password) VALUES(
                                '${result.insertId}',
                                '${req.body.email}',
                                '${req.body.password}'          
                            )`, function (err2, result2) {
                                if (err2) {
                                    handleError(res, err2.message, 'Failed to add user.')
                                } else {
                                    res.status(204)
                                    res.end()
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

// Update user
userRouter.post('/update', function (req, res, next) {
    if (!req.body.id) {
        var err        = new Error()
        err.status     = 'Invalid user ID'
        err.statusCode = 400
        next(err)
        return
    }

    connection.query(`SELECT * FROM user WHERE id = '${req.body.id}'`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else if (rows.length < 0) {
            res.status(400).json('User does not exist.')
        } else {
            var name        = (req.body.name == undefined) ? '' : `name = '${req.body.name}', `
            var nic         = (req.body.nic == undefined) ? '' : `nic = '${req.body.nic}', `
            var role_id     = (req.body.role_id == undefined) ? '' : `role_id = '${req.body.role_id}', `
            var email       = (req.body.email == undefined) ? '' : `email = '${req.body.email}', `
            var telephone   = (req.body.telephone == undefined) ? '' : `telephone = '${req.body.telephone}', `
            var street      = (req.body.street == undefined) ? '' : `street = '${req.body.street}', `
            var city        = (req.body.city == undefined) ? '' : `city = '${req.body.city}', `
            var province    = (req.body.province == undefined) ? '' : `province = '${req.body.province}', `
            var postal_code = (req.body.postal_code == undefined) ? '' : `postal_code = '${req.body.postal_code}', `
            var username    = (req.body.username == undefined) ? '' : `username = '${req.body.username}', `
            var password    = (req.body.password == undefined) ? '' : `password = '${req.body.password}', `

            connection.query(`UPDATE user SET 
                ${name}
                ${nic}
                ${role_id}
                ${email}
                ${telephone}
                ${street}
                ${city}
                ${province}
                ${postal_code}
                id = '${req.body.id}'
                WHERE id = ${req.body.id}
                `, function (err, result) {
                if (err) {
                    next(err)
                } else {
                    connection.query(`UPDATE login SET
                        ${username}
                        ${password}
                        user_id = '${req.body.id}'
                        WHERE user_id = ${req.body.id}         
                    `, function (err2, result2) {
                        if (err2) {
                            handleError(res, err2.message, 'Failed to update user.')
                        } else {
                            res.status(204)
                            res.end()
                        }
                    })
                }
            })
        }
    })
})

// Delete user
userRouter.post('/delete', function (req, res, next) {
    if (!req.body.id) {
        var err        = new Error()
        err.status     = 'Invalid user ID'
        err.statusCode = 400
        next(err)
        return
    }

    connection.query(`DELETE FROM login WHERE user_id = '${req.body.id}'`, function (err, rows, fields) {
        if (err) {
            next(err)
        } else {
            connection.query(`DELETE FROM user WHERE id = '${req.body.id}'`, function (err2, rows, fields) {
                if (err2) {
                    next(err2)
                } else {
                    res.status(204)
                    res.end()
                }
            })
        }
    })
})

module.exports = userRouter
