// 设置微信接口信息
// data:服务器传过来的签名包
var setConfig = function(data) {
    wx.config({
        debug: false,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });
}

Controllers.controller('handlerCtrl', ['$scope', '$state', function($scope, $state) {
    var state = getUrlParam('s');
    var aid = getUrlParam('aid');
    if (state && aid) {
        $state.go(state, {
            id: aid
        });
    } else {
        $state.go('home');
    }
}]);

// 所有Controller加载前加载 
Controllers.controller('proController', ['$scope', '$state', '$location', 'AuthService', function($scope, $state, $location, AuthService) {
    
    // 获取当前URL
    var url = $location.$$absUrl;
    var len = url.indexOf("#");
    var str = (len > 0) ? url.substring(0, len) : url;
    // 根据URL获取签名用于设置微信OAuth接口
    AuthService.getTickets(str, function(data) {
        if (data) {
            setConfig(data);
        }
    });

    // 获取微信浏览器自动在URL里面添加的Code参数 
    // var code = getUrlParam('code');
    // if (code) {
    //     // 获取用户信息
    //     AuthService.getLocalUserInfo(code, function(data) {
    //         // alert(JSON.stringify(data));
    //         AuthService.currentUser = data;
    //         if (data) {
    //             $scope.info = {
    //                 openid: data.openid,
    //                 userID: data._id
    //             };
    //         } else {
    //             // 错误提示 跳转到微信验证页面
    //             alert('error');
    //         }
    //     });
    // }
}]);

// 首页Controller
Controllers.controller('myController', ['$scope', '$timeout', 'AuthService', 'materialService', function($scope, $timeout, AuthService, materialService) {
    var _init = function() {
        // 监听用户信息
        // $scope.$watch('userInfo', function(newInfo) {
            if ($scope.userInfo) {
                materialService.get({
                    openid: $scope.userInfo.openid,
                    'limitNum': 5
                }, function(data) {
                    $scope.myMaterials = data;
                });

                materialService.get({
                    openid: $scope.userInfo.openid,
                    type: 'neq',
                    'limitNum': 5
                }, function(data) {

                    $scope.othersMaterials = data;
                });
            }
        // });

        // 获取口令
        AuthService.getAccessToken(function(data) {
            $scope.commonToken = data.token;
        });
    }

    // 获取微信浏览器自动在URL里面添加的Code参数 
    var code = getUrlParam('code');
    if (code) {
        // 获取用户信息
        AuthService.getLocalUserInfo(code, function(data) {
            $scope.userInfo = data;
            // 初始化
            _init();
        });
    }
}]);

// 新建素材
Controllers.controller('newshareCtrl', ['$scope', 'AuthService', 'materialService', function($scope, AuthService, materialService) {
    $scope.pageTitle = "添加素材";
    // 获取微信浏览器自动在URL里面添加的Code参数 
    var code = getUrlParam('code');

    // 获取用户信息
    AuthService.getLocalUserInfo(code, function(data) {
        if (data) {
            $scope.info = {
                openid: data.openid,
                userID: data._id
            };
        } else {
            // 错误提示 跳转到微信验证页面
            alert('error');
        }
    });

    // 保存信息到数据库
    $scope.saveNewInfo = function() {
        materialService.save($scope.info, function(data) {
            alert(data);
        });
    }

    // 微信选择要上传的图片 
    $scope.chooseImg = function() {
        wx.chooseImage({
            success: function(res) {
                $scope.localId = res.localIds;
                // alert('已选择 ' + res.localIds.length + ' 张图片');

                if ($scope.localId.length == 0) {
                    alert('请先使用 chooseImage 接口选择图片');
                    return;
                }
                var i = 0,
                    length = $scope.localId.length;
                $scope.serverId = [];

                function upload() {
                    wx.uploadImage({
                        localId: $scope.localId[i],
                        success: function(imgRes) {
                            i++;
                            //alert('已上传：' + i + '/' + length);
                            $scope.serverId.push(imgRes.serverId);
                            $scope.info.serverId = imgRes.serverId;
                            AuthService.getImgURL(imgRes.serverId, function(data) {
                                $scope.info.imgUrl = data.url;
                            });
                            if (i < length) {
                                upload();
                            }
                        },
                        fail: function(imgRes) {
                            alert(JSON.stringify(imgRes));
                        }
                    });
                }
                upload();
            }
        });
    }
}]);
// 修改素材
Controllers.controller('updateshareCtrl', ['$scope', 'AuthService', 'materialService','$stateParams', function($scope, AuthService, materialService, $stateParams) {
    $scope.pageTitle = "修改素材";
    // 获取微信浏览器自动在URL里面添加的Code参数 
    var code = getUrlParam('code');

    materialService.get({
        '_id': $stateParams.id
    }, function(data) {
        alert(JSON.stringify(data));
        $scope.info = data[0];
    });

    // 获取用户信息
    AuthService.getLocalUserInfo(code, function(data) {
        if (data) {
            
        } else {
            // 错误提示 跳转到微信验证页面
            alert('error');
        }
    });

    // 保存信息到数据库
    $scope.saveNewInfo = function() {
        materialService.save($scope.info, function(data) {
            alert(data);
        });
    }

    // 微信选择要上传的图片 
    $scope.chooseImg = function() {
        wx.chooseImage({
            success: function(res) {
                $scope.localId = res.localIds;
                // alert('已选择 ' + res.localIds.length + ' 张图片');

                if ($scope.localId.length == 0) {
                    alert('请先使用 chooseImage 接口选择图片');
                    return;
                }
                var i = 0,
                    length = $scope.localId.length;
                $scope.serverId = [];

                function upload() {
                    wx.uploadImage({
                        localId: $scope.localId[i],
                        success: function(imgRes) {
                            i++;
                            //alert('已上传：' + i + '/' + length);
                            $scope.serverId.push(imgRes.serverId);
                            $scope.info.serverId = imgRes.serverId;
                            AuthService.getImgURL(imgRes.serverId, function(data) {
                                $scope.info.imgUrl = data.url;
                            });
                            if (i < length) {
                                upload();
                            }
                        },
                        fail: function(imgRes) {
                            alert(JSON.stringify(imgRes));
                        }
                    });
                }
                upload();
            }
        });
    }
}]);

