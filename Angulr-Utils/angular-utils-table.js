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
        template: '<table class="table table-bordered"><tr><th ng-repeat="titleItem in attrbutes" ng-show="attrbutes&&attrbutes.length">{{titleItem.title}}</th><th ng-show="options&&options.length">操作</th></tr><tr ng-repeat="rowData in dataSource|limitTo:limitLength"><td ng-repeat="attrInfo in rowData|filterAttributes:attrbutes">{{attrInfo}}</td><td ng-show="options&&options.length"><span ng-repeat="oItem in options" util-table-btn-options oitem="oItem" optiondata="rowData"></span></td></tr></table>',
        replace: true,
        scope: {
            attrbutes: "=attrbutes",
            dataSource: "=datasource",
            options: "=options",
        },
        link: function($scope, $element, $attrs) {
            // 操作
        }
    };
}]);

// 表中的操作指令
UtilsTableDirectives.directive('utilTableBtnOptions', [function() {
    return {
        restrict: 'ECA',
        transclude: true,
        template: '<span><button class="btn btn-default {{oitem.class}}" style="margin-right:10px;" ng-style="oitem.style" ng-show="oitem.isBtn">{{oitem.title}}</button><select ng-show="oitem.isSelect"><option>无</option></select></span>',
        replace: true,
        scope: {
            oitem: "=oitem",
            optiondata: "=optiondata"
        },
        link: function($scope, $element, $attrs) {
            console.log($scope.oitem);

            if($scope.oitem.isBtn) {
                $element.bind('click', function(a) {
                    var callback = $scope.oitem.callback || function() {};
                    callback($scope.optiondata, $scope.oitem);
                });
            }
            if($scope.oitem.isSelect) {
                $element.bind('change', function(a) {
                    var callback = $scope.oitem.callback || function() {};
                    callback($scope.optiondata, $scope.oitem);
                });
            }


        }
    };
}]);

// 过滤数据对象中不在指示范围内的对象
UtilsTableFilters.filter('filterAttributes', [function() {
    return function(input, attributes) {
        if(attributes&&attributes.length){
            var item = {};
            for (var i = 0; i < attributes.length; i++) {
                if (input[attributes[i]['key']])
                item[attributes[i]['key']] = input[attributes[i]['key']];
            }
        } else {
            var item = input;
        }

        return item;
    };
}]);