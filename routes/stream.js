const Twitter = require('twitter');
const twitterConfig = require('./../config/api-keys');
//const io = require('socket.io').listen(3001, { log: true });

module.exports = function (socket) {

  var rt = new Twitter({
    consumer_key: twitterConfig.consumer_key,
    consumer_secret: twitterConfig.consumer_secret,
    access_token_key: twitterConfig.access_token_key,
    access_token_secret: twitterConfig.access_token_secret,
  });

  // Stream tweets that are geotagged to MN
  rt.stream('statuses/filter', {locations: '-93.462805,44.859106,-92.953844,45.095596'}, function (stream) {
    stream.on('data', function (data) {
      console.info(data.text);
      socket.emit('newTweet', data);
    });

    stream.on('error', function(error) {
      console.log(error);
    });
    }
  );
};
