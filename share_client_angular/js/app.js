var myApp = angular.module('myApp', ['Controllers','Services','Directives','Filters', 'ui.router']);

var Controllers = angular.module('Controllers', []);
var Services = angular.module('Services', []);
var Directives = angular.module('Directives', []);
var Filters = angular.module('Filters', []);
var serverHost = "http://zhuyunxiang.com/share";
var clientHost = "http://zhuyunxiang.com/share_client_angular";

// 配置路由
myApp.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise('/handler');
    $stateProvider
        // 主页
        .state('handler', {
            url: '/handler',
            template: '',
            data: {
                pageTitle: 'Home'
            },
            controller: 'handlerCtrl'
        })
        // 主页
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            data: {
                pageTitle: 'Home'
            },
            controller: 'myController'
        })
        // 新建素材
        .state('newshare', {
            url: '/newshare',
            templateUrl: 'views/newshare.html',
            data: {
                pageTitle: '新建素材'
            },
            controller: 'newshareCtrl'
        })
        // 新建素材
        .state('update', {
            url: '/update/{id}',
            templateUrl: 'views/newshare.html',
            data: {
                pageTitle: '修改素材'
            },
            controller: 'updateshareCtrl'
        })
        // 别人的素材详细页
        .state('materialdetail', {
            url: '/materialdetail/{id}/{uid}',
            templateUrl: 'views/materialdetail.html',
            data: {
                pageTitle: '详细页'
            },
            controller: 'materialdetailCtrl'
        })
        // 用户信息详细信息
        .state('userdetail', {
            url: '/userdetail/{openid}',
            templateUrl: 'views/userdetail.html',
            data: {
                pageTitle: '用户详情'
            },
            controller: 'userdetailCtrl'
        })
        // 我的素材列表
        .state('mymateriallist', {
            url: '/mymateriallist',
            templateUrl: 'views/mymateriallist.html',
            data: {
                pageTitle: '我的素材'
            },
            controller: 'mymateriallistCtrl'
        })
        // 朋友的素材列表
        .state('friendsmateriallist', {
            url: '/friendsmateriallist',
            templateUrl: 'views/friendsmateriallist.html',
            data: {
                pageTitle: '朋友的素材'
            },
            controller: 'friendsmateriallistCtrl'
        })
        // 关于(测试)
        .state('about', {
            url: '/about/{id:[0-9]{1,4}}',
            templateUrl: 'views/about.html',
            data: {
                pageTitle: 'About'
            }
        })
});

// 获取URL里面的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null)
    return unescape(r[2]);
    return null; //返回参数值
}
