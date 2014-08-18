var app = angular.module('app', [ 'app.directives', 'app.services', 'messages', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('UserController', function($scope, $http, $rootScope, $timeout, $messages, $controller, AppManager) {

    var manager = new AppManager({
        name : 'user',
        listUrl : '/users',
        pageUrl : '/page-users',
        predicate : 'name',
        newItem : function() {
            return {
                email : '',
                name : '',
                password : '',
                managerType : 'ADMIN',
                rememberMe : false
            };
        },
        focus : function() {
            if ($rootScope.item._id) {
                $("#userName").focus();
            } else {
                $("#userEmail").focus();
            }
        },
        hotkeys : function() {
            $("input:not(.hotkey)").bind("keydown.insert", function(evt) {
                $('#addButton').trigger("click");
                return false;
            }).bind("keydown.del", function(evt) {
                var index = $(this).attr("index");
                $('#removeButton' + index).trigger("click");
                return false;
            }).addClass("hotkey");
        }
    });

    $scope.status = function(id, status) {
        $messages.cleanAllMessages();
        $http.post('/user-status', {
            id : id,
            status : status
        }).success(function() {
            $messages.addSuccessMessage('Status alterado com com sucesso!');
            $timeout(function() {
                $rootScope.list();
                $rootScope.focus();
            }, 100);
        }).error(function(data, status, header, config) {
            $messages.addErrorMessage('Ocorreu um erro na execução.');
        });
    };

    $scope.managerType = function(id, managerType) {
        $messages.cleanAllMessages();
        $http.post('/user-type/', {
            id : id,
            managerType : managerType
        }).success(function() {
            $messages.addSuccessMessage('Tipo alterado com com sucesso!');
            $timeout(function() {
                $rootScope.list();
                $rootScope.focus();
            }, 100);
        }).error(function(data, status, header, config) {
            $messages.addErrorMessage('Ocorreu um erro na execução.');
        });
    };

    $(document).ready(function() {
        manager.init();
        $rootScope.form = $scope.mainForm;
        $("#main").removeClass("active");
    });

});