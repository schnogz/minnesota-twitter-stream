(function () {
  'use strict';

  angular
    .module('mnTweets', ['ngMap', 'ngRoute', 'ngMaterial'])
    .config(["$routeProvider", "$mdThemingProvider", function ($routeProvider, $mdThemingProvider) {
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

      // theme configurations
      $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('blue');
    }])
})();

