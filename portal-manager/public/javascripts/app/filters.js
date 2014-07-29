'use strict';

/* Filters */
var app = angular.module('app.filters', []);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        return input.slice(start);
    };
});