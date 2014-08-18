var app = angular.module('app', [ 'app.directives', 'app.services', 'messages', 'angular-loading-bar', 'ngAnimate', 'textAngular' ]);
app.controller('ContentController', function($scope, $http, $rootScope, $timeout, $messages, AppManager) {

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

    var manager = new AppManager({
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
                $('#newActionButton').trigger("click");
                return false;
            }).addClass("hotkey");
        }
    });

    $scope.status = function(id, status) {
        $messages.cleanAllMessages();
        $http.post('/content-status', {
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

    $(document).ready(function() {
        manager.init();
        listCategories();
        listSections();
        $rootScope.form = $scope.mainForm;
        $("#main").removeClass("active");
    });
});