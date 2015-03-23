angular.module('mnTweets').controller('mainCtrl', [
	'$scope',
	'$mdSidenav',
	'$mdBottomSheet',
	'$log',
function(
	$scope,
	$mdSidenav,
	$mdBottomSheet
){

	angular.element(document).on('visibilitychange', function(e) {
		// if page is now active, reset missed tweets count and update page title
		if (!window.document.hidden) {
			// update page title
			window.document.title = 'Minnesota Tweet Map';
			$scope.tweetsMissed = 0;
		}
	});

	$scope.title ="Tweets From Minnesota";
	$scope.count = 0;
	$scope.tweetsMissed = 0;
	$scope.tweets = [];
	$scope.tweetMarks = [];
	$scope.trends = null;

	$scope.showHideSidebar = function () {
		$mdBottomSheet.hide();
		$mdSidenav('left').toggle();
	};

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
		this.showTweetDetails = function(eventData) {
			$mdBottomSheet.show({
				parent: angular.element(document.getElementById('content')),
				templateUrl: 'js/app/templates/tweet-details.html',
				controller: 'tweetDetailsCtrl'
				//scope: eventData.model,
				//bindToController: true,
				//targetEvent: eventData
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

	//TODO: ajax into new endpoint after successful twitter login
	/* socket.on("newTrendData", function (data) {
		console.log(data);
		$scope.trends = data[0].trends;
		$scope.$apply();
	});	*/

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