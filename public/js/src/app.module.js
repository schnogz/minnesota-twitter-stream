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
    .value("mapConfig", {
      // google map style overrides
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
            "featureType": "water",
            "stylers": [
              {
                "color": "#0e171d"
              }
            ]
          },
          {
            "featureType": "landscape",
            "stylers": [
              {
                "color": "#1e303d"
              }
            ]
          },
          {
            "featureType": "road",
            "stylers": [
              {
                "color": "#1e303d"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "color": "#182731"
              },
              {
                "visibility": "simplified"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [
              {
                "color": "#f0c514"
              },
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1e303d"
              },
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#e77e24"
              },
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#94a5a6"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "simplified"
              },
              {
                "color": "#e84c3c"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              },
              {
                "color": "#e84c3c"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "color": "#e84c3c"
              },
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#CCFF33"
              },
              {
                "lightness": 17
              }
            ]
          }
        ]
      }
    })
    .factory('socket', ['$rootScope', function ($rootScope) {
      var socket = io.connect();
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      }
    }
    ]);
})();

