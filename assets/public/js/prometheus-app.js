var app = angular.module('prometheus', ['ngRoute', 'indexModule', 'memberModule']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/member", {
    templateUrl: "views/member.html",
    controller: "memberCtrl"
  })
  .otherwise({
    templateUrl: "views/index.html",
    controller: "indexCtrl"
  });
}]);

app.controller("navCtrl", ["$scope", "$location", function($scope, $location) {

  $scope.go = function(page) {
    $location.url(page);
  }

}]);
