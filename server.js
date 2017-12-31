var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var piRouter = require('./routes/pi-router');
var userRouter = require('./routes/user-router');
var junctionRouter = require('./routes/junction-router');
app.use('/pi', piRouter);
app.use('/user', userRouter);
app.use('/junction', junctionRouter);

var genericErrorHandler = require('./middleware/error-handler');
app.use(genericErrorHandler);

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("STLS Server now running on port", port);
});
