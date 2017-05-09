const Twitter = require('twitter');
const twitterConfig = require('./../config/api-keys');

var test = {
  consumer_key: process.env.heroku_twit_key ? process.env.heroku_twit_ckey : twitterConfig.consumer_key,
  consumer_secret: process.env.heroku_twit_secret ? process.env.heroku_twit_secret : twitterConfig.consumer_secret,
  access_token_key: process.env.heroku_twit_token_key ? process.env.heroku_twit_token_key : twitterConfig.access_token_key,
  access_token_secret: process.env.heroku_twit_token_secret ? process.env.heroku_twit_token_secret :twitterConfig.access_token_secret
};

console.log(test);

// pull twitter keys from node env vars if available
var rt = new Twitter(test);

// export function for listening to the socket
module.exports = function (socket) {
  socket.emit('init', {
    msg: 'socket connection started'
  });

  // stream tweets that are geotagged to MN
  rt.stream('statuses/filter', { locations: '-93.462805,44.859106,-92.953844,45.095596' }, function (stream) {
    stream.on('data', function (data) {
      // stringify large object otherwise socket.io pukes
      socket.emit('newTweet', JSON.stringify(data));
    });

    stream.on('error', function (error) {
      console.log(error);
    });
  });

  socket.on('disconnect', function () {
    console.log('socket connection ended');
  });
};