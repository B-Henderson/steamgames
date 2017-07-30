const apikey = process.env.STEAM_APIKEY;
const express = require('express')
const app = express()
const request = require('request');
const bodyParser = require('body-parser');

app.route('/')
    .get(function(req, res) {
        res.status(200).send('Hello World!')
    })
    .post(function(req, res) {
        request
            .get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + apikey + '&include_appinfo=1&steamid=' + req.param('steamid') + '&format=json', function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    let locals = JSON.parse(body);
                    // res.send(body);
                    let game = Math.floor(Math.random() * locals.response.games.length + 1);
                    random = locals.response.games[game];
                    randomGame = random;
                    res.json(locals);
                }
            })
    })



app.listen(8080, function() {
    console.log('initialised on port 8080');
})
