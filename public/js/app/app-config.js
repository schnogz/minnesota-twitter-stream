var app = angular.module('mnTweets', ['uiGmapgoogle-maps', 'ngRoute', 'ngMaterial']);

app.config(["$routeProvider", "$mdThemingProvider", "$mdIconProvider", function ($routeProvider, $mdThemingProvider, $mdIconProvider) {
	// route configurations
	$routeProvider.when("/", {
		templateUrl: "js/app/templates/app-login.html"
	}).when("/stream", {
		templateUrl: "js/app/templates/app-stream.html",
		controller: "mainCtrl"
	}).otherwise({
		redirectTo: "/"
	});

	// icon configurations
	$mdIconProvider
		.icon("menu", "images/menu.svg", 24)
		.icon("star-full", "images/star.png", 24)
		.icon("star-empty", "images/star-empty.png", 24)
		.icon("retweet", "images/retweet.png", 24);

	// theme configurations
	$mdThemingProvider.theme('default')
		.primaryPalette('red')
		.accentPalette('blue');
}]);



