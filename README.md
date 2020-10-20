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

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with a GET route for the location resource.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->