// adding npm packages: fs (file system), Express,  Handlebars, path
const path = require('path');
const express = require('express');


// use port provided by the cloud hosting OR port 3000
const port = process.env.PORT || 3000;
const fs = require('fs');

// app is now a server
var app = express();

/* Creating Dynamic html page using Handlebars package */



// adding a folder to be viewable for clients ('public' folder and sub directories)
app.use(express.static(__dirname+ '/public/styles'));
app.use(express.static(__dirname+ '/public/images'));
app.use(express.static(__dirname+ '/public'));


// setting route to home page
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/views/index.html');
  
});

// setting route to home page
app.get('/world', (req, res) => {
  res.sendFile(__dirname+'/views/world-news.html');
  
});
// setting route to home page
app.get('/tech', (req, res) => {
  res.sendFile(__dirname+'/views/tech-news.html');
  
});
// setting route to home page
app.get('/middle-east', (req, res) => {
  res.sendFile(__dirname+'/views/middle-east-news.html');
  
});
// setting route to home page
app.get('/science-and-space', (req, res) => {
  res.sendFile(__dirname+'/views/ss-news.html');
  
});

// setting route to home page
app.get('/entertainment', (req, res) => {
  res.sendFile(__dirname+'/views/e-news.html');
  
});

// setting route to home page
app.get('/world-sport', (req, res) => {
  res.sendFile(__dirname+'/views/world-sport-news.html');
  
});

// setting route to home page
app.get('/travel', (req, res) => {
  res.sendFile(__dirname+'/views/travel-news.html');
  
});

// setting route to home page
app.get('/weather', (req, res) => {
  res.sendFile(__dirname+'/views/weather-page.html');
  
});



// listening on available port
app.listen(port, () =>{
  console.log(`Server is listening on port ${port}`);
});
