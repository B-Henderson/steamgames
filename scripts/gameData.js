const request = require("request");

exports.getGameData = function(url, callback) {
    request.get(url, function(err, res, body) {
        callback(err, body);
    });

};