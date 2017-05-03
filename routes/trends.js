var twitter = require('ntwitter');
var twitterConfig = require('./../config/twitter');

exports.trends = function (request, response) {
  if (request.session.oauth) {

    var twitConnection = new twitter({
      consumer_key: twitterConfig.consumer_key,
      consumer_secret: twitterConfig.consumer_secret,
      access_token_key: request.session.oauth.access_token,
      access_token_secret: request.session.oauth.access_token_secret
    });

    // get MPLS's current trends since Twitter wont honor MN's WOEID
    twitConnection.get('/trends/place.json', {id: 2452078}, function (x, data) {
      response.send(data);
    });
  } else {
    console.log("Missing OAuth session!");
  }
};