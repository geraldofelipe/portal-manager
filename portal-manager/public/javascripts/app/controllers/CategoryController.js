var app = angular.module('app', [ 'app.directives', 'app.services', 'messages', 'authenticator', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('CategoryController', function($scope, $http, $rootScope, $timeout, $controller, $messages, AppManager) {

    var manager = new AppManager({
        name : 'category',
        listUrl : '/categories',
        pageUrl : '/page-categories',
        predicate : 'name',
        newItem : function() {
            return {
                code : '',
                name : '',
                description : ''
            };
        },
        focus : function() {
            $("#categoryCode").focus();
        },
        hotkeys : function() {
            $("input:not(.hotkey)").bind("keydown.insert", function(evt) {
                $('#newActionButton').trigger("click");
                return false;
            }).addClass("hotkey");
        }
    });

    $(document).ready(function() {
        manager.init();
        $rootScope.form = $scope.mainForm; 
        $("#main").removeClass("active");
    });

});
