// artists.controller.js
//==============================================

//====== Define depencies ======
const Artist = require('./artist.model');

//====== Export method ======
module.exports = {
  showCreate: showCreate,
  processCreate: processCreate,
  showSingle: showSingle
};

//====== Methods ======

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
  req.checkBody('neighborhoodName', 'Neighborhood Name is required').notEmpty();

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
      coordinates: req.body.coordinates,
      name: req.body.neighborhoodName
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
    if (err)
      throw err;

    // set a successful flash message
    req.flash('success', 'Successfuly created artist!');

    // Redirect to the newly created artist
    res.redirect(`/artists/${artist.slug}`);
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