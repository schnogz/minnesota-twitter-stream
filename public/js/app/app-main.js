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


