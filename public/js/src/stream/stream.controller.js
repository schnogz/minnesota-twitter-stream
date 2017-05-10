(function () {
  'use strict';

  angular
    .module('mnTweets')
    .controller('streamCtrl', ['$scope', 'NgMap', function ($scope, NgMap) {
      $scope.title = "Tweets From Minnesota";
      $scope.mapMarker = "/images/tweet-mark.png";
      $scope.count = 0;
      $scope.tweets = [];

      var socket = io.connect({transports: ['websocket'], upgrade: false});

      // initialize socket connection
      socket.on('init', function (data) {
        console.log(data.msg)
      });

      socket.on('tweet', function (data) {
        // parse the stringified tweet object
        var tweet = JSON.parse(data);

        $scope.tweets.push({
          id: tweet.id,
          tweetUrl: "http://www.twitter.com/", // + user_screenName + "/status/" + id;
          text: tweet.text,
          location: {
            lat: _.get(tweet, 'coordinates.coordinates[1]') ? tweet.coordinates.coordinates[1] : tweet.place.bounding_box.coordinates[0][0][1],
            long: _.get(tweet, 'coordinates.coordinates[0]') ? tweet.coordinates.coordinates[0] : tweet.place.bounding_box.coordinates[0][0][0],
          },
          user: {
            picUrl: tweet.user.profile_image_url,
            name: tweet.user.name,
            screen_name: tweet.user.screen_name
          }
        });

        $scope.count++;
        $scope.$apply();
      });
    }]);
})();