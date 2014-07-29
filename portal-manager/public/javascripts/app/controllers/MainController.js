var app = angular.module('app', [ 'ui.bootstrap', 'dialogs', 'messages', 'authenticator', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('MainController', function($scope, $http, $rootScope, $timeout, $dialogs, $messages, $authenticator) {

    $scope.sections = [];
    $scope.categories = [];
    $scope.contents = [];

    $http.get('/page-sections').success(function(data) {
        $scope.sections = data.items;
    });

    $http.get('/page-categories').success(function(data) {
        $scope.categories = data.items;
    });

    $http.get('/page-contents').success(function(data) {
        $scope.contents = data.items;
    });

});