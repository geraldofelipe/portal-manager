'use strict';

angular.module('app', [ 'app.filters', 'app.services', 'app.directives' ]).config(
        [ '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
        } ]);

angular
        .module('dialogs', [ 'dialogs.services', 'ngSanitize' ])
        .run(
                [
                        '$templateCache',
                        function($templateCache) {
                            $templateCache
                                    .put(
                                            '/dialogs/error.html',
                                            '<div class="modal-header dialog-header-error"><button type="button" class="close" ng-click="close()">&times;</button><h4 class="modal-title text-danger"><span class="glyphicon glyphicon-warning-sign"></span> Error</h4></div><div class="modal-body text-danger" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="close()">Fechar</button></div>');
                            $templateCache
                                    .put(
                                            '/dialogs/wait.html',
                                            '<div class="modal-header dialog-header-wait"><h4 class="modal-title"><span class="glyphicon glyphicon-time"></span> Please Wait</h4></div><div class="modal-body"><p ng-bind-html="msg"></p><div class="progress progress-striped active"><div class="progress-bar progress-bar-info" ng-style="getProgress()"></div><span class="sr-only">{{progress}}% Completo</span></div></div>');
                            $templateCache
                                    .put(
                                            '/dialogs/notify.html',
                                            '<div class="modal-header dialog-header-notify"><button type="button" class="close" ng-click="close()" class="pull-right">&times;</button><h4 class="modal-title text-info"><span class="glyphicon glyphicon-info-sign"></span> {{header}}</h4></div><div class="modal-body text-info" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="close()">OK</button></div>');
                            $templateCache
                                    .put(
                                            '/dialogs/confirm.html',
                                            '<div class="modal-header dialog-header-confirm"><button type="button" class="close" ng-click="no()">&times;</button><h4 class="modal-title"><span class="glyphicon glyphicon-check"></span> {{header}}</h4></div><div class="modal-body" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="yes()">Sim</button><button type="button" class="btn btn-primary" ng-click="no()">Não</button></div>');
                        } ]);
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'moment' ], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../moment')); // Node
    } else {
        factory(window.moment); // Browser global
    }
}(function(moment) {
    return moment.lang('pt-br', {
        months : "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
        monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
        weekdays : "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
        weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
        weekdaysMin : "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),
        longDateFormat : {
            LT : "HH:mm",
            L : "DD/MM/YYYY",
            LL : "D [de] MMMM [de] YYYY",
            LLL : "D [de] MMMM [de] YYYY LT",
            LLLL : "dddd, D [de] MMMM [de] YYYY LT"
        },
        calendar : {
            sameDay : '[Hoje às] LT',
            nextDay : '[Amanhã às] LT',
            nextWeek : 'dddd [às] LT',
            lastDay : '[Ontem às] LT',
            lastWeek : function() {
                return (this.day() === 0 || this.day() === 6) ? '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : "em %s",
            past : "%s atrás",
            s : "segundos",
            m : "um minuto",
            mm : "%d minutos",
            h : "uma hora",
            hh : "%d horas",
            d : "um dia",
            dd : "%d dias",
            M : "um mês",
            MM : "%d meses",
            y : "um ano",
            yy : "%d anos"
        },
        ordinal : '%dº'
    });
}));

var application = {
    view : {
        datetimepicker : function() {
            $('.input-group.date').datetimepicker({
                language : "pt-BR",
                pickTime : false
            }).on('change', function(ev) {
                $(ev.target).find('input').trigger('change');
            });
            $('.input-group.time').datetimepicker({
                language : "pt-BR",
                minuteStepping : 15,
                defaultTime : "00:00",
                pickDate : false
            }).on('change', function(ev) {
                $(ev.target).find('input').trigger('change');
            });
        }
    },
    util : {
        formatDate : function(date) {
            if (date.indexOf("/") != -1) {
                return date.substring(3, 5) + "/" + date.substring(0, 2) + "/" + date.substring(6, 10);
            }
            return date.substring(2, 4) + "/" + date.substring(0, 2) + "/" + date.substring(4, 8);
        }
    }
};

var reload = function() {

};

!function($) {

    $(function() {
        application.view.datetimepicker();
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            var msViewportStyle = document.createElement('style');
            msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));
            document.querySelector('head').appendChild(msViewportStyle);
        }
    });

}(window.jQuery);