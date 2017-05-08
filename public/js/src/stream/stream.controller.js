(function () {
  'use strict';

  angular
    .module('mnTweets')
    .controller('streamCtrl', ['$scope', '$mdSidenav', 'mapConfig', 'socket',
      function ($scope, $mdSidenav, mapConfig, socket) {
        $scope.title = "Tweets From Minnesota";
        $scope.count = 0;
        $scope.tweetsMissed = 0;
        $scope.tweets = [];
        $scope.tweetMarks = [];
        $scope.trends = null;
        $scope.isTweetHovered = false;
        // TODO: fix map
        $scope.map = mapConfig;
        $scope.showHideSidebar = function () {
          $mdSidenav('left').toggle();
        };

        angular.element(document).on('visibilitychange', function (e) {
          // if page is now active, reset missed tweets count and update page title
          if (!window.document.hidden) {
            // update page title
            window.document.title = 'Minnesota Tweet Map';
            $scope.tweetsMissed = 0;
          }
        });

        // TweetMarker class constructor
        function TweetMarker(id, latitude, longitude, text) {
          this.id = id;
          this.latitude = latitude;
          this.longitude = longitude;
          this.title = text;
          this.icon = "/images/tweet-mark.png";
        }

        // Tweet class constructor
        function Tweet(id, latitude, longitude, text, user_picture, user_name, user_screenName) {
          this.markInfo = new TweetMarker(id, latitude, longitude, text, user_picture);
          this.tweetText = text;
          this.tweetUrl = "http://www.twitter.com/";// + user_screenName + "/status/" + id;
          this.userProfile = {
            picture: user_picture,
            name: user_name,
            screen_name: user_screenName,
            url: "http://www.twitter.com/" + user_screenName
          };
        }

        socket.on('init', function (data) {
          console.log('socket connection initialized!')
        });

        // initialize socket connection
        socket.on('newTweet', function (tweet) {
          // heroku debugging
          console.info(tweet);
          // some tweets don't seem to have geo coordinates... wtf?
          if (tweet.coordinates && tweet.coordinates.coordinates) {

            var twit = new Tweet(
              tweet.id,
              tweet.coordinates.coordinates[1],
              tweet.coordinates.coordinates[0],
              tweet.text,
              tweet.user.profile_image_url,
              tweet.user.name,
              tweet.user.screen_name
            );

            $scope.tweetMarks.push(twit.markInfo);
            $scope.tweets.push(twit);

            $scope.count++;

            $scope.$apply();

            // if user is not hovering a tweet, auto scroll to latest tweets in sidebar
            if (!$scope.isTweetHovered) {
              var sidebar = document.getElementById('sidebar');
              sidebar.scrollTop = sidebar.scrollHeight;
            }

            // update page title if user is currently viewing page
            if (window.document.hidden) {
              $scope.tweetsMissed++;
              window.document.title = '(' + $scope.tweetsMissed + ')' + ' Minnesota Tweet Map';
            }
          } else {
            //TODO: investigate how to plot tweet
            console.log(tweet);
          }
        });
      }]);
})();