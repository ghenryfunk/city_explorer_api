# city_explorer_api
301n19 labs 6-9

**Author**: Henry Funk
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview

## Heroku deployment link:
- [deployed page:](https://city-explorer-api301n19.herokuapp.com/)<br>https://city-explorer-api301n19.herokuapp.com/



<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
## Lab 06
### Steps to create a Server
1. Make a 'server.js' file
1. In your terminal, navigate to the folder that server.js is located in and run npm init -y
1. Then install 3 node libraries names express, cors, and dotenv by running npm install express cors dotenv
1. We need to bring our dependencies into server.js by going into server.js in VS Code and type:
  ```
  const express = require('express');
  const cors = require('cors');
  require('dotenv').config();
  ```
1. Within the .env file, type PORT=3000
1. Declare our port for our server to listen to in server.js by typing const PORT = process.env.PORT || 3000
1. Instantiate express in server.js by typing const app = express();
1. Use cors (cross origin resource sharing) in server.js by typing app.use(cors());
1. Start our server! Do this in server.js by typing 
  ```
  app.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
  })
  ```
1. Now we can actually start our server! Go to your terminal and type nodemon

## Lab 07
### Adding superagent
1. Just add it as a depdendency like we already did w/ express, cors, and dotenv. Type in server.js:
  ``` 
  const superagent = require('superagent');
  ```
1. Install superagent in your terminal by typing 'npm install superagent'

## Lab 08
### Creating a Database
1. Bring in posgress dependency in server.js by typing:
  ```
  const pg = require('pg');
  ```
2. Create our postgres client
  ```
  const client = new pg.Client(process.env.DATABASE_URL);
  ```
3. In .env file, type:
  ```
  DATABASE_URL=postgres://localhost:5432/dbName
  ```
4. Establish a route back in server.js
  ```
  app.use('*', notFoundHandler);
  ```
5. Declare notFoundHandler:
  ```
  function notFoundHandler(req, res) {
  res.status(404).send('Not found!');
}
  ```
6. Connect to our database and start our server
  ``` 
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
  ```
7. Now run Nodemon to see if it's working
  - If it's not working, likely because you didn't actually create your database yet (called dbName in the above example, declared at the end of the URL)

8. To create the database, go to your terminal and type psql:
```
CREATE DATABASE dbName;
```
- now check it worked by typing 
```
\c dbName
```
- this will also CONNECT YOU to the database
- check if there are any tables (relations) in the database by typing:
```
\dt
```
- There should not be any tables yet, so we need to create one or more to store data in later (create relational structure for our databse?) To do this, make sure you're in your database so it should look like:
```
dbName=# CREATE TABLE tableName (id SERIAL KEY, column_name_1 VARCHAR(255), column_name_2 VARCHAR(255));
```
    - *// you can add as many columns here as you need
    - // Serial Primary Key just numbers your rows for you automatically
    - // VARCHAR is specifying variable characters capped at 255 characters for your input
- Now you can check that you actually created your table by typing:
    ``` 
    \dt
    ```
9. Now let's go back to VS CODE because editing our table in the terminal EVERY TIME would be a pain. CREATE a new file called schema.sql
10. In schema.sql first line should check if the table exists and drop it if it does as we will be instantiating (or re-installing in this case) the table below. But first type:
  ```
  DROP TABLE if exists tableName;
  ```
11. Now instantiate/ create the table by typing:
  ```
  CREATE TABLE tableName (
  id SERIAL PRIMARY KEY, 
  column_name_1 VARCHAR(255),
  column_name_2 VARCHAR(255)
);
  ```
12. To check that the schema.sql above is linked and working, go back to the terminal and quit out of psql by typing \q
  - Then type the following command to see if it shows "DROP TABLE CREATE TABLE"
  ```
  psql -f schema.sql -d dbName
  ```
  - If you want to get back into psql to check your table, type this in terminal:
  ```
  psql -d dbName
  \dt
  SELECT * FROM tableName;
  ```
13. Now we return to node land aka VS CODE to create a route for the user to use that will actually add data to our database. To do this, go to the route section of server.js and type:
  ```
  app.get('/add', (req, res) => {
  const column_name_1 = req.query.___;
  const column_name_2 = req.query.___;

  const SQL = `INSERT INTO tableName (column_name_1, column_name_2) VALUES ($1, $2) RETURNING *`;
  const safeValues = [column_name_1, column_name_2];

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
```
14. Now we need to type another route to get the entered data back (...?). Do this by typing a new route right below the /add route:
```
app.get('/tableName', (req, res) => {
  const SQL = 'SELECT column_name_1, column_name_2 FROM tableName';

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
```

  

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->