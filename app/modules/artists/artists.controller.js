// artists.controller.js
//==============================================

//====== Define depencies ======
const Artist = require('./artist.model'),
  moment = require('moment'),
  underscore = require('underscore'),
  multer = require('multer'),
  sharp = require('sharp'),
  nodemailer = require('nodemailer'),
  userMiddlewares = require('../users/user.middlewares');

//====== Export method ======
module.exports = {
  showArtists: showArtists,
  showSingle: showSingle,
  showCreate: showCreate,
  processCreate: processCreate,
  processSubmit: processSubmit,
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
    slug: 'page-admin',
    form: req.flash('body')
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

  if(req.body.coordinates) {
    req.checkBody('coordinates', 'Coordinate must be formated <lng, lat>').matches(/(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)\w+/);
  }

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();

  if (errors) {
    console.log('Errors: ', errors.map(err => err.msg));
    req.flash('errors', errors.map(err => err.msg));
    return res.status(400).redirect('/artists/create');
  }

  var thumbnail = req.file ? req.file.filename : req.body.thumbnailUrl;

  var published = (req.isAuthenticated() ? req.body.published : false);

  // create a new artist
  const artist = new Artist({
    name: req.body.name,
    location: {
      city: req.body.city,
      coordinates: req.body.coordinates,
      neighborhood: req.body.neighborhoodName
    },
    categories: req.body.categories,
    image: {
      thumbnailUrl: thumbnail
    },
    bio: {
      summary: req.body.summary,
      url: req.body.bioUrl,
      birthdate: req.body.birthdate,
      deathdate: req.body.deathdate,
      yearsActiveStart: req.body.yearsActiveStart,
      yearsActiveEnd: req.body.yearsActiveEnd
    },
    youtube: {
      clipExampleUrl: req.body.clipExampleUrl
    },
    published: published
  });

  artist.save((err) => {

    if (err) {
      console.log(err.msg);
      req.flash('errors', err.msg);
      return res.redirect('/artists/create');
    }

    // User is logged (creation from admin)
    // set a successful flash message
    console.log('Successfuly created ' + req.body.name);
    req.flash('success', 'Successfuly created artist!');

    // Redirect to the newly created artist
    res.redirect('/artists/create');
  });
}

/**
 * [processSubmit Process submit artist]
 * From atlas by non authenticated user
 */
function processSubmit(req, res) {

  // validate informations
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('city', 'City name is required').notEmpty();

  // Check errors
  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json(errors);
  }

  // create a new artist
  const artist = new Artist({
    name: req.body.name,
    location: [{
      city: req.body.city,
      coordinates: '',
      neighborhood: ''
    }],
    categories: [],
    image: {
      thumbnailUrl: ''
    },
    bio: [{
      summary: '',
      url: '',
      birthdate: '',
      deathdate: '',
      yearsActiveStart: '',
      yearsActiveEnd: ''
    }],
    youtube: [{
      clipExampleUrl: req.body.clipExampleUrl
    }],
    published: false
  });

  artist.save((error) => {

    if (error) {
      return res.status(400).json([error]);
    }

    var smtpConfig = {
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized:false
      }
    };

    var transporter = nodemailer.createTransport(smtpConfig);

    var mailOptions = {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: 'Rap World Map - New entry submited: ' + req.body.name,
      html: '<p>A new entry was submited.</p> <ul><li>Name: ' + req.body.name + '</li> <li>City: ' + req.body.city + '</li></ul> <a href="http://rapworldmap.com/login">Edit the entry on rapworldmap.com</a>'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.json({
          error: error,
          response: info.response
        });
      } else {
        res.json({
          success: true,
          response: info.response
        });
      }
    });
  });
}

/**
 * [uploadThumbnail Upload thumbnail (using multer)]
 */
function uploadThumbnail(req, res, next) {
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
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
      sharp(req.file.path).resize(300, 300).crop(sharp.strategy.entropy).toFile('uploads/medium-' + req.file.filename, function (err, info) {
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

    console.log(artist);

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

    var published = (userMiddlewares.isLoggedIn ? req.body.published : false);

    // updating the current artist
    artist.name = req.body.name;
    artist.location.city = req.body.city;
    artist.location.coordinates = req.body.coordinates;
    artist.location.neighborhood = req.body.neighborhoodName;
    artist.categories = req.body.categories;
    artist.image.thumbnailUrl = tumbnail;
    artist.bio.summary = req.body.summary;
    artist.bio.url = req.body.bioUrl;
    artist.bio.birthdate = req.body.birthdate;
    artist.bio.deathdate = req.body.deathdate;
    artist.bio.yearsActiveStart = req.body.yearsActiveStart;
    artist.bio.yearsActiveEnd = req.body.yearsActiveEnd;
    artist.youtube.pageUrl = req.body.youtugePageUrl;
    artist.youtube.clipExampleUrl = req.body.clipExampleUrl;
    artist.published = published;

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
      $gt: []
    },
    'published': true
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
          'coordinates': JSON.parse( '[' + artist.location.coordinates + ']' )
        },
        'properties': {
          'name': artist.name,
          'icon': {
            'iconUrl': (artist.image.thumbnailUrl ? '/uploads/medium-' + artist.image.thumbnailUrl : '/images/placeholder-artists.svg'),
            'iconSize': [50, 50],
            'iconAnchor': [25, 25],
            'popupAnchor': [0, -25],
            'className': 'marker'
          },
          'location' : {
            'city': artist.location.city,
            'neighborhood': artist.location.neighborhood,
            'coordinates': artist.location.coordinates
          },
          image: {
            thumbnailUrl: artist.image.thumbnailUrl,
          },
          categories: artist.categories,
          bio: {
            summary: artist.bio.summary,
            url: artist.bio.url,
            birthdate: artist.bio.birthdate,
            deathdate: artist.bio.deathdate,
            yearsActiveStart: artist.bio.yearsActiveStart,
            yearsActiveEnd: artist.bio.yearsActiveEnd
          },
          youtube: {
            pageUrl: artist.youtube.pageUrl,
            clipExampleUrl: artist.youtube.clipExampleUrl
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