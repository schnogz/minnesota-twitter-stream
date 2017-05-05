const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const path = require('path');
const express = require('express');
const http = require('http');
// routes
const twitterStream = require('./routes/twitter-stream.js');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

io.on('connection', twitterStream);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.static(path.join(__dirname, 'public')));

// log errors
app.use(function (error, request, response) {
  // TODO: do this better and use logger/morgan
  console.error(error.stack);
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});