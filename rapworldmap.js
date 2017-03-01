// server.js
//==============================================

//====== Ressources and config definition ======
// Load environment variables
require('dotenv').config();

// Define depencies
const express = require('express'),
  app = express(),
  expressLayout = require('express-ejs-layouts'),
  // session = require('express-session'),
  session = require('client-sessions'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  flash = require('connect-flash'),
  expressValidator = require('express-validator');

// Define config variables/const
const port = process.env.PORT || 3666;

//====== App configuration ======
// Connect the database
// @TODO Verify that connection work before launch it to avoid app error on display.
mongoose.connect(process.env.DB_URI);

// Load passport configuration
require('./app/config/passport')(passport); // pass passport for configuration

// Use morgan for log
app.use(morgan('dev'));

// Set sessions and cookie parser
app.use(cookieParser());
// Use body parser to grab info from a form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(session({
  cookieName: 'session',
  secret: process.env.SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Flash message
app.use(flash());

// Define statics assets path
app.use(express.static(__dirname + '/public'));
// Define upload folder path
app.use('/uploads', express.static(__dirname + '/uploads'));

// Set ejs as our templating engine
app.set('view engine', 'ejs');
app.set('views', 'app/views');
app.use(expressLayout);

//====== Configure the routes ======
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//====== Start server ======
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});