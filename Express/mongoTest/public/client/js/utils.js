function map(obj, iterator, context) {
    var results = [];
    angular.forEach(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
    });
    return results;
}

function cancelBubble(evt) {
    // 阻止事件冒泡
    if (window.event) {
        // Chrome,IE6,Opera
        window.event.cancelBubble = true;
    } else {
        // FireFox 3
        evt.stopPropagation();
    }
}

function toBoolean(value) {
    if (typeof value === 'function') {
        value = true;
    } else if (value && value.length !== 0) {
        var v = angular.lowercase("" + value);
        value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
    } else {
        value = false;
    }
    return value;
}

var count = function(o) {
    var t = typeof o;
    if (t == 'string') {
        return o.length;
    } else if (t == 'object') {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return  n;
    }
    return 0;
};

function convertTimes(date) {
    var newDate = date.split('/');
    if (count(newDate) < 3) {
        newDate = date.split('-')
    }

    d = new Date();
    d.setFullYear(newDate[0]);
    d.setMonth(newDate[1]);
    d.setDate(newDate[2]);
    return Date.parse(d);
}

var module = angular.module('snailUtils', [])
    .filter('autoSortBy', function($filter, $parse) {
        return function(array, sortPredicate, reverseOrder) {
            if (!(array instanceof Array)) return array;
            if (!sortPredicate) return array;
            sortPredicate = sortPredicate instanceof Array ? sortPredicate : [sortPredicate];
            sortPredicate = map(sortPredicate, function(predicate) {
                var descending = false,
                    get = predicate || identity;
                if (angular.isString(predicate)) {
                    if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
                        descending = predicate.charAt(0) == '-';
                        predicate = predicate.substring(1);
                    }
                    get = $parse(predicate);
                    if (get.constant) {
                        var key = get();
                        return reverseComparator(function(a, b) {
                            return compare(a[key], b[key]);
                        }, descending);
                    }
                }
                return reverseComparator(function(a, b) {
                    return compare(get(a), get(b));
                }, descending);
            });
            var arrayCopy = [];
            for (var i = 0; i < array.length; i++) {
                arrayCopy.push(array[i]);
            }
            var out = arrayCopy.sort(reverseComparator(comparator, reverseOrder));
            return out;

            function comparator(o1, o2) {
                for (var i = 0; i < sortPredicate.length; i++) {
                    var comp = sortPredicate[i](o1, o2);
                    if (comp !== 0) return comp;
                }
                return 0;
            }

            function reverseComparator(comp, descending) {
                return toBoolean(descending) ? function(a, b) {
                    return comp(b, a);
                } : comp;
            }

            function compare(v1, v2) {
                var t1 = typeof v1;
                var t2 = typeof v2;
                if (v1 == null) {
                    return -1;
                }
                if (v2 == null) {
                    return 1;
                }
                if (t1 == t2) {
                    if (t1 == "string") {
                        if (v1.length == 0) {
                            return -1;
                        }
                        if (v2.length == 0) {
                            return 1;
                        }

                        v1 = v1.toLowerCase();
                        v2 = v2.toLowerCase();
                    }

                    if (!isNaN(Number(v1)) && !isNaN(Number(v1))) {
                        v1 = Number(v1);
                        v2 = Number(v2);
                    }
                    if (v1 === v2) return 0;
                    return v1 < v2 ? -1 : 1;
                } else {
                    return t1 < t2 ? -1 : 1;
                }
            }

        };
    }).service('BaseService', ['$rootScope', '$http',
        function($rootScope, $http) {
            var self = this;
            /**
             * 初始化配置参数 类似Jquery的ajax参数
             * params {
             *   url: // url请求路径
             *   method: // GET/POST 还可以扩充
             *   success: // 成功回调
             *   bcSucess: // 成功广播名称
             *   warning: // 服务器逻辑失败回调
             *   bcWarning: // 状态码不为0的广播名称
             *   error: // 服务器400+失败回调
             *   bcError: // 服务器失败广播名称
             *   callback: // 不论是否都成功回调
             *   bcCallback: // 无论是否成功广播名称
             * }
             */
            this.initParams = function(params) {
                // INIT PARAMS
                params = params || {};
                params.params = params.params || {};
                params.method = params.method || 'GET';
                // 成功回调
                params.success = params.success || function() {};
                // 警告错误
                params.warning = params.warning || function() {};
                // 服务器异常
                params.error = params.error || function() {};
                // 不论是否成功，均回调
                params.callback = params.callback || function() {};

                return params;
            }

            this.request = function(params) {
                if (!params || !params.url) {
                    console.error(params);
                    throw "参数设置不正确";
                }
                params = self.initParams(params);
                var method = params.method.toUpperCase();
                var response;
                switch (method) {
                    case 'GET':
                        response = $http({
                            method: 'GET',
                            url: params.url
                        });
                        // .success(function(data, status, headers, config) {
                        //     self.autoCallback(params, data, status, headers, config);
                        // }).error(function(data, status, headers, config) {
                        //     self.autoExceptionCallback(params, data, status, headers, config)
                        // });

                        break;
                    case 'POST':
                        response = $http({
                            method: 'POST',
                            url: params.url,
                            data: $.param(params.params),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                        // .success(function(data, status, headers, config) {
                        //     self.autoCallback(params, data, status, headers, config);
                        // }).error(function(data, status, headers, config) {
                        //     self.autoExceptionCallback(params, data, status, headers, config)
                        // });
                        break;
                    default:
                        throw "不支持的请求方式:" + method;
                        break;
                }
                if (response) {
                    response.success(function(data, status, headers, config) {
                        self.autoCallback(params, data, status, headers, config);
                    }).error(function(data, status, headers, config) {
                        self.autoExceptionCallback(params, data, status, headers, config)
                    });
                }
                return response;
            }

            /**
             * params （配置参数）
             * data  （数据）
             * broadcastName 广播名（可选项）
             */
            this.onSuccess = function(params, data, broadcastName) {
                data = data || {};

                params.success(data.data, params);

                if (broadcastName) $rootScope.$broadcast(broadcastName, data.data);
            }
            /**
             * params （配置参数）
             * 服务器状码为 0
             */
            this.onWarning = function(params, data, broadcastName) {
                data = data || {};

                params.warning(data.info, params);

                if (broadcastName) $rootScope.$broadcast(broadcastName, data.info);
            }
            /**
             * 服务器状态码400+
             */
            this.onError = function(params, data, broadcastName) {
                data = data || {};

                params.error(data.info, params);

                if (broadcastName) $rootScope.$broadcast(broadcastName, data.info);
            }
            /**
             * 固定回调
             */
            this.onCallback = function(params, data, broadcastName) {
                data = data || {};

                params.callback(data, params);

                if (broadcastName) $rootScope.$broadcast(broadcastName, data);
            }

            this.autoCallback = function(params, data, status, headers, config) {
                // 数据处理成功回调
                if (data.status != 0) {
                    // 自定义状态码不为 0
                    self.onSuccess(params, data, params.bcSuccess);
                } else {
                    // 状态码为 0
                    self.onWarning(params, data, params.bcWarning);
                }
                self.onCallback(params, data, params.bcCallback);
            }

            this.autoExceptionCallback = function(params, data, status, headers, config) {
                var status = status || 400;
                var errorInfo = '服务器异常';
                var data = {
                    status: httpStatus,
                    info: errorInfo,
                    data: null
                };

                base.onError(params, data, params.bcError);
                base.onCallback(params, data, params.bcCallback);
            }

        }
    ]);

module.directive('loading', function($filter) {
    return {
        restrict: 'EA',
        transclude: true,
        template: function(scope, attrs) {
            switch (attrs.ngLoadingStyle) {
                case 'spinner':
                    return '<div ng-class="{\'loading-show\':ngLoading}" class="loading-container"><div class="loading-main" ng-transclude></div><div class="loading-modal" ng-style="{\'position\':ngLoadingPosition}"><div class="loading-icon"><div class="spinner"></div></div><div class="loading-text">{{ngLoadingText}}</div><div ng-show="ngLoadingClosable" class="loading-btn"><button class="btn btn-warning" ng-click="hidden();">确定</button></div></div></div>';
                default:
                    return '<div ng-class="{\'loading-show\':ngLoading}" class="loading-container"><div class="loading-main" ng-transclude></div><div class="loading-modal" ng-style="{\'position\':ngLoadingPosition}"><div class="loading-icon"><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div></div><div class="loading-text">{{ngLoadingText}}</div><div ng-show="ngLoadingClosable" class="loading-btn"><button class="btn btn-warning" ng-click="hidden();">确定</button></div></div></div>'
            }
            // '<div ng-class="{\'loading-show\':ngLoading}" class="loading-container"><div ng-transclude></div><div class="loading-modal" ng-style="{\'position\':ngPosition}"><div class="loading-icon"></div></div></div>'
            // 
        },
        scope: {
            ngLoadingPosition: '@ngLoadingPosition',
            ngLoading: '=ngLoading',
            ngLoadingStyle: '@ngLoadingStyle',
            ngLoadingText: '=ngLoadingText',
            ngLoadingClosable: '=ngLoadingClosable'
        },
        link: function(scope, element, attrs) {
            scope.hidden = function() {
                scope.ngLoading = false;
                scope.ngLoadingClosable = false;
            }
        }
    };
});

module.service('UtilEmpService', ['$rootScope', 'BaseService',
    function($rootScope, BaseService) {
        this.getAll = function(params) {
            params = params || {};
            params.url = appPath + '/Utils/getAllOption';
            params.method = 'POST';
            return BaseService.request(params);
        };

        this.getAllByFilter = function(params) {
            params = params || {};
            params.url = appPath + '/Utils/getAllByFilter';
            params.method = 'POST';
            return BaseService.request(params);
        }
    }
]);

module.service('UtilHelpService', ['$rootScope', 'BaseService',
    function($rootScope, BaseService) {
        this.getEncode = function(params) {
            params = params || {};
            params.url = appPath + '/Help/get_encode';
            params.method = 'POST';
            return BaseService.request(params);
        };

        this.getDecode = function(params) {
            params = params || {};
            params.url = appPath + '/Help/get_decode';
            params.method = 'POST';
            return BaseService.request(params);
        };

    }
]);

module.directive('filterEmp', ['$filter', 'UtilEmpService',
    function($filter, UtilEmpService) {
        return {
            restrict: 'ECA',
            transclude: true,
            templateUrl: function(scope, attr) {
                if (attr.checkbox == "true")
                    return '/tc/Public/tpl/utils/commen_filter_checkbox.html';
                else
                    return '/tc/Public/tpl/utils/commen_filter_select.html';
            },
            scope: {
                types: '=types',
                results: '=results',
                checkbox: '=checkbox',
                success: '=success',
                datasouce: '=datasouce',
                setdata: '=setdata',
                defaultinfo: '=defaultinfo'
            },
            link: function($scope, $element, $attrs) {
                var __init = function() {
                    var requestParams = $scope.types;
                    if ($scope.setdata == 'true') {
                        $scope.$watch('datasouce', function(data) {
                            if (data) {
                                if ($scope.defaultinfo) {
                                    for (var i in $scope.defaultinfo) {
                                        if ($scope.defaultinfo[i]&&$scope.defaultinfo[i]['type']&&data[$scope.defaultinfo[i]['type']]) {
                                            data[$scope.defaultinfo[i]['type']]['default'] = $scope.defaultinfo[i]['value'];
                                            data[$scope.defaultinfo[i]['type']]['hidden'] = $scope.defaultinfo[i]['hidden'];
                                        };
                                    };
                                };
                                $scope.optionsAttr = data;
                                $scope.getFilterInfo();
                            }
                        });
                    } else {
                        UtilEmpService.getAll({
                            params: requestParams,
                            success: function(data) {
                                $scope.optionsAttr = data;
                                $scope.getFilterInfo();
                            }
                        });
                    }
                }



                $scope.getFilterInfo = function(data) {
                    UtilEmpService.getAllByFilter({
                        params: $scope.optionsAttr,
                        success: function(data) {
                            $scope.results = data;
                            if ($scope.success) {
                                $scope.success(data);
                            };
                        }
                    });
                }

                $scope.selectInfo = function(selectedValue, k) {
                    for (var i in $scope.optionsAttr[k]['data']) {
                        $scope.optionsAttr[k]['data'][i] = false;
                    };

                    if ($scope.optionsAttr&&$scope.optionsAttr[k]['set']&&$scope.optionsAttr[$scope.optionsAttr[k]['set']]) {
                        for (var i in $scope.optionsAttr[$scope.optionsAttr[k]['set']]['data']) {
                            $scope.optionsAttr[$scope.optionsAttr[k]['set']]['data'][i] = false;
                        };
                        $scope.optionsAttr[$scope.optionsAttr[k]['set']]['default'] = null;
                    };

                    if (selectedValue) {
                        $scope.optionsAttr[k]['data'][selectedValue] = true;
                    } else {
                        for (var i in $scope.optionsAttr[k]['data']) {
                            $scope.optionsAttr[k]['data'][i] = false;
                        };
                        $scope.optionsAttr[k]['default'] = null;
                    }

                    if (selectedValue == "[全部]") {
                         for (var i in $scope.optionsAttr[k]['data']) {
                            $scope.optionsAttr[k]['data'][i] = true;
                        };
                    };

                    UtilEmpService.getAllByFilter({
                        params: $scope.optionsAttr,
                        success: function(data) {
                            $scope.results = data;
                            if ($scope.success) {
                                $scope.success(data);
                            };
                        }
                    });
                }

                __init();
            }
        }
    }
]);

module.filter('limitArr', function() {
    return function(input, size) {
        if (input instanceof Array)
            return input.slice(0, size);
        else
            return input;
    }
});


module.directive('ngSearchInput', ['$timeout',
    function($timeout) {
        return {
            restrict: 'AE',
            templateUrl: '/tc/Public/tpl/template/search_input.html',
            scope: {
                searchList: '=ngSearchList',
                searchData: '=ngSearchModel',
                searchClick: '=ngSearchClick',
                ngSearchLabel: '@ngSearchLabel',
                hideButton: '=hideButton'
            },
            link: function($scope, $element, $attrs) {
                $scope.show = false;
                $scope.finished = function() {
                    $timeout(function() {
                        $scope.show = false;
                    }, 200);
                }
                $scope.setSearchData = function(data) {
                    $scope.searchData = data;
                }

                $scope.setShow = function () {
                    $scope.show = true;
                }
            }
        };
    }
]);

module.filter('trustHtml', function($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    }
});

module.filter('toYears', function() {
    return function(input, endDate, month, day) {
        if(!input){
            return '--';
        } else {
            input = input.replace(/\-/g, '/');
            input = input.replace(/\./g, '/');
        }

        if (month && day) {
            input = input + "/" + month + "/" + day;
        };

        var nowTime = new Date();
        var endDate = nowTime.getFullYear()+"/"+nowTime.getMonth()+"/"+nowTime.getDay();

        var snail_old_val = convertTimes(endDate) - convertTimes(input);
        var snail_old = Math.floor(snail_old_val / 24 / 3600 / 1000);

        var num = Math.abs((snail_old/365).toFixed(1));
        var info = num+"年";
        var returnInfo = (num > 0)?info:'不详';

        return returnInfo;
    }
});
