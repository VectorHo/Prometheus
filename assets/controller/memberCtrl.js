var memberModule = angular.module("memberModule", []);

memberModule.controller("memberCtrl", ["$scope", "$timeout", function($scope, $timeout) {

  $timeout(function() {
    $scope.members = [
    {
      username: "陈小亮",
      name: "陈文亮",
      email: "827286446@qq.com",
      phone: "15622368072",
      devRole: "前端开发",
      role: 1
    },{
      username: "陈小亮",
      name: "陈文亮",
      email: "827286446@qq.com",
      phone: "15622368072",
      devRole: "前端开发",
      role: 2
    },{
      username: "陈小亮",
      name: "陈文亮",
      email: "827286446@qq.com",
      phone: "15622368072",
      devRole: "前端开发",
      role: 3
    },{
      username: "陈小亮",
      name: "陈文亮",
      email: "827286446@qq.com",
      phone: "15622368072",
      devRole: "前端开发",
      role: 1
    },{
      username: "陈小亮",
      name: "陈文亮",
      email: "827286446@qq.com",
      phone: "15622368072",
      devRole: "前端开发",
      role: 1
    },{
      username: "陈小亮",
      name: "陈文亮",
      email: "827286446@qq.com",
      phone: "15622368072",
      devRole: "前端开发",
      role: 1
    }];

  }, 100);


  $scope.role = {
    1: "项目成员",
    2: "管理员",
    3: "超级管理员"
  }

}]);