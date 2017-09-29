'use strict'
const request = require("request");
const fs = require("fs");
const resize = require(__dirname + "/image-resize");

exports.getGameData = function(url, callback) {
    request.get(url, function(err, res, body) {
        if (res.statusCode === 200) {
            callback(err, body);
        } else {
            callback(err);
        }
    });

};


//build the object to be returned as we dont need all the data in the original returns
exports.mapData = function(data, gameId) {
        let url = 'https://image-resize-steam-random.herokuapp.com' + resize.resize_header(data.mediaContent[0][gameId].data.header_image);

    let returnobj = {};
    if (data) {
        returnobj = {
            'gameId': data.mediaContent[0][gameId].data.steam_appid ? data.mediaContent[0][gameId].data.steam_appid : '',
            'gameName': data.mediaContent[0][gameId].data.name ? data.mediaContent[0][gameId].data.name : '',
            'detailedDescription': data.mediaContent[0][gameId].data.name ? data.mediaContent[0][gameId].data.name : '',
            'short_description': data.mediaContent[0][gameId].data.short_description ? data.mediaContent[0][gameId].data.short_description : '',
            'reviews': data.mediaContent[0][gameId].data.reviews ? data.mediaContent[0][gameId].data.reviews : '',
            'header': url,
            'website': data.mediaContent[0][gameId].data.website ? data.mediaContent[0][gameId].data.website : '',
            'genres': data.mediaContent[0][gameId].data.genres ? data.mediaContent[0][gameId].data.genres : '',
            'screenshots': data.mediaContent[0][gameId].data.screenshots ? data.mediaContent[0][gameId].data.screenshots : '',
            'youtubeVideos': [],
            'streams': []
        };

        for (let i = 0; i < data.mediaContent[1].items.length; i++) {
            returnobj.youtubeVideos[i] = {
                'videoId': data.mediaContent[1].items[i].id.videoId ? data.mediaContent[1].items[i].id.videoId : '',
                'title': data.mediaContent[1].items[i].snippet.title ? data.mediaContent[1].items[i].snippet.title : '',
                'channelTitle': data.mediaContent[1].items[i].snippet.channelTitle ? data.mediaContent[1].items[i].snippet.channelTitle : '',
                'thumbnails': data.mediaContent[1].items[i].snippet.thumbnails ? data.mediaContent[1].items[i].snippet.thumbnails : '',
                'videoDescription': data.mediaContent[1].items[i].snippet.description ? data.mediaContent[1].items[i].snippet.description : '',
            };
        }

        for (let j = 0; j < data.mediaContent[2].streams.length; j++) {
            returnobj.streams[j] = {
                'preview': data.mediaContent[2].streams[j].preview ? data.mediaContent[2].streams[j].preview : '',
                'viewers': data.mediaContent[2].streams[j].viewers ? data.mediaContent[2].streams[j].viewers : '',
                'channel': data.mediaContent[2].streams[j].channel ? data.mediaContent[2].streams[j].channel : ''
            };
        }
    }


    return returnobj;
}