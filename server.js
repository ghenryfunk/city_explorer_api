'use strict';

// Bring in our dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const { response, request } = require('express');

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

// Create handler functions for our different routes:

function locationHandler(req, res) {
  let city = req.query.city;
  let key = process.env.LOCATIONIQ_API_KEY; // my API key is stored as a variable in .env

  const URL = `http://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  superagent
    .get(URL)
    .then((data) => {
      console.log(data.body[0]);
      let location = new Location(city, data.body[0]);
      res.status(200).json(location);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('something went wrong');
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
  try {
    let data = require('./data/weather.json');
    let weatherArray = [];
    data.data.map((value) => {
      let weather = new Weather(value);
      weatherArray.push(weather);
    });
    res.send(weatherArray);
  } catch (error) {
    console.log('ERROR', error);
    res.status(500).send('ERROR: Something broke. Sorry');
  }
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
  this.time = obj.datetime;
}

// Start our server! Tell it what port to listen on
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
