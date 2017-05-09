(function () {
  'use strict';

  angular
    .module('mnTweets', ['ngMap', 'ngRoute', 'ngMaterial'])
    .config(["$routeProvider", "$mdThemingProvider", "$mdIconProvider",
    function ($routeProvider, $mdThemingProvider, $mdIconProvider) {

      // route configurations
      $routeProvider
        .when("/", {
          templateUrl: "js/src/login/login.template.html",
          controller: "loginCtrl"
        })
        .when("/stream", {
          templateUrl: "js/src/stream/stream.template.html",
          controller: "streamCtrl"
        })
        .otherwise({redirectTo: "/"});

      // icon configurations
      $mdIconProvider
        .icon("menu", "images/menu.svg", 24)
        .icon("twitter-retweet", "images/twitter-buttons/retweet.svg", 24)
        .icon("twitter-details", "images/twitter-buttons/details.svg", 24)
        .icon("twitter-favorite", "images/twitter-buttons/favorite.svg", 24)
        .icon("twitter-reply", "images/twitter-buttons/reply.svg", 24);

      // theme configurations
      $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('blue');
    }])
})();

