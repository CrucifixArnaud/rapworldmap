// artists.controller.js
//==============================================

//====== Define depencies ======
const Artist = require('./artist.model'),
  moment = require('moment'),
  underscore = require('underscore'),
  multer = require('multer'),
  sharp = require('sharp');

//====== Export method ======
module.exports = {
  showArtists: showArtists,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteArtist: deleteArtist,
  getArtistsGeojson: getArtistsGeojson,
  uploadThumbnail: uploadThumbnail
};

//====== Methods ======

/**
 * [showArtists Show a list of all artists]
 */
function showArtists (req, res) {
  Artist.find({}, (err, artists) => {

    const locals = {
      artists: artists,
      moment: moment,
      success: req.flash('success'),
      layout: 'admin',
      title: 'All artists (' + artists.length + ')',
      slug: 'page-admin'
    };

    if(err) {
      res.status(404);
      res.send('Artists not found!');
    }

    res.render('pages/artists/artists', locals);
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
  const locals = {
    errors: req.flash('errors'),
    underscore: underscore,
    layout: 'admin',
    title: 'Create a new artist',
    slug: 'page-admin'
  };

  res.render('pages/artists/create', locals);
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

  var thumbnail = req.file ? req.file.filename : req.body.thumbnailUrl;

  // create a new artist
  const artist = new Artist({
    name: req.body.name,
    location: [{
      city: req.body.city,
      coordinates: req.body.coordinates,
      neighborhood: req.body.neighborhoodName
    }],
    categories: req.body.categories,
    image: {
      thumbnailUrl: thumbnail
    },
    bio: [{
      summary: req.body.summary,
      wikipediaUrl: req.body.wikipediaUrl,
      birthdate: req.body.birthdate,
      deathdate: req.body.deathdate,
      yearsActiveStart: req.body.yearsActiveStart,
      yearsActiveEnd: req.body.yearsActiveEnd
    }],
    youtube: [{
      pageUrl: req.body.pageUrl,
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
    res.redirect('/artists/create');
  });
}

/**
 * [uploadThumbnail Upload thumbnail (using multer)]
 */
function uploadThumbnail(req, res, next) {
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + '-' + file.originalname);
    }
  });
  var upload = multer({ storage : storage}).single('thumbnail');

  upload(req,res,function(err) {
    if(err) {
      return res.end('Error uploading file: ' + req.file);
    }

    if(req.file) {
      sharp(req.file.path).resize(300, 300).crop(sharp.strategy.entropy).toFile('public/uploads/medium-' + req.file.filename, function (err, info) {
        if (err) {
          return next(err);
        }

      });
    }

    next();

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

    const locals = {
      artist: artist,
      moment: moment,
      underscore: underscore,
      errors: req.flash('errors'),
      layout: 'admin',
      title: 'Edit artist - <span class="artist-name">' + artist.name + '</span>',
      slug: 'page-admin'
    };

    // Render the view
    res.render('pages/artists/edit', locals);
  });
}

/**
 * [processEdit Process artist edition]
 */
function processEdit(req, res) {

  console.log(req.body);

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

    var tumbnail = req.file ? req.file.filename : req.body.originalThumbnail;

    // updating the current artist
    artist.name = req.body.name;
    artist.location[0].city = req.body.city;
    artist.location[0].coordinates = req.body.coordinates;
    artist.location[0].neighborhood = req.body.neighborhoodName;
    artist.categories = req.body.categories;
    artist.image[0].thumbnailUrl = tumbnail;
    artist.bio[0].summary = req.body.summary;
    artist.bio[0].wikipediaUrl = req.body.wikipediaUrl;
    artist.bio[0].birthdate = req.body.birthdate;
    artist.bio[0].deathdate = req.body.deathdate;
    artist.bio[0].yearsActiveStart = req.body.yearsActiveStart;
    artist.bio[0].yearsActiveEnd = req.body.yearsActiveEnd;
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
    if(err) {
      console.log(err);
    } else {
      req.flash('success', `Artist ${req.params.slug} successfuly delete`);
      res.redirect('/artists');
    }
  });
}

/**
 * [getArtistsGeojson Return a list of all rappers formated into geojson for mapbox]
 */
function getArtistsGeojson (req, res) {

  Artist.find({
    'location.coordinates': {
      $ne: ''
    }
  }, (err, artists) => {

    if(err) {
      res.status(404);
      res.send('Artists not found!');
    }

    var features = [];
    for (var i = artists.length - 1; i >= 0; i--) {
      var artist = artists[i];

      features.push({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': JSON.parse( '[' + artist.location[0].coordinates + ']' )
        },
        'properties': {
          'name': artist.name,
          'icon': {
            'iconUrl': (artist.image[0].thumbnailUrl ? '/uploads/medium-' + artist.image[0].thumbnailUrl : '/images/placeholder-artists.svg'),
            'iconSize': [50, 50],
            'iconAnchor': [25, 25],
            'popupAnchor': [0, -25],
            'className': 'marker'
          },
          'location' : {
            'city': artist.location[0].city,
            'neighborhood': artist.location[0].neighborhood,
            'coordinates': artist.location[0].coordinates
          },
          image: {
            thumbnailUrl: artist.image[0].thumbnailUrl,
          },
          categories: artist.categories,
          bio: {
            summary: artist.bio[0].summary,
            wikipediaUrl: artist.bio[0].wikipediaUrl,
            birthdate: artist.bio[0].birthdate,
            deathdate: artist.bio[0].deathdate,
            yearsActiveStart: artist.bio[0].yearsActiveStart,
            yearsActiveEnd: artist.bio[0].yearsActiveEnd
          },
          youtube: {
            pageUrl: artist.youtube[0].pageUrl,
            clipExampleUrl: artist.youtube[0].clipExampleUrl
          }
        }
      });
    }

    var geojson = {
      'type': 'FeatureCollection',
      'features': features
    };

    res.status(200).json(geojson);
  });
}