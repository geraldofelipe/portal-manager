'use strict';

/* Services */
angular.module('messages', []).factory('$messages', function($rootScope) {
    return {
        type : '',
        message : '',
        addMessage : function(type, msg) {
            this.type = type;
            this.message = msg;
            this.broadcastMessage();
        },
        addErrorMessage : function(msg) {
            this.type = 'danger';
            this.message = msg;
            this.broadcastMessage();
        },
        addInfoMessage : function(msg) {
            this.type = 'info';
            this.message = msg;
            this.broadcastMessage();
        },
        addWarningMessage : function(msg) {
            this.type = 'warning';
            this.message = msg;
            this.broadcastMessage();
        },
        addSuccessMessage : function(msg) {
            this.type = 'success';
            this.message = msg;
            this.broadcastMessage();
        },
        cleanAllMessages : function(msg) {
            this.broadcastCleanMessages();
        },
        broadcastMessage : function() {
            $rootScope.$broadcast('messageBroadcast');
            $("#messages").show();
        },
        broadcastCleanMessages : function() {
            $("#messages").hide();
            $rootScope.$broadcast('cleanMessagesBroadcast');
        }
    };
});

angular.module('authenticator', [ 'localStorage' ]).factory('$authenticator', function($rootScope, $store) {
    return {
        userIsAuthenticated : false,
        userDetails : {
            email : '',
            name : ''
        },
        loginSuccessfully : function(user) {
            this.userIsAuthenticated = true;
            $store.set('userDetails', JSON.stringify({
                email : user.email,
                name : user.name
            }));
            $store.bind($rootScope, 'userIsAuthenticated', this.userIsAuthenticated);
        },
        logoutSuccessfully : function() {
            this.userIsAuthenticated = false;
            $store.remove('userDetails');
            $store.bind($rootScope, 'userIsAuthenticated', this.userIsAuthenticated);
        },
        isUserAuthenticated : function() {
            $store.bind($rootScope, 'userIsAuthenticated', this.userIsAuthenticated);
            return $store.get('userIsAuthenticated');
        }
    };
});

