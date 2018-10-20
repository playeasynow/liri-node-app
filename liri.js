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
      inquirer.prompt([ {
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
    case "concert-this":
      // code block
      break;
    case "movie-this":
      // code block
      break;
    case "do-what-it-says":
      // code block
      break;
  }
}