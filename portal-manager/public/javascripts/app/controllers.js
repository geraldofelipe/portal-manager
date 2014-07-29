'use strict';

/* Controllers */

angular.module([ 'messages' ]).controller('MessagesController', function($scope, $http, $rootScope, $timeout, $messages) {
    $scope.messages = [];

    $scope.close = function(index) {
        $scope.messages.splice(index, 1);
    };

    $scope.$on('messageBroadcast', function() {
        $scope.messages.push({
            type : $messages.type,
            msg : $messages.message
        });
        $(document).scrollTop(0);
    });
    $scope.$on('cleanMessagesBroadcast', function() {
        $scope.messages = [];
    });
});

angular.module([ 'ngAnimate' ]).controller('NavigationController', function($scope, $http, $rootScope, $timeout, $dialogs, $messages, $authenticator) {

    $scope.navigate = function(route) {
        $http.get(route).success(function(data) {
            $(".container").html(data);
        });
    };

});