angular
        .module('localStorage', [])
        .factory(
                "$store",
                function($parse) {
                    /**
                     * Global Vars
                     */
                    var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage, supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');

                    var privateMethods = {
                        /**
                         * Pass any type of a string from the localStorage to be parsed so it returns a usable version (like an Object)
                         * 
                         * @param res -
                         *            a string that will be parsed for type
                         * @returns {*} - whatever the real type of stored value was
                         */
                        parseValue : function(res) {
                            var val;
                            try {
                                val = JSON.parse(res);
                                if (typeof val == 'undefined') {
                                    val = res;
                                }
                                if (val == 'true') {
                                    val = true;
                                }
                                if (val == 'false') {
                                    val = false;
                                }
                                if (parseFloat(val) == val && !angular.isObject(val)) {
                                    val = parseFloat(val);
                                }
                            } catch (e) {
                                val = res;
                            }
                            return val;
                        }
                    };
                    var publicMethods = {
                        /**
                         * Set - let's you set a new localStorage key pair set
                         * 
                         * @param key -
                         *            a string that will be used as the accessor for the pair
                         * @param value -
                         *            the value of the localStorage item
                         * @returns {*} - will return whatever it is you've stored in the local storage
                         */
                        set : function(key, value) {
                            if (!supported) {
                                try {
                                    $.cookie(key, value);
                                    return value;
                                } catch (e) {
                                    console.log('Local Storage not supported, make sure you have the $.cookie supported.');
                                }
                            }
                            var saver = JSON.stringify(value);
                            storage.setItem(key, saver);
                            return privateMethods.parseValue(saver);
                        },
                        /**
                         * Get - let's you get the value of any pair you've stored
                         * 
                         * @param key -
                         *            the string that you set as accessor for the pair
                         * @returns {*} - Object,String,Float,Boolean depending on what you stored
                         */
                        get : function(key) {
                            if (!supported) {
                                try {
                                    return privateMethods.parseValue($.cookie(key));
                                } catch (e) {
                                    return null;
                                }
                            }
                            var item = storage.getItem(key);
                            return privateMethods.parseValue(item);
                        },
                        /**
                         * Remove - let's you nuke a value from localStorage
                         * 
                         * @param key -
                         *            the accessor value
                         * @returns {boolean} - if everything went as planned
                         */
                        remove : function(key) {
                            if (!supported) {
                                try {
                                    $.cookie(key, null);
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            }
                            storage.removeItem(key);
                            return true;
                        },
                        /**
                         * Bind - let's you directly bind a localStorage value to a $scope variable
                         * 
                         * @param $scope -
                         *            the current scope you want the variable available in
                         * @param key -
                         *            the name of the variable you are binding
                         * @param def -
                         *            the default value (OPTIONAL)
                         * @returns {*} - returns whatever the stored value is
                         */
                        bind : function($scope, key, def) {
                            def = def || '';
                            if (!publicMethods.get(key)) {
                                publicMethods.set(key, def);
                            }
                            $parse(key).assign($scope, publicMethods.get(key));
                            $scope.$watch(key, function(val) {
                                publicMethods.set(key, val);
                            }, true);
                            return publicMethods.get(key);
                        }
                    };
                    return publicMethods;
                });

var app = angular.module('app.services', []);

app.factory('ModelManager', function($rootScope, $http, $messages, $dialogs) {

    $rootScope.name = '';
    $rootScope.listUrl = '';
    $rootScope.pageUrl = '';
    $rootScope.predicate = '';
    $rootScope.item = {};
    $rootScope.newItem = function() {
    };
    $rootScope.focus = function() {
    };
    $rootScope.hotkeys = function() {
    };
    $rootScope.items = [];
    $rootScope.action = false;

    var ModelManager = function(options) {
        $rootScope.name = options.name;
        if (options.pageUrl) {
            $rootScope.pageUrl = options.pageUrl;
        }
        if (options.listUrl) {
            $rootScope.listUrl = options.listUrl;
        }
        if (options.predicate) {
            $rootScope.predicate = options.predicate;
        }
        if (angular.isFunction(options.newItem)) {
            $rootScope.newItem = options.newItem;
        }
        if (angular.isFunction(options.focus)) {
            $rootScope.focus = options.focus;
        }
        if (angular.isFunction(options.hotkeys)) {
            $rootScope.hotkeys = options.hotkeys;
        }
    };

    // PAGINATION CONFIG
    $rootScope.currentPage = 0;
    $rootScope.pageSize = 1;

    $rootScope.prevPage = function() {
        $messages.cleanAllMessages();
        if ($rootScope.currentPage > 0) {
            $rootScope.currentPage--;
            $rootScope.list($rootScope.currentPage);
        }
    };

    $rootScope.nextPage = function() {
        $messages.cleanAllMessages();
        if ($rootScope.currentPage < $rootScope.pageSize - 1) {
            $rootScope.currentPage++;
            $rootScope.list($rootScope.currentPage + 1);
        }
    };

    $rootScope.setPage = function() {
        $messages.cleanAllMessages();
        $rootScope.currentPage = this.n;
        $rootScope.list($rootScope.currentPage + 1);
    };

    $rootScope.range = function(start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    //
    $rootScope.doAction = function(action) {
        $rootScope.action = action;
    };

    ModelManager.prototype.init = function() {
        $rootScope.list();
        $rootScope.hotkeys();
        $rootScope.focus();
    };

    $rootScope.create = function() {
        $rootScope.item = $rootScope.newItem();
        $rootScope.focus();
    };

    $rootScope.list = function(page) {
        if (!page) {
            page = 1;
        }
        $http.get($rootScope.pageUrl + '?page=' + page).success(function(data) {
            $rootScope.items = data.items;
            $rootScope.pageSize = data.pageCount;
        });
    };

    $rootScope.find = function(id) {
        if (!$rootScope.action) {
            $http.get('/' + $rootScope.name + '/' + id).success(function(data) {
                $rootScope.item = data.item;
                setTimeout(function() {
                    $rootScope.focus();
                }, 100);
            });
        }
    };

    $rootScope.remove = function(id) {
        var remove = function() {
            $messages.cleanAllMessages();
            $http({
                method : 'DELETE',
                url : '/' + $rootScope.name + '/' + id
            }, $rootScope.item).success(function() {
                $rootScope.list();
                $messages.addSuccessMessage('Operação realizada com sucesso!');
            }).error(function(data, status, header, config) {
                $messages.addErrorMessage('Ocorreu um erro na execução.');
            });
        };
        $dialogs.confirm('Confirmação', 'Deseja realmente excluir?').result.then(function(btn) {
            remove();
        }, function(btn) {

        });
    };

    $rootScope.save = function() {
        $messages.cleanAllMessages();
        var update = ($rootScope.item._id) || false;
        $http.post('/' + $rootScope.name, $rootScope.item).success(function() {
            if (!update) {
                $rootScope.create();
            }
            $messages.addSuccessMessage('Operação realizada com sucesso!');
            setTimeout(function() {
                $rootScope.list();
                $rootScope.focus();
            }, 100);
        }).error(function(data, status, header, config) {
            $messages.addErrorMessage('Ocorreu um erro na execução.');
        });
    };

    return ModelManager;
});