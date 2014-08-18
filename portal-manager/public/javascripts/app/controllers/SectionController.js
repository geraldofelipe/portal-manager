var app = angular.module('app', [ 'app.services', 'app.directives', 'messages', 'angular-loading-bar', 'ngAnimate' ]);
app.controller('SectionController', function($scope, $http, $rootScope, $timeout, $controller, $messages, AppManager) {

    var manager = new AppManager({
        name : 'section',
        listUrl : '/sections',
        pageUrl : '/page-sections',
        predicate : 'name',
        historyPredicate : 'version',
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