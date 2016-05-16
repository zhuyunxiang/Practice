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
        template: '<table class="table table-bordered"><tr><th ng-show="config.showIndex">序号</th><th ng-repeat="titleItem in config.attr" ng-show="config.attr&&config.attr.length" <span ng-click="setOrderInfo(titleItem)" style="cursor:pointer">{{titleItem.title}}<i class="glyphicon" ng-show="titleItem.key==sortPredicate" ng-class="{true:b, false:a}[reverseOrder]"></i></span></th><th ng-show="config.opt&&config.opt.length">操作</th></tr><tr ng-repeat="rowData in dataSource|limitTo:config.limitLength|filter:config.searchKeyword|autoSortBy:sortPredicate:reverseOrder"><td ng-show="config.showIndex">{{$index+1}}</td><td ng-repeat="attrInfo in rowData|filterAttributes:config.attr" title="{{attrInfo}}">{{attrInfo}}</td><td ng-show="config.opt&&config.opt.length"><span ng-repeat="oItem in config.opt" util-table-btn-options oitem="oItem" optiondata="rowData"></span></td></tr></table>',
        replace: true,
        scope: {
            config: "=config",
            dataSource: "=datasource",
        },
        link: function($scope, $element, $attrs) {
            $scope.sortPredicate = ($scope.config && $scope.config.order && $scope.config.order.colum)||'name';
            $scope.reverseOrder = ($scope.config && $scope.config.order && $scope.config.order.type)||false;

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
        template: '<div style="display:inline-block;"><div class="dropdown" class="{{oitem.class}}"ng-style="oitem.style" ng-show="oitem.isDropDown"> <button class="btn btn-default dropdown-toggle btn-xs" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">{{oitem.title}}<span class="caret"></span> </button> <ul class="dropdown-menu" aria-labelledby="dropdownMenu1"> <li ng-repeat="(dpk,dpv) in oitem.dropdownList" ng-hide="dpv.isHide||dpv.setHide(optiondata,oitem)"><a href="#" ng-click="dpv.callback(optiondata,oitem)">{{dpv.name}}</a></li></ul> </div><button ng-disabled="isDisabled" class="{{oitem.class}}"ng-style="oitem.style" ng-show="oitem.isBtn&&isShow">{{oitem.title}}</button><select ng-show="oitem.isSelect&&isShow" ng-model="optiondata[oitem.attrName]" class="{{oitem.class}}"ng-style="oitem.style" ng-options="k.value as k.name for k in oitem.selectOptions"><option value="">请选择</option></select></div>',
        replace: true,
        scope: {
            oitem: "=oitem",
            optiondata: "=optiondata",
        },
        link: function($scope, $element, $attrs) {
            // 禁用条件
            if (typeof $scope.oitem.isDisabled == "function") {
                $scope.isDisabled = $scope.oitem.isDisabled($scope.optiondata, $scope.oitem);
            } else {
                $scope.isDisabled = ($scope.oitem.isDisabled == undefined)?false:$scope.oitem.isDisabled;
            }
            // 显示控制条件
            if (typeof $scope.oitem.isHide == "function") {
                $scope.isShow = !$scope.oitem.isHide($scope.optiondata, $scope.oitem);
            } else {
                $scope.isShow = ($scope.oitem.isHide == undefined)?true:(!$scope.oitem.isHide);
            }

            // 按钮事件回调（没有被禁止才能有权限）
            if ($scope.oitem.isBtn && !$scope.isDisabled) {
                $element.bind('click', function(a) {
                    var callback = $scope.oitem.callback || function() {};
                    callback($scope.optiondata, $scope.oitem);
                });
            }
            // Select事件回调（没有被禁止才能有权限）
            if ($scope.oitem.isSelect && !$scope.isDisabled) {
                $element.bind('change', function(a) {
                    var callback = $scope.oitem.callback || function() {};
                    callback($scope.optiondata, $scope.optiondata[$scope.oitem.attrName], $scope.oitem);
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

// 自然排序Filter
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
