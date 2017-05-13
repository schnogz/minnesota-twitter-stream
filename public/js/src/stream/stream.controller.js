(function () {
  'use strict';

  angular
    .module('mnTweets')
    .controller('streamCtrl', ['$scope', '$timeout', 'NgMap', 'mapConfig', function ($scope, $timeout, NgMap, mapConfig) {
      $scope.mapMarker = "/images/tweet-mark.png";
      $scope.mapStyle = mapConfig.style;
      $scope.tweets = [];

      // animates the selected tweet
      $scope.animateTweetMarker = function(tweet) {
        tweet.marker.setAnimation(google.maps.Animation.BOUNCE);

        // stop the animation after 3 seconds
        $timeout(function() {
          tweet.marker.setAnimation(null);
        }, 3000);
      };

      // save a map reference to display markers later
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
          location: {
            lat: _.get(tweetData, 'coordinates.coordinates[1]') ?
              tweetData.coordinates.coordinates[1] : tweetData.place.bounding_box.coordinates[0][0][1],
            long: _.get(tweetData, 'coordinates.coordinates[0]') ?
              tweetData.coordinates.coordinates[0] : tweetData.place.bounding_box.coordinates[0][0][0],
          },
          user: {
            picUrl: tweetData.user.profile_image_url,
            name: tweetData.user.name,
            screen_name: tweetData.user.screen_name
          }
        };

        tweet.marker = new google.maps.Marker({
          position: new google.maps.LatLng(tweet.location.lat, tweet.location.long),
          map: $scope.map,
          draggable: false,
          clickable: false,
          animation: google.maps.Animation.DROP,
          title: tweet.text,
          icon:  {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            size: new google.maps.Size(25, 30),
          },
          zIndex: $scope.tweets.length // ensures latest tweet marker is on top
        });

        $scope.tweets.push(tweet);
        $scope.$apply();
      });
    }]);
})();