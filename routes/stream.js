const Twitter = require('twitter');
const twitterConfig = require('./../config/api-keys');
const io = require('socket.io').listen(3001, { log: true });

exports.stream = function (request, response) {
  let isSteamActive = false;
  response.route;
  response.render('index', {
    title: 'MN Tweet Map'
  });
  if (request.session.oauth) {
    InitStream(new Twitter({
      consumer_key: twitterConfig.consumer_key,
      consumer_secret: twitterConfig.consumer_secret,
      access_token_key: twitterConfig.access_token_key,
      access_token_secret: twitterConfig.access_token_secret,
    }));

    function InitStream(twitter) {
      if (!isSteamActive) {
        console.log('Twitter stream initiated');

        // Stream tweets that are geotagged to MN
        twitter.stream('statuses/filter', { locations: '-93.462805,44.859106,-92.953844,45.095596' },
          function (stream) {
            stream.on('data', function (data) {
              console.log('MEW');
              io.sockets.emit('newTweet', data);
            });
            stream.on('end', function (b) {
              console.log('Twitter stream ended via stream.end :', b.toString());
              isSteamActive = false;
              InitStream(twitter);
            });
            stream.on('destroy', function (b) {
              console.log('Twitter stream ended via stream.destroy :', b.toString());
              isSteamActive = false;
              InitStream(twitter);
            });
            stream.on('error', function (error) {
              console.info(error);
              console.log('Twitter stream ended via stream.error');
              isSteamActive = false;
              throw error;
            });
          }
        );
        isSteamActive = true;
      }
      else {
        console.log("Twitter stream ended!");
      }
    }
  }
};
