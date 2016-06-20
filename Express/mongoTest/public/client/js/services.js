Services.service('BaseService', ['$http', function($http){
    this.request = function (param, callback, method) {
        if (!method) {
            method = 'POST';
        }
        $http({
            method: method,
            url: param.url,
            data: param.params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            callback(data);
        });
    }
}]);

// 认证Service
Services.service('AuthService', ['$http', '$rootScope','BaseService',
    function($http, $rootScope, BaseService) {
        // var AuthService = {};
        // this.currentUser = null;

        // 获取当前要经过微信验证的地址
        this.getAuthURL = function(url, callback) {
            var params = {
                url:url, 
                params: {url: url}
            };
            BaseService.request(params, callback);
        }

        // 获取用户信息
        this.getUserInfo = function(code, callback) {
            var params = {
                url:serverHost + '/wechatAPI/getUserInfo',
                params: $.param({code: code})
            };

            BaseService.request(params, callback);
        }

        this.getLocalUserInfo = function (code, callback) {
            if (this.userInfo) {
                callback(this.userInfo);
                return this.userInfo;
            }

            // localStorage.clear();
            var userInfo = localStorage.getItem('localUserInfo');
            // 判断缓存
            if (!userInfo) {
                var params = {
                    url:serverHost + '/wechatAPI/getUserInfo',
                    params: $.param({code: code})
                };

                BaseService.request(params, function (data) {
                    if (data.openid) {
                        localStorage.setItem('localUserInfo', JSON.stringify(data));
                        this.userInfo = data;
                    }
                    callback(data);
                });
            } else {
                // alert('这个数据从缓存取的哟');
                userInfo = JSON.parse(userInfo);
                this.userInfo = userInfo;
                callback(userInfo);
            }
        }

        // 获取Token
        this.getAccessToken = function(callback) {
            var params = {
                url:serverHost + '/wechatAPI/getAccessToken',
                params: {}
            };

            BaseService.request(params, callback);
        }

        // 根据当前地址获取签名
        this.getTickets = function(url, callback) {
            var params = {
                url:serverHost + '/wechatAPI/getTickets', 
                params: $.param({url: url})
            };

            BaseService.request(params, callback);
        }

        // 获取图片流
        this.getImgURL = function(serverId, callback) {
            var params = {
                url: serverHost + '/wechatAPI/getImgURL',
                params: $.param({serverId: serverId})
            };

            BaseService.request(params, callback);
        }

        // return this;
    }
]);

// 素材Service
Services.service('materialService', ['BaseService', function(BaseService){
    this.save = function (data, callback) {
        var params = {
            url: serverHost + '/materialAPI/save',
            params: $.param(data)
        };

        BaseService.request(params, callback);
    }

    this.get = function (condition, callback) {
        var params = {
            url: serverHost + '/materialAPI/get',
            params: $.param(condition)
        };
        BaseService.request(params, callback);
    }

    this.saveHistory = function (data, callback) {
        var params = {
            url: serverHost + '/historyAPI/',
            params: $.param(data)
        };

        BaseService.request(params, callback);
    }

    this.getHistory = function (condition, callback) {
        var params = {
            url: serverHost + '/historyAPI/get',
            params: $.param(condition)
        };

        BaseService.request(params, callback);
    }
}]);

// 用户信息Service

Services.service('userService', ['BaseService', function(BaseService){
    this.get = function (condition, callback) {
        var params = {
            url: serverHost + '/users/'+condition.openid,
        };
        BaseService.request(params, callback, 'GET');
    }
}])