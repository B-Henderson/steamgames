'use strict'
const request = require("request");
const fs = require("fs");


exports.getGameData = function(url, callback) {
    request.get(url, function(err, res, body) {
        if (res.statusCode === 200) {
            callback(err, body);
        }
        else {
            callback(err);
        }

    });

};

exports.mapData = function(data, gameId) {
    
    let returnobj = {
        'gameId': data.mediaContent[0][gameId].data.steam_appid ? data.mediaContent[0][gameId].data.steam_appid : '',
        'gameName': data.mediaContent[0][gameId].data.name ? data.mediaContent[0][gameId].data.name : '',
        'detailedDescription': data.mediaContent[0][gameId].data.name ? data.mediaContent[0][gameId].data.name : '',
        'short_description': data.mediaContent[0][gameId].data.short_description ? data.mediaContent[0][gameId].data.short_description : '',
        'reviews': data.mediaContent[0][gameId].data.reviews ? data.mediaContent[0][gameId].data.reviews : '',
        'header': data.mediaContent[0][gameId].data.header_image ? data.mediaContent[0][gameId].data.header_image : '',
        'website': data.mediaContent[0][gameId].data.website ? data.mediaContent[0][gameId].data.website : '',
        'genres' : data.mediaContent[0][gameId].data.genres ? data.mediaContent[0][gameId].data.genres : '',
        'screenshots': data.mediaContent[0][gameId].data.screenshots ? data.mediaContent[0][gameId].data.screenshots : '',
        'youtubeVideos': [],
        'steams': []
    };
    
    for(let i=0;i<data.mediaContent[1].items.length;i++){
        returnobj.youtubeVideos[i] = {
            'videoId': data.mediaContent[1].items[i].id.videoId ? data.mediaContent[1].items[i].id.videoId : '',
            'title': data.mediaContent[1].items[i].snippet.title ? data.mediaContent[1].items[i].snippet.title : '',
            'channelTitle': data.mediaContent[1].items[i].snippet.channelTitle ? data.mediaContent[1].items[i].snippet.channelTitle : '',
            'thumbnails': data.mediaContent[1].items[i].snippet.thumbnails ? data.mediaContent[1].items[i].snippet.thumbnails : '',
            'videoDescription': data.mediaContent[1].items[i].snippet.description ? data.mediaContent[1].items[i].snippet.description : '',
        };
    }    
    
    
    
    return returnobj; 
}
