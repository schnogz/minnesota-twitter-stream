angular.module('mnTweets').controller('tweetDetailsCtrl', [
	'$scope',
	'$mdBottomSheet',
function(
	$scope,
	$mdBottomSheet
){
	$scope.title = "this might work";
	$scope.performAction = function (action) {
		$mdBottomSheet.hide(action);
	}
}]);
