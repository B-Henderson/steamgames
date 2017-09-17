const apikey = process.env.STEAM_APIKEY;
const express = require('express')
const app = express()
const request = require('request');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
  extended: true
}));


app.route('/')
    .get(function(req, res) {
        res.status(200).send('Hello World!');
    })
    .post(function(req, res) {
        let userid = req.body;
        request
            .get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + apikey + '&include_appinfo=1&steamid=' + userid.steamid + '&format=json', function(err, response, body) {
                
                console.log(response.body, body);
                if(err) throw err;
                if (!err && response.statusCode === 200) {
                    let locals = JSON.parse(body);
                    step2(locals);
                }
            });
            
        var step2 = function(games){
            step3(games);
        }
        var step3 = function(games){
            res.json(games);
        }
    })



app.listen(8080, function() {
    console.log('initialised on port 8080');
})
