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

        new google.maps.Marker({
          position: new google.maps.LatLng(tweet.location.lat, tweet.location.long),
          map: $scope.map,
          draggable: false,
          animation: google.maps.Animation.DROP,
          title: tweet.text,
          icon:  {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            size: new google.maps.Size(25, 30),
          },
          zIndex: $scope.tweets.length
        });

        $scope.tweets.push(tweet);
        $scope.$apply();
      });
    }]);
})();