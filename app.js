var express = require('express');
var path = require('path');
var streamRoute = require('./routes/stream');
var errorRoute = require('./routes/error');
var trendsRoute = require('./routes/trends');
var authRoute = require('./routes/auth');

var app = express();

// all environments
app.set('appName', 'Minnesota Tweet Map');
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// register middleware stack
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('super serial secret'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(express.session({
	secret: "very secret, for serial"
}));

if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler());
}

app.use(function(request, response) {
	console.error(request);
	request.session.invalidUrl = request.url;
	response.redirect('/error');
});

// register routes/endpoints
app.get('/', streamRoute.stream);
app.get('/error', errorRoute.error);
app.get('/trends', trendsRoute.trends);
app.get('/auth/twitter', authRoute.auth);
app.get('/auth/twitter/callback', authRoute.authCallback);

// start server
app.listen(app.get('port'), function() {
	console.log('Express server started and listening on port ' + app.get('port'));
});
