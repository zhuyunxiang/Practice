Filters.filter('getSum', function() {
    return function(data, colume) {
        var sumInfo = 0;
        for (var i = 0; i < data.length; i++) {
            sumInfo += data[i][colume]
        }

        return sumInfo;
    }
});