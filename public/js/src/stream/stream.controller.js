(function () {
  'use strict';

  angular
    .module('mnTweets')
    .controller('streamCtrl', ['$scope', 'NgMap', function ($scope, NgMap) {
      $scope.mapMarker = "/images/tweet-mark.png";
      $scope.tweets = [];

      NgMap.getMap().then(function(map) {
        $scope.map = map;
      });

      var socket = io.connect({transports: ['websocket'], upgrade: false});

      // initialize socket connection
      socket.on('init', function (data) {
        console.log(data.msg)
      });

      socket.on('tweet', function (data) {
        // parse the stringified tweet object
        var tweetData = JSON.parse(data);
        var tweet = {
          id: tweetData.id,
          text: tweetData.text,
          location: _buildLocation(tweetData),
          user: {
            picUrl: tweetData.user.profile_image_url,
            name: tweetData.user.name,
            screen_name: tweetData.user.screen_name
          }
        };

        $scope.tweets.push(tweet);

        /* TODO: test this later
        new google.maps.Marker({
          position: new google.maps.LatLng(tweet.place.bounding_box.coordinates[0][0][1], tweet.place.bounding_box.coordinates[0][0][0]),
          map: $scope.map,
          draggable: false,
          animation: google.maps.Animation.DROP
        });
        */
        $scope.$apply();
      });

      function _buildLocation(tweet) {
        if (_.get(tweet, 'coordinates.coordinates[1]')) {
          return '' + tweet.coordinates.coordinates[1] + ',' + tweet.coordinates.coordinates[0];
        }

        return '' + tweet.place.bounding_box.coordinates[0][0][1] + ',' + tweet.place.bounding_box.coordinates[0][0][0];
      }
    }]);
})();