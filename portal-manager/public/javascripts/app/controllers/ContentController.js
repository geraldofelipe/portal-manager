var app = angular.module('app',
        [ 'app.directives', 'app.services', 'ui.bootstrap', 'dialogs', 'messages', 'authenticator', 'angular-loading-bar', 'ngAnimate', 'textAngular' ]);
app.controller('ContentController', function($scope, $http, $rootScope, $timeout, $dialogs, $messages, $authenticator, ModelManager) {

    $scope.sections = [];
    $scope.categories = [];
    
    var listSections = function() {
        $http.get('/sections').success(function(data) {
            $scope.sections = data.items;
        });
    };
    
    var listCategories = function() {
        $http.get('/categories').success(function(data) {
            $scope.categories = data.items;
        });
    };

    var manager = new ModelManager({
        name : 'content',
        listUrl : '/contents',
        pageUrl : '/page-contents',
        predicate : 'title',
        newItem : function() {
            return {
                title : '',
                subtitle : '',
                initialText : '',
                fullText : '',
                category : ''
            };
        },
        focus : function() {
            $("#contentSection").focus();
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
        listCategories();
        listSections();
        $("#main").removeClass("active");
    });
});