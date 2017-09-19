'use strict'
//take the json data and get a random application from it
exports.getRandomApp = function(games, callback) {
    let randomApp = games.response.games.length ? Math.floor(Math.random() * (games.response.games.length - 1)) : null;
    
    if (callback) {
        callback(games.response.games[randomApp]);
    }
    return;
};