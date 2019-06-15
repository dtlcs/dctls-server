// Generic error handler used by all endpoints.
var genericErrorHandler = function handleError(err, req, res, next) {
    console.log('ERROR: ' + (err.status ? err.statusCode + ' - ' + err.status : err))
    res.status(err.statusCode || 500).json({
        'error': err
    })
}

module.exports = genericErrorHandler
