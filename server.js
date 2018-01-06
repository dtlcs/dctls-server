var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());

// Allow CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET", "POST");
  next();
});

// Add routers
var piRouter = require('./routes/pi-router');
var userRouter = require('./routes/user-router');
var junctionRouter = require('./routes/junction-router');
var roleRouter = require('./routes/role-router');
app.use('/pi', piRouter);
app.use('/user', userRouter);
app.use('/junction', junctionRouter);
app.use('/role', roleRouter);

var genericErrorHandler = require('./middleware/error-handler');
app.use(genericErrorHandler);

// Initialize the app.
var server = app.listen(process.env.PORT || 7000, function () {
  var port = server.address().port;
  console.log("STLS Server now running on port", port);
});