var twitter = require('ntwitter');
var io = require('socket.io').listen(3001, {log: false});

exports.index = function (req, res) {
    res.route;
    res.render('index', { title: 'MN Tweet Map' });
    if (req.session.oauth) {
        InitStream(req.session);
    }
};
var isActive = false;
var InitStream = function (session) {
    var twitConnection = new twitter({
        consumer_key: "A6x1nzmmmerCCmVN8zTgew",
        consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
        access_token_key: session.oauth.access_token,
        access_token_secret: session.oauth.access_token_secret
    });

    // get MPLS's current trends since Twitter wont honor MN's WOEID
    //TODO: figure out how to do this without a timeout. clientside doesnt seem to be subscribed to socket in time.
    //TODO: is there a way to see if client is listening or received event via socket.io?
    setTimeout(function() {
        twitConnection.get('/trends/place.json', { id: 2452078 }, function (x, data) {
            io.sockets.emit("newTrendData", data);
        });
    }, 500);

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