// 详细页
Controllers.controller('materialdetailCtrl', ['$scope', '$timeout', '$stateParams', '$location', 'AuthService', 'materialService', function($scope, $timeout, $stateParams, $location, AuthService, materialService) {
    $scope.id = $stateParams;
    var _init = function() {
        AuthService.getAccessToken(function(data) {
            $scope.commonToken = data.token;
        });

        if ($stateParams && $stateParams.id) {
            materialService.get({
                '_id': $stateParams.id
            }, function(data) {
                $scope.value = data[0];

                materialService.getHistory({
                    material_id:$scope.value._id,
                    type: 'read'
                }, function(data) {
                    
                    // alert(JSON.stringify(data));
                });

                if ($scope.value.userID.openid != $scope.userInfo.openid) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'read',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        alert(data);
                    });
                } else {
                    // 查看自己的素材
                }
                wxready();
            });
        }
    }

    var wxready = function() {
        // 微信JS SDK加载完成
        wx.ready(function() {
            var shareData = {
                title: "Share:" + $scope.value.title,
                desc: $scope.value.brif,
                link: serverHost + "/wechatAPI/redirect?url=" + clientHost + "/index.html?s=materialdetail&aid=" + $stateParams.id,
                imgUrl: 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + $scope.commonToken + '&media_id=' + $scope.value.serverId,
                trigger: function(res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    alert('用户点击发送给朋友');
                },
                success: function(res) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'shared',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        // alert("保存记录成功");
                    });
                },
                cancel: function(res) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'cancelshared',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        // alert("保存记录成功");
                    });
                },
                fail: function(res) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'sharefiled',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        // alert("保存记录成功");
                    });
                    alert(JSON.stringify(res));
                }
            };
            // 分享到朋友圈
            wx.onMenuShareTimeline(shareData);
            // 分享给朋友接口
            wx.onMenuShareAppMessage(shareData);
        });
    }

    var timer = $timeout(function() {
        $scope.userInfo = AuthService.currentUser;
        _init();
    }, 200);
}]);

