// import express
var express = require('express');

// import middleware
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var path = require('path');

// import routes
var streamRoute = require('./routes/stream');
var error404 = require('./routes/error/404');
var error500 = require('./routes/error/500');
var trendsRoute = require('./routes/trends');
var authRoute = require('./routes/auth');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// register middleware stack
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'super serial secret'
}));
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
	app.use(errorHandler());
}

// register routes/endpoints
app.get('/', streamRoute.stream);
app.get('/error/404', error404.notFoundError);
app.get('/error/500', error500.internalError);
app.get('/trends', trendsRoute.trends);
app.get('/auth/twitter', authRoute.auth);
app.get('/auth/twitter/callback', authRoute.authCallback);

// catch and redirect server errors
app.use(function(error, request, response) {
	console.error(error.stack);
	response.redirect('/error/500');
});

// redirect undefined routes to 404 page
app.use(function(request, response) {
	console.error(request);
	request.session.invalidUrl = request.url;
	response.redirect('/error/404');
});

// start server
app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});




