require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArgs = process.argv;
var primary = process.argv[2];
var songName = "";
var movieName = "";

switch (primary) {
    case "my-tweets":
        twitterFunction();
        break;

    case "spotify-this-song":
        spotifyFunction();
        break;

    case "movie-this":
        omdbFunction();
        break;

    case "do-what-it-says":
        randomFunction();
        break;

};

//Twitter function
function twitterFunction() {

    client.get('search/tweets', { q: 'amircasebootca1' }, function (error, tweets, response) {
        if (error) {
            console.log(error);
        }
        console.log("Here are my tweets: ");
        console.log("======================");
        for (var j = 0; j < tweets.statuses.length; j++) {
            console.log("Date: " + tweets.statuses[j].created_at);
            console.log("tweet: " + tweets.statuses[j].text);
        }
        console.log("======================");

    });


};

//Spotify search and callback function
function spotifyFunction() {


    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            songName = songName + " " + nodeArgs[i];

        }

        else {

            songName += nodeArgs[i];
        }
    }

    if (songName === "") {
        songName = "The Sign"
    }
    console.log("songName final is: " + songName);
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }


        //console.log(JSON.stringify(data, null, 2))
        for (var k = 0; k < data.tracks.items.length; k++) {
            console.log("Artists: " + data.tracks.items[k].artists[0].name);
            console.log("song Title: " + data.tracks.items[k].name)
            console.log("Album :" + data.tracks.items[k].album.name);
            console.log("Preview: " + data.tracks.items[k].preview_url);
        }

        console.log("Secondary: " + songName)
    });
};

function omdbFunction() {
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            movieName = movieName + "+" + nodeArgs[i];

        }

        else {

            movieName += nodeArgs[i];
        }
    }

    if (movieName === "") {
        movieName = "Mr. Nobody"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";


    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {


        if (!error && response.statusCode === 200) {

            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes: " + JSON.parse(body).tomatoRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Lnguage: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);

        }
    });

}

function randomFunction(){
    fs.readFile("random.txt", "utf8", function (err, data1){
        if(err){
            console.log(err);
        }

        console.log(data1);

        var dataArr = data1.split(",")
        console.log(dataArr);

        primary = dataArr[0];
        songName = dataArr[1];
        movieName = dataArr[1];
        spotifyFunction();

    })
}

