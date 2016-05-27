var set = function(key, value, expire) {
    var _cache = this.cache;
    var curTime = +new Date();
    // 如果已经存在该值，则重新赋值
    if (_cache[key]) {
        // 重新赋值
        _cache[key].value = value;
        _cache[key].expire = expire;
        // 如果为新插入
    } else {
        _cache[key] = {
            value: value,
            expire: expire,
            insertTime: curTime
        };
    }
}

var getAll = function() {
    return this.cache;
}

var get = function(key) {
    var _cache = this.cache;

    // 如果存在该值
    if (_cache[key]) {
        var insertTime = _cache[key].insertTime;
        var expire = _cache[key].expire;
        var node = _cache[key].node;
        var curTime = +new Date();

        // 如果不存在过期时间 或者 存在过期时间但尚未过期
        if (!expire || (expire && curTime - insertTime < expire)) {
            return _cache[key].value;

            // 如果已经过期
        } else if (expire && curTime - insertTime > expire) {
            delete cache[key];
            return null
        }
    } else {
        return null;
    }
}

var clear = function() {
    this.cache = {};
}

var cacheService = function() {
    var obj = {
        cache: {},

        set: set,
        getAll: getAll,
        get: get,
        clear: clear
    }

    setInterval(function() {
        var cache = obj.cache;
        for (var key in cache) {
            if (!cache[key]) continue;
            var insertTime = cache[key].insertTime;
            var expire = cache[key].expire;
            var curTime = +new Date();
            var node = cache[key]["node"];

            // 如果过期时间存在并且已经过期
            if (expire && curTime - insertTime > expire) {
                delete cache[key];
            }
        }
    }, 1000);

    return obj;
}

module.exports.cacheService = cacheService;
