'use strict'
const apikey = process.env.STEAM_APIKEY;
const express = require('express')
const app = express()
const request = require('request');
const bodyParser = require('body-parser');
const async = require("async");
const youtubeKey = process.env.YOUTUBE_APIKEY;
const twitchKey = process.env.TWITCH_APIKEY;
var port = process.env.PORT || 8080;
const getApp = require(__dirname + "/scripts/getRandomApp");
const extendObj = require(__dirname+"/scripts/extendObj");
const gd = require(__dirname + "/scripts/gameData");


//use urlencoded parsing for the post requests
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));



//base url / on get return webpage (NYI)
//post retrieve the data from the apis
app.route('/')
    .get(function(req, res) {
        res.sendStatus(200).send('Hello World!');
    })
    .post(function(req, res) {
        //initialize the return object
        
        let gameData = {
            'mediaContent': []
        };
        let userid = req.body;
        // variable to store the steam url for 
        const steamUrl = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + apikey + '&include_appinfo=1&steamid=' + userid.steamid + '&format=json';
        console.log('HERE FIRST', userid);
        request
            .get(steamUrl, function(err, response, body) {
                //throw an error if the steam id cannot be found
                if (err) throw err;
                console.log('HERE SECOND', body);
                if (!err && response.statusCode === 200) {
                    let locals = JSON.parse(body);
                    
                    getApp.getRandomApp(locals, function(games) {
                        // the api urls to call with the return data from steam api\
                        let urls = [
                            'http://store.steampowered.com/api/appdetails?appids=' + games.appid,
                            'https://content.googleapis.com/youtube/v3/search?q=' + games.name + '&maxResults=2&part=snippet&key=' + youtubeKey,
                            'https://api.twitch.tv/kraken/streams/?game=' + games.name + '&limit=2&client_id=' + twitchKey
                            
                        ];
                        //extend the gameData object with the return data
                        gameData = extendObj.extend(gameData, games);
                        //using the async library make multiple calls to the urls above and execute them using functions in the gameData.js file
                        //with the return data add them to the mediaContent array and return the json
                        async.map(urls, gd.getGameData, function(err, results) {
                            if (err) throw err;
                            console.log('HERE third', results);
                            for(let i=0; i<results.length; i++){
                                gameData.mediaContent.push(JSON.parse(results[i]));
                            }
                            res.json(gd.mapData(gameData, games.appid));
                        });
                    });
                }
            });
    });


//test route for google api
app.route('/google60c020d4bb10c34d.html')
    .get(function(req, res){
        res.sendFile(__dirname + '/google60c020d4bb10c34d.html');
    });



//create a server and listen to port
app.listen(port, function() {
    console.log('initialised on port ' + port);
});
