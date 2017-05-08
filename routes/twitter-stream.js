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

  // Stream tweets that are geotagged to MN
  rt.stream('statuses/filter', { locations: '-93.462805,44.859106,-92.953844,45.095596' }, function (stream) {
      stream.on('data', function (data) {
        console.info(data.text);
        socket.emit('newTweet', data);
      });

      stream.on('error', function (error) {
        console.log(error);
      });
    }
  );

  // send the new user their name and a list of users
  socket.emit('init', {
    msg: 'socket connection started'
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('disconnect', {
      msg: 'socket connection ended'
    });
  });
};