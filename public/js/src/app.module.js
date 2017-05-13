(function () {
  'use strict';

  angular
    .module('mnTweets', ['ngMap', 'ngRoute', 'ngMaterial', 'ngAnimate'])
    .config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {
      // route configurations
      $routeProvider
        .when("/", {
          templateUrl: "js/src/welcome/welcome.template.html",
          controller: "welcomeCtrl"
        })
        .when("/stream", {
          templateUrl: "js/src/stream/stream.template.html",
          controller: "streamCtrl"
        })
        .otherwise({redirectTo: "/"});

      // theme configurations
      $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('blue');
    }])
    .value('mapConfig', {
      style: [
        {featureType: 'water', stylers: [{color: '#0e171d'}]},
        {featureType: 'landscape', stylers: [{color: '#1e303d'}]},
        {featureType: 'road', stylers: [{color: '#1e303d'}]},
        {featureType: 'poi', stylers: [{visibility: 'off'}]},
        {featureType: 'transit', stylers: [{color: '#182731'}, {visibility: 'simplified'}]},
        {featureType: 'poi', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
        {featureType: 'poi', elementType: 'labels.text.stroke', stylers: [{visibility: 'off'}]},
        {featureType: 'transit', elementType: 'labels.text.fill', stylers: [{visibility: 'off'}]},
        {featureType: 'road', elementType: 'labels.text.fill', stylers: [{color: '#94a5a6'}]},
        {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {color: '#e84c3c'}]},
        {featureType: 'administrative.country', elementType: 'labels', stylers: [{visibility: 'off'}]},
        {featureType: 'poi', stylers: [{color: '#e84c3c'}, {visibility: 'off'}]},
        {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
        {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{color: '#CCFF33'}, {lightness: 17}]}]
    })
})();

