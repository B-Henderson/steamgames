'use strict'
const apikey = process.env.STEAM_APIKEY;
const express = require('express')
const app = express()
const request = require('request');
const bodyParser = require('body-parser');
const async = require("async");
const youtubeKey = process.env.YOUTUBE_APIKEY;
const twitchKey = process.env.TWITCH_APIKEY;

app.use(bodyParser.urlencoded({
    extended: true
}));


function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}



//take the json data and get a random application from it
var getRandomApp = function(games, callback) {
    let randomApp = games.response.games.length ? Math.floor(Math.random() * (games.response.games.length - 1)) : null;
    if (callback) {
        callback(games.response.games[randomApp]);
    }
    return;
}
var step3 = function(games) {

};


const getGameData = function(url, callback) {
    console.log('URLS: ',url);
    const options = {
        url: url,
        json: true
    };
    
    request.get(url, function(err, res, body) {
        callback(err, body);
    })

}

app.route('/')
    .get(function(req, res) {
        res.status(200).send('Hello World!');
    })
    .post(function(req, res) {
        let gameData = {
            'mediaContent': []
        }
        let userid = req.body;
        const steamUrl = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + apikey + '&include_appinfo=1&steamid=' + userid.steamid + '&format=json';
        request
            .get(steamUrl, function(err, response, body) {
                if (err) throw err;
                if (!err && response.statusCode === 200) {
                    let locals = JSON.parse(body);

                    getRandomApp(locals, function(games) {
                        let urls = [
                            'http://store.steampowered.com/api/appdetails?appids=' + games.appid,
                            'https://content.googleapis.com/youtube/v3/search?q=' + games.name + '&maxResults=2&part=snippet&key=' + youtubeKey,
                            'https://api.twitch.tv/kraken/streams/?game=' + games.name + '&limit=2&client_id=' + twitchKey
                            
                        ];
                        gameData = extend(gameData, games);
                        // console.log(urls);

                        async.map(urls, getGameData, function(err, results) {
                            // console.log(results, 'test');
                            for(let i=0; i<results.length; i++){
                                gameData.mediaContent.push(JSON.parse(results[i]));
                            }
                            res.json(gameData);
                            // res.json('hello world');
                        })
                    });
                }
            });
        var returnResults = function(game) {
            res.json(game);
        };
    })

app.route('/google60c020d4bb10c34d.html')
    .get(function(req, res){
        res.sendFile(__dirname + '/google60c020d4bb10c34d.html');
    })




app.listen(8080, function() {
    console.log('initialised on port 8080');
})
