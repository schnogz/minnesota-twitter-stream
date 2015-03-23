var twitter = require('ntwitter');
var twitterConfig = require('./../config/twitter');
var io = require('socket.io').listen(3001, {log: false});

exports.stream = function (request, response) {
	response.route;
	response.render('index', {
	    title: 'MN Tweet Map'
    });
    if (request.session.oauth) {
        InitStream(request.session);
    }
};

var isActive = false;
var InitStream = function (session) {
    var twitConnection = new twitter({
	    consumer_key: twitterConfig.consumer_key,
	    consumer_secret: twitterConfig.consumer_secret,
        access_token_key: session.oauth.access_token,
        access_token_secret: session.oauth.access_token_secret
    });

    if (!isActive) {
        console.log('Twitter stream initiated');

        // Stream tweets that are geotagged to MN
        twitConnection.stream('statuses/filter', { locations: '-93.462805,44.859106, -92.953844,45.095596' },
            function (stream) {
                stream.on('data', function (data) {
                    io.sockets.emit('newTweet', data);
                });
                stream.on('end', function (b) {
                    console.log('Twitter stream ended via stream.end :', b.toString());
                    isActive = false;
                    InitStream(session);
                });
                stream.on('destroy', function (b) {
                    console.log('Twitter stream ended via stream.destroy :', b.toString());
                    isActive = false;
                    InitStream(session);
                });
                stream.on('error', function(error) {
                    console.log('Twitter stream ended via stream.error');
                    isActive = false;
                    throw error;
                });
            }
        );
        isActive = true;
    }
    else {
        console.log("Twitter stream ended!");
    }
};
