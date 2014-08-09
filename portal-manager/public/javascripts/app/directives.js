'use strict';
/* Directives */
var app = angular.module('app.directives', ['ngAnimate']);

app.directive('shakeThat', [ '$animate', function($animate) {

    return {
        require : '^form',
        scope : {
            submit : '&',
            submitted : '='
        },
        link : function(scope, element, attrs, form) {
            element.on('submit', function() {
                scope.$apply(function() {
                    if (form.$valid) {
                        return scope.submit();
                    }
                    scope.submitted = true;
                    $animate.addClass(element, 'shake', function() {
                        $animate.removeClass(element, 'shake');
                    });
                });
            });
        }
    };
} ]);

app.directive('uppercase', function() {
    return {
        require : 'ngModel',
        link : function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue) {
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }
    };
});

app.directive('capitalize', function() {
    return {
        require : 'ngModel',
        link : function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue) {
                    var parts = inputValue.split(" ");
                    if (parts.length > 0) {
                        var capitalized = "";
                        angular.forEach(parts, function(value, key) {
                            if (capitalized !== "") {
                                capitalized += " ";
                            }
                            capitalized += value.charAt(0).toUpperCase() + value.substring(1);
                        });
                        if (capitalized !== inputValue) {
                            modelCtrl.$setViewValue(capitalized);
                            modelCtrl.$render();
                        }
                        return capitalized;
                    }
                }
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }
    };
});

app.directive('capitalizeFirst', function() {
    return {
        require : 'ngModel',
        link : function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                if (inputValue) {
                    var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);
        }
    };
});

app.directive('match', [ function() {
    return {
        require : 'ngModel',
        scope : {
            match : '='
        },
        link : function(scope, element, attrs, ctrl) {
            element.on('keyup', function() {
                scope.$apply(function() {
                    var valid = element.val() === scope.match;
                    if (valid) {
                        $(".message-match").hide();
                    } else {
                        $(".message-match").show();
                    }
                    ctrl.$setValidity('match', valid);
                });
            });
        }
    };
} ]);