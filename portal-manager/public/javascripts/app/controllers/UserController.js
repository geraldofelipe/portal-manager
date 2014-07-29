var app = angular.module('app',
        [ 'app.directives', 'app.services', 'ui.bootstrap', 'dialogs', 'messages', 'authenticator', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('UserController', function($scope, $http, $rootScope, $timeout, $dialogs, $controller, $messages, $authenticator, ModelManager) {

    var manager = new ModelManager({
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

    $(document).ready(function() {
        manager.init();
        $("#main").removeClass("active");
    });

});