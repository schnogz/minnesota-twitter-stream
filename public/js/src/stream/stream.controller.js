(function () {
  'use strict';

  angular
    .module('mnTweets')
    .controller('streamCtrl', ['$scope', '$mdSidenav', 'NgMap',
      function ($scope, $mdSidenav, NgMap) {
        $scope.title = "Tweets From Minnesota";
        $scope.count = 0;
        $scope.tweetsMissed = 0;
        $scope.tweets = [];
        $scope.tweetMarks = [];
        $scope.trends = null;

        var imagePath = 'https://image.flaticon.com/icons/svg/23/23957.svg';

        $scope.todos = [
          {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
          },
          {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
          },
          {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
          },
          {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
          },
          {
            face : imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
          },
        ];



        angular.element(document).on('visibilitychange', function (e) {
          // if page is now active, reset missed tweets count and update page title
          if (!window.document.hidden) {
            // update page title
            window.document.title = 'Minnesota Tweet Map';
            $scope.tweetsMissed = 0;
          }
        });

        NgMap.getMap().then(function(map) {
          map.zoom =12;
          console.log('markers', map.markers);
          console.log('shapes', map.shapes);
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

        var socket = io.connect({transports: ['websocket'], upgrade: false});

        // initialize socket connection
        socket.on('init', function (data) {
          console.log(data.msg)
        });

        socket.on('newTweet', function (data) {
          // parse the stringified tweet object
          var tweet = JSON.parse(data);

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