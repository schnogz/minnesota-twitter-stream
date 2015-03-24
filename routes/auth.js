var OAuth = require('oauth').OAuth;

// instantiate OAuth
var oauth = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"A6x1nzmmmerCCmVN8zTgew",
	"oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
	"1.0",
	"http://localhost:3000/auth/twitter/callback",
	"HMAC-SHA1"
);

exports.auth = function (request, response) {
	oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret) {
		if (error) {
			// log error and redirect error page
			console.log(error);
			request.redirect('/error');
		} else {
			request.session.oauth = {};
			request.session.oauth.token = oauth_token;
			request.session.oauth.token_secret = oauth_token_secret;
			// debug logging
			//console.log('oauth.token: ' + req.session.oauth.token);
			//console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			response.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
		}
	});
};

exports.authCallback = function (request, response, next) {
	if (request.session.oauth) {
		request.session.oauth.verifier = request.query.oauth_verifier;
		var oauthCreds = request.session.oauth;

		oauth.getOAuthAccessToken(oauthCreds.token, oauthCreds.token_secret, oauthCreds.verifier,
			function(error, oauth_access_token, oauth_access_token_secret) {
				if (error) {
					// log error and redirect error page
					console.log(error);
					response.redirect('/error');
				} else {
					// store access tokens
					request.session.oauth.access_token = oauth_access_token;
					request.session.oauth.access_token_secret = oauth_access_token_secret;

					// redirect to twitter stream page
					response.redirect('/#/stream');
				}
			}
		);
	} else {
		next(new Error("Wow you really messed something up. How did you even get here!?"));
	}
};

