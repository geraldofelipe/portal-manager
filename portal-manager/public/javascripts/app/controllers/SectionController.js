var app = angular.module('app',
        [ 'app.services', 'app.directives', 'ui.bootstrap', 'dialogs', 'messages', 'authenticator', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('SectionController', function($scope, $http, $rootScope, $timeout, $dialogs, $controller, $messages, $authenticator, ModelManager) {

    var manager = new ModelManager({
        name : 'section',
        listUrl : '/sections',
        pageUrl : '/page-sections',
        predicate : 'name',
        newItem : function() {
            return {
                code : '',
                name : '',
                description : ''
            };
        },
        focus : function() {
            $("#sectionCode").focus();
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