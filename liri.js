// our require files
require("dotenv").config();
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const request = require("request");
const inquirer = require("inquirer")
const spotify = new Spotify(keys.spotify);

// starts initial question for various commands
inquirer.prompt([
  {
    type: 'list',
    name: 'command',
    message: 'What would like liri to do?',
    choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says']
  }
])
  .then(answers => {
    chosenAPI(answers.command);
  });

// our main switch function
function chosenAPI(value) {
  switch (value) {
    case "spotify-this-song":
      searchSpotify();
      break;
    case "concert-this":
      findConcert();
      break;
    case "movie-this":
      getMovieInfo();
      break;
    case "do-what-it-says":
      doWhatItSays();
      logData();
      break;
  }
}

// ALL LOGIC FUNCTIONS

// finds song + preview link via spotify api
function searchSpotify() {
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
    spotify.search({ type: 'track', query: (answers.song + ", " + answers.artist) }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      console.log("Here is '" + data.tracks.items[0].name + "' from the album, " + data.tracks.items[0].album.name + ", by " + data.tracks.items[0].album.artists[0].name);
      console.log("Spotify Link: " + data.tracks.items[0].preview_url);
    });
  });
}

// read from random.txt file
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var songdataArray = data.split(",");

    function chosenAPI1() {
      switch (songdataArray[0]) {
        case "spotify-this-song":
          spotify.search({ type: 'track', query: (songdataArray[1]) }, function (err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            console.log("Here is '" + data.tracks.items[0].name + "' from the album, " + data.tracks.items[0].album.name + ", by " + data.tracks.items[0].album.artists[0].name);
            console.log("Spotify Link: " + data.tracks.items[0].preview_url);
          });
          break;
        case "concert-this":
          findConcert();
          break;
        case "movie-this":
          getMovieInfo();
          break;
        case "do-what-it-says":
          doWhatItSays();
      }
    }

    chosenAPI1();
  });
}

// log the data to the terminal/bash window, output the data to a .txt file called log.txt.
function logData(logResults) {
  fs.appendFile("log.txt", logResults + "\r\n", function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Content Added!");
    }
  });
}

// finds movie using OMDB api
function getMovieInfo() {
  inquirer.prompt([{
    type: 'input',
    name: 'movie',
    message: "Name a movie:"
  }
  ]).then(answers => {
    if (!answers.movie) {
      answers.movie = "Mr Nobody";
      console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!")
    }

    request("http://www.omdbapi.com/?t=" + answers.movie + "&apikey=trilogy", function (error, response, body) {

      if (!error && response.statusCode === 200) {
        var movieInfo = JSON.parse(body);

        var movieResult =
          //Line break
          "=======================================================================================================" + "\r\n" +
          //Output the liri command plus answers.movie
          "movie-this ---> " + answers.movie + "\r\n" +
          //Line break
          "=======================================================================================================" + "\r\n" +
          // title of the movie
          "Title: " + movieInfo.Title + "\r\n" +
          // year the movie came out
          "Year movie was released: " + movieInfo.Year + "\r\n" +
          // IMDB rating of the movie
          "IMDB movie rating (out of 10): " + movieInfo.imdbRating + "\r\n" +
          // rotten tomatoes rating of the movie
          "Rotten Tomatoes rating (out of 100%): " + movieInfo.Ratings[1].Value + "\r\n" +
          // country where the movie was produced.
          "Filmed in: " + movieInfo.Country + "\r\n" +
          // language of the movie.
          "Language: " + movieInfo.Language + "\r\n" +
          // plot of the movie.
          "Movie plot: " + movieInfo.Plot + "\r\n" +
          // actors in the movie.
          "Actors: " + movieInfo.Actors + "\r\n" +
          // line break
          "======================================================================================================="

        console.log(movieResult);
        // output the movie information to the log.txt file.
        logData(movieResult);
      }
    });
  });

  function findConcert() {
    
  }
}