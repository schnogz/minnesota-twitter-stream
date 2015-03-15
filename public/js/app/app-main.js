var app = angular.module('mnTweets', ['uiGmapgoogle-maps', 'ngRoute', 'ngMaterial']);

app.config(["$routeProvider", "$mdThemingProvider", "$mdIconProvider", function ($routeProvider, $mdThemingProvider, $mdIconProvider) {
	// route configurations
	$routeProvider.when("/", {
		templateUrl: "js/app/templates/app-main.html",
		controller: "mainCtrl"
	}).otherwise({
		redirectTo: "/"
	});

	// icon configurations
	$mdIconProvider.icon("menu", "images/menu.svg", 24);

	// theme configurations
	$mdThemingProvider.theme('default')
		.primaryPalette('red')
		.accentPalette('blue');
}]);

app.controller('mainCtrl', ['$scope', '$mdSidenav', '$mdBottomSheet', '$log', function($scope, $mdSidenav, $mdBottomSheet) {

	$scope.title ="Tweets From Minnesota";
	$scope.count = 0;
	$scope.tweets = [];
	$scope.tweetMarks = [];
	$scope.trends = null;

	$scope.showHideSidebar = function () {
		$mdBottomSheet.hide();
		$mdSidenav('left').toggle();
	};

	function tweetDetailsCtrl($mdBottomSheet) {
		this.performAction = function (action) {
			$mdBottomSheet.hide(action);
		};
	}

	// map configuration
	// TODO: move into service or json file
	$scope.map = {
		center: {
			latitude: 46.50,
			longitude: -93.30
		},
		zoom: 7,
		options: {
			draggable: true,
			minZoom: 7,
			disableDefaultUI: true,
			styles: [{"featureType":"water","stylers":[{"color":"#0e171d"}]},{"featureType":"landscape","stylers":[{"color":"#1e303d"}]},{"featureType":"road","stylers":[{"color":"#1e303d"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"color":"#182731"},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"color":"#f0c514"},{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#1e303d"},{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#e77e24"},{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#94a5a6"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"simplified"},{"color":"#e84c3c"}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#e84c3c"}]},{"featureType":"poi","stylers":[{"color":"#e84c3c"},{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType": "road.local","elementType": "geometry.fill","stylers": [{"color": "#CCFF33"},{"lightness": 17}]}]
		}
	};

	// #1e303d, 30,48,61 -- dark blue
	// #94a5a6 -- light baby blue
	// #e84c3c 232,76,60  -- dark red

	function TweetMarker(id, latitude, longitude,text) {
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
		this.title = text;
		this.showTweetDetails = function(e) {
			$mdBottomSheet.show({
				parent: angular.element(document.getElementById('content')),
				templateUrl: 'js/app/templates/bottomSheet.html',
				controller: [ '$mdBottomSheet', tweetDetailsCtrl],
				controllerAs: "vm",
				bindToController: true,
				targetEvent: ""
			}).then(function (clickedItem) {
				clickedItem && console.log(clickedItem.name + ' clicked!');
			});
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

			// auto scroll to latest tweets in sidebar
			var sidebar = document.getElementById('sidebar-tweet-list');
			sidebar.scrollTop = sidebar.scrollHeight;

		} else {
			//TODO: investigate how to plot tweet
			console.log(tweet);
		}
	});
}]);



