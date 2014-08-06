var app = angular.module('app', ['ui.bootstrap', 'messages', 'authenticator', 'ngCookies', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('LoginController', function($scope, $http, $rootScope, $timeout, $messages, $authenticator, $window, $cookies, $cookieStore) {

    $scope.user = {
        username : '',
        password : '',
        rememberMe : false
    };

    if ($cookies.remember) {
        var remember = JSON.parse($cookies.remember.substring(2));
        $scope.user.username = remember.username;
        $scope.user.password = remember.password;
        $scope.user.rememberMe = true;
    }

    $authenticator.logoutSuccessfully();

    $scope.login = function() {
        $messages.cleanAllMessages();
        $http.post('/login', $scope.user).success(function(data) {
            $messages.addSuccessMessage('Login realizado com sucesso!');
            $authenticator.loginSuccessfully(data);
            $window.location = data.redirectTo;
        }).error(function(data, status, header, config) {
            if (status === 403) {
                $messages.addErrorMessage('A credencial informada é inválida.');
            } else {
                $messages.addErrorMessage('Ocorreu um erro na execução.');
            }
        });
    };

    $("body").css("padding-top", "0px");
});
