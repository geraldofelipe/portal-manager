var app = angular.module('app',
        [ 'app.directives', 'app.services', 'messages', 'authenticator', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('CategoryController', function($scope, $http, $rootScope, $timeout, $controller, $messages, PortalManager) {

    var manager = new PortalManager({
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
            $("#categorySection").focus();
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
