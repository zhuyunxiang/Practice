var http = require("http");
var fs = require("fs");

var fileService = {
    saveFile: function (url, savePath, callback) {
        http.get(url, function(res){
            var contentType = res.headers['content-type'];
            var suffix = "";
            if (contentType) {
                var arr = contentType.split('/');
                if (arr&&arr[1]&&arr[1]!='plain') {
                    suffix = "."+arr[1];
                    var imgData = "";
                    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
                    res.on("data", function(chunk){
                        imgData+=chunk;
                    });
                    res.on("end", function(){
                        fs.writeFile(savePath + suffix, imgData, "binary", function(err){
                            if(err){
                                console.log(err);
                            } else {
                                console.log("save file ", url);
                            }
                            var arr = savePath.split('/');
                            savePath = savePath.replace(/.\/public/, '');
                            var fileName = arr[arr.length-1];
                            callback({filePath:savePath + suffix, fileName:fileName + suffix}, err);
                        });
                    });
                }
            }

        });
    }
}

module.exports = fileService;