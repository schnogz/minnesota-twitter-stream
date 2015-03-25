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
	$mdIconProvider.icon("menu", "images/menu.svg", 24);

	// theme configurations
	$mdThemingProvider.theme('default')
		.primaryPalette('red')
		.accentPalette('blue');
}]);

// google map style overrides
app.value("mapConfig", {
	center: {
		latitude: 46.50,
		longitude: -94.30
	},
	zoom: 7,
	options: {
		draggable: true,
		minZoom: 7,
		disableDefaultUI: true,
		styles: [
			{
				"featureType":"water",
				"stylers":[
					{
						"color":"#0e171d"
					}
				]
			},
			{
				"featureType":"landscape",
				"stylers":[
					{
						"color":"#1e303d"
					}
				]
			},
			{
				"featureType":"road",
				"stylers":[
					{
						"color":"#1e303d"
					}
				]
			},
			{
				"featureType":"poi",
				"stylers":[
					{
						"visibility":"off"
					}
				]
			},
			{
				"featureType":"transit",
				"stylers":[
					{
						"color":"#182731"
					},
					{
						"visibility":"simplified"
					}
				]
			},
			{
				"featureType":"poi",
				"elementType":"labels.icon",
				"stylers":[
					{
						"color":"#f0c514"
					},
					{
						"visibility":"off"
					}
				]
			},
			{
				"featureType":"poi",
				"elementType":"labels.text.stroke",
				"stylers":[
					{
						"color":"#1e303d"
					},
					{
						"visibility":"off"
					}
				]
			},
			{
				"featureType":"transit",
				"elementType":"labels.text.fill",
				"stylers":[
					{
						"color":"#e77e24"
					},
					{
						"visibility":"off"
					}
				]
			},
			{
				"featureType":"road",
				"elementType":"labels.text.fill",
				"stylers":[
					{
						"color":"#94a5a6"
					}
				]
			},
			{
				"featureType":"administrative",
				"elementType":"labels",
				"stylers":[
					{
						"visibility":"simplified"
					},
					{
						"color":"#e84c3c"
					}
				]
			},
			{
				"featureType":"administrative.country",
				"elementType":"labels",
				"stylers":[
					{
						"visibility":"off"
					},
					{
						"color":"#e84c3c"
					}
				]
			},
			{
				"featureType":"poi",
				"stylers":[
					{
						"color":"#e84c3c"
					},
					{
						"visibility":"off"
					}
				]
			},
			{
				"featureType":"administrative",
				"elementType":"geometry.fill",
				"stylers":[
					{
						"visibility":"off"
					}
				]
			},
			{
				"featureType":"road.local",
				"elementType":"geometry.fill",
				"stylers":[
					{
						"color":"#CCFF33"
					},
					{
						"lightness":17
					}
				]
			}
		]
	}
});


