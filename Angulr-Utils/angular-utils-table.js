// 定义总模块
angular.module('Utils-table', ['Utils-table-Directives']);

// 自定义指令模块
UtilsTableDirectives = angular.module('Utils-table-Directives', ['Utils-table-Filters']);
UtilsTableFilters = angular.module('Utils-table-Filters', []);
// 定义指令
UtilsTableDirectives.directive('utilTable', [function() {
    return {
        restrict: 'ECA',
        transclude: true,
        template: '<table class="table table-bordered"><tr><th ng-repeat="titleItem in config.attr" ng-show="config.attr&&config.attr.length" <span ng-click="setOrderInfo(titleItem)" style="cursor:pointer">{{titleItem.title}}<i class="glyphicon" ng-show="titleItem.key==sortPredicate" ng-class="{true:b, false:a}[reverseOrder]"></i></span></th><th ng-show="config.opt&&config.opt.length">操作</th></tr><tr ng-repeat="rowData in dataSource|limitTo:config.limitLength|filter:config.searchKeyword|autoSortBy:sortPredicate:reverseOrder"><td ng-repeat="attrInfo in rowData|filterAttributes:config.attr">{{attrInfo}}</td><td ng-show="config.opt&&config.opt.length"><span ng-repeat="oItem in config.opt" util-table-btn-options oitem="oItem" optiondata="rowData"></span></td></tr></table>',
        replace: true,
        scope: {
            config: "=config",
            dataSource: "=datasource",
        },
        link: function($scope, $element, $attrs) {
            $scope.sortPredicate = ($scope.config.order && $scope.config.order.colum)||'name';
            $scope.reverseOrder = ($scope.config.order && $scope.config.order.type)||false;

            $scope.a = 'glyphicon-sort-by-attributes';
            $scope.b = 'glyphicon-sort-by-attributes-alt';

            $scope.setOrderInfo = function (titleItem) {
                $scope.sortPredicate = titleItem.key;
                $scope.reverseOrder =! $scope.reverseOrder;
            }
        }
    };
}]);

// 表中的操作指令
UtilsTableDirectives.directive('utilTableBtnOptions', [function() {
    return {
        restrict: 'ECA',
        transclude: true,
        template: '<span><button class="{{oitem.class}}"ng-style="oitem.style" ng-show="oitem.isBtn">{{oitem.title}}</button><select ng-show="oitem.isSelect" ng-model="selectModel" class="{{oitem.class}}"ng-style="oitem.style" ng-options="k.value as k.name for k in oitem.selectOptions"><option value="">无</option></select></span>',
        replace: true,
        scope: {
            oitem: "=oitem",
            optiondata: "=optiondata",
        },
        link: function($scope, $element, $attrs) {
            // 按钮事件回调
            if ($scope.oitem.isBtn) {
                $element.bind('click', function(a) {
                    var callback = $scope.oitem.callback || function() {};
                    callback($scope.optiondata, $scope.oitem);
                });
            }
            // Select事件回调
            if ($scope.oitem.isSelect) {
                $element.bind('change', function(a) {
                    var callback = $scope.oitem.callback || function() {};
                    callback($scope.optiondata, $scope.selectModel, $scope.oitem);
                });
            }
        }
    };
}]);

// 过滤数据对象中不在指示范围内的对象
UtilsTableFilters.filter('filterAttributes', [function() {
    return function(input, attributes, filterOptions) {
        // 判断哪些字段需要显示
        if (attributes && attributes.length) {
            var item = {};
            for (var i = 0; i < attributes.length; i++) {
                item[attributes[i]['key']] = input[attributes[i]['key']];
            }
        } else {
            var item = input;
        }

        return item;
    };
}]);

UtilsTableFilters.filter('autoSortBy', ['$filter', '$parse', function($filter, $parse) {
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

        function map(obj, iterator, context) {
            var results = [];
            angular.forEach(obj, function(value, index, list) {
                results.push(iterator.call(context, value, index, list));
            });
            return results;
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
}]);
