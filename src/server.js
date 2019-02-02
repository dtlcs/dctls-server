const express    = require('express')
const bodyParser = require('body-parser')

const piRouter       = require('./routes/pi-router')
const userRouter     = require('./routes/user-router')
const junctionRouter = require('./routes/junction-router')
const roleRouter     = require('./routes/role-router')

const app = express()
app.use(bodyParser.json())

// Allow CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET', 'POST')
    next()
})

// Add routers
app.use('/pi', piRouter)
app.use('/user', userRouter)
app.use('/junction', junctionRouter)
app.use('/role', roleRouter)

const genericErrorHandler = require('./middleware/error-handler')
app.use(genericErrorHandler)

// Initialize the app.
const server = app.listen(process.env.PORT || 7000, function () {
    let port = server.address().port
    console.log('STLS Server now running on port', port)
})
