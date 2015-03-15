var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var OAuth = require('oauth').OAuth;
var twitterConfig =  require('./config/twitter');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(express.session({
	secret: "very secret"
}));

// development only
if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/error', routes.error);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server started and listening on port ' + app.get('port'));
});

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
    twitterConfig.consumer_key,
    twitterConfig.consumer_secret,
	"1.0",
	"http://localhost:3000/auth/twitter/callback",
	"HMAC-SHA1"
);

app.get('/auth/twitter', function(req, res) {
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		if (error) {
            // log error and redirect error page
            console.log(error);
            res.redirect('/error');
		} else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			req.session.oauth.token_secret = oauth_token_secret;
            // debug logging
            //console.log('oauth.token: ' + req.session.oauth.token);
			//console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
		}
	});
});

app.get('/auth/twitter/callback', function(req, res, next) {
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
			function(error, oauth_access_token, oauth_access_token_secret, results) {
				if (error) {
                    // log error and redirect error page
					console.log(error);
                    res.redirect('/error');
				} else {
                    // store access tokens
					req.session.oauth.access_token = oauth_access_token;
					req.session.oauth.access_token_secret = oauth_access_token_secret;

                    // redirect back to application home page
                    res.redirect('/');
				}
			}
		);
	} else {
        next(new Error("Wow you really messed something up. How did you even get here!?"));
    }
});