// 我的详细页
Controllers.controller('mymaterialdetailCtrl', ['$scope', '$timeout', '$stateParams', '$location', 'AuthService', 'materialService', function($scope, $timeout, $stateParams, $location, AuthService, materialService) {
    $scope.id = $stateParams;
    var _init = function() {
        AuthService.getAccessToken(function(data) {
            $scope.commonToken = data.token;
        });

        if ($stateParams && $stateParams.id) {
            materialService.get({
                '_id': $stateParams.id
            }, function(data) {
                $scope.value = data[0];

                materialService.getHistory({
                    material_id:$scope.value._id,
                    type: 'read'
                }, function(data) {
                    console.log(data);
                    alert(JSON.stringify(data));
                });

                if ($scope.value.userID.openid != $scope.userInfo.openid) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'read',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        // alert("保存记录成功");
                    });
                } else {
                    // 查看自己的素材
                }
                wxready();
            });
        }
    }

    var wxready = function() {
        // 微信JS SDK加载完成
        wx.ready(function() {
            var shareData = {
                title: "Share:" + $scope.value.title,
                desc: $scope.value.brif,
                link: serverHost + "/wechatAPI/redirect?url=" + clientHost + "/index.html?s=materialdetail&aid=" + $stateParams.id,
                imgUrl: 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + $scope.commonToken + '&media_id=' + $scope.value.serverId,
                trigger: function(res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    alert('用户点击发送给朋友');
                },
                success: function(res) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'shared',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        // alert("保存记录成功");
                    });
                },
                cancel: function(res) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'cancelshared',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        // alert("保存记录成功");
                    });
                },
                fail: function(res) {
                    materialService.saveHistory({
                        material_id: $scope.value._id,
                        type: 'sharefiled',
                        userID: $scope.userInfo._id
                    }, function(data) {
                        // alert("保存记录成功");
                    });
                    alert(JSON.stringify(res));
                }
            };
            // 分享到朋友圈
            wx.onMenuShareTimeline(shareData);
            // 分享给朋友接口
            wx.onMenuShareAppMessage(shareData);
        });
    }

    var timer = $timeout(function() {
        $scope.userInfo = AuthService.currentUser;
        _init();
    }, 200);
}]);

// 个人信息
Controllers.controller('userdetailCtrl', ['$scope', '$stateParams', 'userService', function($scope, $stateParams, userService) {
    var openid = $stateParams.openid;
    userService.get({
        openid: openid
    }, function(data) {
        $scope.user = data;
    });
}]);

// 我的素材列表
Controllers.controller('mymateriallistCtrl', ['$scope', 'AuthService', 'materialService', '$location', function($scope, AuthService, materialService, $location) {
    $scope.pageTitle = "我的素材";
    // 获取微信浏览器自动在URL里面添加的Code参数 
    var code = getUrlParam('code');
    // 获取当前URL
    var url = $location.$$absUrl;

    // localStorage.clear();
    var userInfo = localStorage.getItem('localUserInfo');
    // 判断缓存
    if (!userInfo) {
        // 根据Code从服务器获取用户信息
        AuthService.getUserInfo(code, function(data) {
            if (data) {
                $scope.userInfo = data;
                localStorage.setItem('localUserInfo', JSON.stringify(data));
            } else {
                // 错误提示 跳转到微信验证页面
            }
        });
    } else {
        // alert('这个数据从缓存取的哟');
        $scope.userInfo = JSON.parse(userInfo);
    }
    // user info
    $scope.$watch('userInfo', function(newInfo) {
        if (newInfo) {
            materialService.get({
                openid: $scope.userInfo.openid
            }, function(data) {
                $scope.myMaterials = data;
            });
        }
    });

    AuthService.getAccessToken(function(data) {
        $scope.commonToken = data.token;
    });
}]);

// 朋友的素材列表
Controllers.controller('friendsmateriallistCtrl', ['$scope', 'AuthService', 'materialService', '$location', function($scope, AuthService, materialService, $location) {
    $scope.pageTitle = "朋友的素材";
    // 获取微信浏览器自动在URL里面添加的Code参数 
    var code = getUrlParam('code');
    // 获取当前URL
    var url = $location.$$absUrl;

    // localStorage.clear();
    var userInfo = localStorage.getItem('localUserInfo');
    // 判断缓存
    if (!userInfo) {
        // 根据Code从服务器获取用户信息
        AuthService.getUserInfo(code, function(data) {
            if (data) {
                $scope.userInfo = data;
                localStorage.setItem('localUserInfo', JSON.stringify(data));
            } else {
                // 错误提示 跳转到微信验证页面
            }
        });
    } else {
        // alert('这个数据从缓存取的哟');
        $scope.userInfo = JSON.parse(userInfo);
    }
    // user info
    $scope.$watch('userInfo', function(newInfo) {
        if (newInfo) {
            materialService.get({
                openid: $scope.userInfo.openid,
                type: 'neq',
            }, function(data) {
                $scope.myMaterials = data;
            });
        }
    });

    AuthService.getAccessToken(function(data) {
        $scope.commonToken = data.token;
    });
}]);