// artists.controller.js
//==============================================

//====== Define depencies ======
const Artist = require('./artist.model'),
  moment = require('moment'),
  underscore= require('underscore');

//====== Export method ======
module.exports = {
  showArtists: showArtists,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteArtist: deleteArtist
};

//====== Methods ======

/**
 * [showArtists Show a list of all artists]
 */
function showArtists (req, res) {
  Artist.find({}, (err, artists) => {

    if(err) {
      res.status(404);
      res.send('Artists not found!');
    }

    res.render('pages/artists/artists', {
      artists: artists,
      moment: moment,
      success: req.flash('success')
    });

  });
}

/**
 * [showSingle Show a single artist]
 */
function showSingle (req, res) {
  // get a single artist
  Artist.findOne({ slug: req.params.slug }, (err, artist) => {
    if(err) {
        res.status(404);
        res.send(`Artist ${req.params.slug} cannot be found!`);
    }

    res.json(artist);
  });
}

/**
 * [showCreate Show artist creation page]
 */
function showCreate(req, res) {
  res.render('pages/artists/create', {
    errors: req.flash('errors')
  });
}

/**
 * [processCreate Process artist creation]
 */
function processCreate(req, res) {
  // validate informations
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('city', 'City name is required').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('/artists/create');
  }

  // create a new artist
  const artist = new Artist({
    name: req.body.name,
    location: [{
      city: req.body.city,
      coordinates: req.body.coordinates,
      neighborhood: req.body.neighborhoodName
    }],
    categories: req.body.categories,
    image: [{
      thumbnailUrl: req.body.thumbnailUrl
    }],
    bio: [{
      summary: req.body.summary,
      wikipediaUrl: req.body.wikipediaUrl,
      birthdate: req.body.birthdate,
      deathdate: req.body.deathdate
    }],
    youtube: [{
      pageUrl: req.body.youtugePageUrl,
      clipExampleUrl: req.body.clipExampleUrl
    }]
  });

  artist.save((err) => {

    if (err) {
      req.flash('errors', err.message);
      return res.redirect('/artists/create');
    }

    // set a successful flash message
    req.flash('success', 'Successfuly created artist!');

    // Redirect to the newly created artist
    res.redirect(`/artists`);
  });
}

/**
 * [showEdit Show artist edit page]
 */
function showEdit(req, res) {
  // Retrieve the artist to edit
  Artist.findOne({ slug: req.params.slug }, (err, artist) => {

    // Return 404 if artist cannot be found
    if(!artist) {
      res.status(404);
      res.send(`Artist ${req.params.slug} cannot be found!`);
    }

    // Render the view
    res.render('pages/artists/edit', {
      artist: artist,
      moment: moment,
      underscore: underscore,
      errors: req.flash('errors')
    });
  });
}

/**
 * [processEdit Process artist edition]
 */
function processEdit(req, res) {
  // validate informations
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('city', 'City name is required').notEmpty();

  // if there are errors, redirect to form and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect(`/artists/${req.params.slug}/edit`);
  }

  // Find current artist
  Artist.findOne({ slug: req.params.slug }, (err, artist) => {

    // updating the current artist
    artist.name = req.body.name;
    artist.location[0].city = req.body.city;
    artist.location[0].coordinates = req.body.coordinates;
    artist.location[0].neighborhood = req.body.neighborhoodName;
    artist.categories = req.body.categories;
    artist.image[0].thumbnailUrl = req.body.thumbnailUrl;
    artist.bio[0].summary = req.body.summary;
    artist.bio[0].wikipediaUrl = req.body.wikipediaUrl;
    artist.bio[0].birthdate = req.body.birthdate;
    artist.bio[0].deathdate = req.body.deathdate;
    artist.youtube[0].pageUrl = req.body.youtugePageUrl;
    artist.youtube[0].clipExampleUrl = req.body.clipExampleUrl;

    artist.save( (err) => {
      // If error stop and display it
      if(err)
        throw err;

      // Set flash success
      // Redirect to artists
      req.flash('success', `Successfuly update ${artist.name}!`);
      res.redirect('/artists');
    });

  });
}

/**
 * [deleteArtist Delete an artist from the database]
 */
function deleteArtist(req, res) {
  Artist.remove({ slug: req.params.slug }, (err) => {
    console.log(res);
    req.flash('success', `Artist ${req.params.slug} successfuly delete`);
    res.redirect('/artists');
  });
}