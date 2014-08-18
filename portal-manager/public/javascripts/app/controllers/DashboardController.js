var app = angular.module('app', [ 'messages', 'dialogs', 'authenticator', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('DashboardController', function($scope, $http, $rootScope, $timeout, $messages, $authenticator) {

    $scope.sections = [];
    $scope.categories = [];
    $scope.contents = [];

    $http.get('/page-sections').success(function(data) {
        $scope.sections = data.items;
    });

    $http.get('/page-categories').success(function(data) {
        $scope.categories = data.items;
    });

    $http.get('/page-contents?status=PUBLISHED').success(function(data) {
        $scope.contents = data.items;
    });

});