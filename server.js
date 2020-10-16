'use strict';

// Bring in our dependencies
const express = require('express');
const cors = require('cors');
const { response, request } = require('express');

require('dotenv').config();

// Declare our port for our server to listen on
const PORT = process.env.PORT || 4000;

// Instanciate express
const app = express();

// Use cors (cross origin resource sharing)
app.use(cors());

// Get routes
app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/location', (request, response) => {
  let city = request.query.city;
  // simulate getting the data from a database or API, using a flat file
  let data = require('./data/location.json')[0];
  let location = new Location(data, city);
  response.send(location);
});

// app.get('/weather', (request, response) => {
//   let data = require('./data/weather.json');
// });

// Create a constructor to tailor our incoming raw data

function Location(obj, query) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}


// Start our server! Tell it what port to listen on
app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}`);
});
