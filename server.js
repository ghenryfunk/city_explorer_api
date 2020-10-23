'use strict';

// Bring in our dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
// const { response, request } = require('express');

require('dotenv').config();

// Declare our port for our server to listen on
const PORT = process.env.PORT || 3000;

// Instanciate express
const app = express();

// Create our Postgres client
const client = new pg.Client(process.env.DATABASE_URL);

// Use cors (cross origin resource sharing)
app.use(cors());

// Get routes
app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/location', locationHandler);

app.get('/weather', weatherHandler);

app.get('/trails', trailsHandler);

// I think I need to add a URL or change the route name here to actually send things to by database
app.get('/add', (req, res) => {
  const search_query = req.query.city;

  const SQL = `INSERT INTO cities (search_query) VALUES ($1) RETURNING *`;
  const safeValues = [search_query];

  client
    .query(SQL, safeValues)
    .then((results) => {
      console.log(results);
      res.status(200).json(results.rows); // optional line here to send stuff to the front end so you know you successfully added something without checking the console log
    })
    .catch((error) => {
      console.log('Error', error);
      res.status(500).send('Something went wrong');
    });
});

// This is what sends the table data we're populating in our database back to the front end... I think
app.get('/city', (req, res) => {
  const SQL = 'SELECT search_query FROM cities';

  client
    .query(SQL)
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      console.log('Error', error);
      res.status(500).send('Something went wrong');
    });
});

app.use('*', notFoundHandler);

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

  superagent
    .get(URL)
    .then((data) => {
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

  superagent
    .get(URL)
    .then((data) => {
      const trailArray = data.body.trails.map((value) => {
        // console.log('value is ', value);
        return new Trails(value);
      });
      res.status(200).json(trailArray);
      // console.log('trail data is ', data.body.trails[0]);
    })
    .catch((error) => {
      console.log('error', error);
      res.status(500).send('something went wrong with trails API');
    });
}

function notFoundHandler(req, res) {
  res.status(404).send('Not found!');
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
  this.condition_date = obj.conditionDate;
}

// Connect to our database and Start our server! Tell it what port to listen on
client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Now listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error', err);
  });

// app.listen(PORT, () => {
//   console.log(`Server is now listening on port ${PORT}`);
// });

// EVERYTHING FROM RAY'S DEMO
// 'use strict';

// //bring in dependencies
// const express = require('express');
// const pg = require('pg'); //postgress??

// require('dotenv').config();

// // npm install pg // this will install pg in the terminal

// // create a port for our server to listen on
// const PORT = process.env.PORT || 3000;

// // create our express instance/application
// const app = express();

// // create our postgres client
// const client = new pg.Client(process.env.DATABASE_URL);

// // IN  .env file type DATABASE_URL=postgres://ghenryfunk:pwiuseforpostgres@localhost:5432/nameofthedatabasewe're linking too

// //in terminal type
// //psql -d nameofthedatabase
// // to delete the database type DROP database demo
// // to CREATE A DATABASE type in terminal:
// // psql
// // CREATE DATABASE name;
// // \dt (this will show you all the tables ie relations in your database. Should be empty for first time you run it)
// // to CREATE a table type
// // CREATE TABLE name (columnName SERIAL PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255));

// // CREATE A FILE IN VS CODE CALLED schema.sql
// //Then inside that file type DROP TABLE if exists people; (looking for a table in people database. if it doesn't exist copy and past the create table line from terminal: CREATE TABLE name (columnName SERIAL PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255));)

// // route
// app.use('*', notFoundHandler);

// // create a route that will add to the database!

// app.get('/add', (req, res) => {
//     console.log(req.query); //type in the url /add?first=jae&last=choi
//     const firstName = req.query.first;
//     const lastName = req.query.last;

//     const SQL = `INSERT INTO people (first_name, last_name) VALUES ($1, $2) RETURNING *`;
//     const safeValues = [firstName, lastName];

//     client.query(SQL, safeValues).then( results => {
//       console.log(results);
//       res.status(200).json(results.rows)// optional line here to send stuff to the front end so you know you successfully added something without checking the console log
//     })
//     .catch( error => {
//       console.log('Error', error)
//       res.status(500).send('Something went wrong');
//     })
// })
// // typse psql -d demo and then demo=# SELECT * FROM people; to see what is showing up

// app.get('/people', (req, res) => {
//   const SQL = 'SELECT first_name, last_name FROM people';

//   client.query(SQL).then( results => {
//     res.status(200).json(results.rows);
//   })
//   .catch( error => {
//     console.log('Error', error);
//     res.status(500).send('Something went wrong');
//   })
// })

// // function handlers
// function notFoundHandler(req, res) {
//   res.status(404).send('Not found!');
// }

// // connect to our database and start our server

// client.connect().then( () => {
//   app.listen(PORT, () => {
//     console.log(`Now listening on port ${PORT}`);
//   });
// })
// .catch(err => {
//   console.log('Error', err);
// })

// //now run Nodemon to see if it's working
