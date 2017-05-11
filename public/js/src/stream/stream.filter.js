(function () {
  'use strict';

  angular
    .module('mnTweets')
    .filter('reverse', function () {
      return function (items) {
        return items.slice().reverse();
      };
    })
})();