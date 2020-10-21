'use strict';

// Bring in our dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// const { response, request } = require('express');

require('dotenv').config();

// Declare our port for our server to listen on
const PORT = process.env.PORT || 3000;

// Instanciate express
const app = express();

// Use cors (cross origin resource sharing)
app.use(cors());

// Get routes
app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/location', locationHandler);

app.get('/weather', weatherHandler);

app.get('/trails', trailsHandler);

// Create handler functions for our different routes:

function locationHandler(req, res) {
  let city = req.query.city;
  let key = process.env.LOCATIONIQ_API_KEY; // my API key is stored as a variable in .env

  const URL = `http://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  superagent
    .get(URL)
    .then((data) => {
      let location = new Location(city, data.body[0]);
      res.status(200).json(location);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('something went wrong with location API');
    });
  // try {
  //   let city = req.query.city;
  //   // simulate getting the data from a database or API, using a flat file
  //   let data = require('./data/location.json')[0];
  //   let location = new Location(data, city);
  //   res.send(location);
  // }
  // catch (error) {
  //   console.log('ERROR', error);
  //   res.status(500).send('ERROR: Something broke. Sorry');
  // }
}

function weatherHandler(req, res) {
  // let city = req.query.search_query;
  let lat = req.query.latitude;
  let lon = req.query.longitude;

  // let data = require('./data/weather.json');
  let key = process.env.WEATHER_API_KEY;

  const URL = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${key}&days=7`;

  superagent.get(URL).then(data => {
    const weatherArray = data.body.data.map((value, i) => {
      // console.log('value being passed in to .map loop is ', value);
      return new Weather(value, i);
      // weatherArray.push(weather);
    });
    res.status(200).json(weatherArray);
  })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('something went wrong with weather API');
    });
  // data.data.map((value) => {
  //   let weather = new Weather(value);
  //   weatherArray.push(weather);
  // });
  // res.send(weatherArray);
}

function trailsHandler(req, res) {
  let lat = req.query.latitude;
  let lon = req.query.longitude;

  let key = process.env.TRAIL_API_KEY;

  const URL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;

  superagent.get(URL).then(data => {
    const trailArray = data.body.trails.map(value => {
      console.log('value is ', value);
      return new Trails(value);
    });
    res.status(200).json(trailArray);
    console.log('trail data is ', data.body.trails[0]);
  })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('something went wrong with trails API');
    });
}

// Create a constructor to tailor our incoming raw data

function Location(query, obj) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
}

function Trails(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionStatus;
  this.ocndition_date = obj.conditionDate;
}

// Start our server! Tell it what port to listen on
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
