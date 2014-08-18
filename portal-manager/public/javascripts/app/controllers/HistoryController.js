var app = angular.module('app', [ 'app.directives', 'app.services', 'messages', 'authenticator', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('HistoryController', function($scope, $http, $rootScope, $timeout, $controller, $messages, AppManager) {

    var manager = new AppManager({
        name : 'History',
        listUrl : '/histories',
        pageUrl : '/page-histories',
        predicate : 'type',
        newItem : function() {
            return {
                code : '',
                name : '',
                description : ''
            };
        },
        focus : function() {
            $("#HistoryCode").focus();
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
