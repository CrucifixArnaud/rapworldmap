// server.js
//==============================================

//====== Ressources and config definition ======
// Define depencies
const express = require('express'),
  app = express(),
  morgan = require('morgan');

// Define config variables/const
const port = process.env.PORT || 8080;

//====== App configuration ======
// Use morgan for log
app.use(morgan('dev'));

//====== Start server ======
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});