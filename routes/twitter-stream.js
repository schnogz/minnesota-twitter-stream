const Twitter = require('twitter');
const twitterConfig = require('./../config/api-keys');

var rt = new Twitter({
  consumer_key: twitterConfig.consumer_key,
  consumer_secret: twitterConfig.consumer_secret,
  access_token_key: twitterConfig.access_token_key,
  access_token_secret: twitterConfig.access_token_secret,
});

// export function for listening to the socket
module.exports = function (socket) {
  socket.emit('init', {
    msg: 'socket connection started'
  });

  // stream tweets that are geotagged to MN
  rt.stream('statuses/filter', {locations: '-93.462805,44.859106,-92.953844,45.095596'}, function (stream) {
      stream.on('data', function (data) {
        // stringify large object otherwise socket.io pukes
        socket.emit('newTweet', JSON.stringify(data));
      });

      stream.on('error', function (error) {
        console.log(error);
      });
    }
  );

  socket.on('disconnect', function () {
    socket.broadcast.emit('disconnect', {
      msg: 'socket connection ended'
    });
  });
};