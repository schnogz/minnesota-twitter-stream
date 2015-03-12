var app = angular.module('mnTweets', ['uiGmapgoogle-maps', 'ngRoute', 'ngMaterial']);

app.config(["$routeProvider", "$locationProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "js/app/templates/main.html",
        controller: "mainController"
    }).otherwise({
        redirectTo: "/"
    });

}]);

app.controller("mainController", function($scope) {

    function TweetMarker(id, latitude, longitude,text) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.title = text;
        this.clickHandler = function(e) {
            test().call(this);
        };
        this.icon = "/images/icon.png";
    }

    function Tweet(id, latitude, longitude, text, user_picture, user_screenName) {
        this.markInfo =  new TweetMarker(id, latitude, longitude, text, user_picture);
        this.tweetText = text;
        this.userProfile = {
            picture: user_picture,
            url: "http://www.twitter.com/" + user_screenName
        };
    }

    $scope.count = 0;
    $scope.tweets = [];
    $scope.tweetMarks = [];
    $scope.trends;

    // initialize socket connection
    var socket = io.connect('http://localhost:3001');
    window.socket = socket;

    socket.on("newTrendData", function (data) {
        console.log(data);
        $scope.trends = data[0].trends;
        $scope.$apply();
    });

    socket.on('newTweet', function (tweet) {

        // some tweets don't seem to have geo coordinates... wtf?
        if (tweet.coordinates && tweet.coordinates.coordinates) {

            var twit = new Tweet(
                tweet.id,
                tweet.coordinates.coordinates[1],
                tweet.coordinates.coordinates[0],
                tweet.text,
                tweet.user.profile_image_url,
                tweet.user.screen_name
            );

            $scope.tweetMarks.push(twit.markInfo);
            $scope.tweets.push(twit);

            $scope.count++;

            $scope.$apply();

            var elem = document.getElementById('sidebar-tweet-container');
            elem.scrollTop = elem.scrollHeight;
        } else {
            console.log(tweet);
        }
    });

    // configure map
    $scope.map = {
        center: {
            latitude: 46.50,
            longitude: -92.00
        },
        zoom: 7,
        options: {
            draggable: true,
            minZoom: 7,
            disableDefaultUI: true,
            styles: [{"featureType":"water","stylers":[{"color":"#0e171d"}]},{"featureType":"landscape","stylers":[{"color":"#1e303d"}]},{"featureType":"road","stylers":[{"color":"#1e303d"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"color":"#182731"},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"color":"#f0c514"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#1e303d"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#e77e24"},{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#94a5a6"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#e84c3c"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#e84c3c"}]},{"featureType":"poi","stylers":[{"color":"#e84c3c"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType": "road.local","elementType": "geometry.fill","stylers": [{"color": "#CCFF33"},{"lightness": 17}]}]
        }
    };

});