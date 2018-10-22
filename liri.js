require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const request = require("request");
const inquirer = require("inquirer")

var spotify = new Spotify(keys.spotify);

inquirer
  .prompt([
    {
      type: 'list',
      name: 'command',
      message: 'What would like liri to do?',
      choices: ['Find a Concert', 'Find a song on Spotify', 'Find a Movie', 'Do as I say']
    }
  ])
  .then(answers => {
    chosenAPI(answers.command);
  });

function chosenAPI(value) {

  switch (value) {
    case "Find a song on Spotify":
      inquirer.prompt([{
        type: 'input',
        name: 'song',
        message: "Name a song:"
      }, {
        type: 'input',
        name: 'artist',
        message: "Name the artist:"
      }
      ]).then(answers => {
        // console.log(answers);
        spotify.search({ type: 'track', query: (answers.song + ", " + answers.artist) }, function (err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          console.log("Here is '" + data.tracks.items[0].name + "' from the album, " + data.tracks.items[0].album.name + ", by " + data.tracks.items[0].album.artists[0].name);
          console.log("Spotify Link: " + data.tracks.items[0].preview_url);
        });
      });
      break;
    case "Find a Concert":
      inquirer.prompt([{
        type: 'input',
        name: 'artist',
        message: "Name an artist:"
      }
      ]).then(answers => {
        // console.log(answers);
        console.log(answers);
        var queryURL = "https://rest.bandsintown.com/artists/" + answers.artist + "/events?app_id=codingbootcamp";

        request(queryURL, function (err, response, body) {
          if (err) {
            console.log(err);
          } else {
            console.log(body[0]);
          }
        })
      });
      break;
    case "Find a Movie":
      // code block
      inquirer.prompt([{
        type: 'input',
        name: 'movie',
        message: "Name a movie:"
      }
      ]).then(answers => {
        // console.log(answers);
        console.log(answers);
        if (answers.movie === undefined) {
          answers.movie = "mr nobody";
        }
        // HTTP GET request
        request("http://www.omdbapi.com/?t=" + answers.movie + "&y=&plot=short&r=json", function (error, response, body) {
          if (!error && response.statusCode === 200) {
            console.log("* Title of the movie:         " + JSON.parse(body).Title);
            console.log("* Year the movie came out:    " + JSON.parse(body).Year);
            console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
            console.log("* Country produced:           " + JSON.parse(body).Country);
            console.log("* Language of the movie:      " + JSON.parse(body).Language);
            console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
            console.log("* Actors in the movie:        " + JSON.parse(body).Actors);

            // For loop parses through Ratings object to see if there is a RT rating
            // 	--> and if there is, it will print it
            for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
              if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                console.log("* Rotten Tomatoes Rating:     " + JSON.parse(body).Ratings[i].Value);
                if (JSON.parse(body).Ratings[i].Website !== undefined) {
                  console.log("* Rotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website);
                }
              }
            }
          }
        })
      });
      break;
    case "do-what-it-says":
      // code block
      break;
  }
}