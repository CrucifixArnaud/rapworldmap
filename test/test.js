require('dotenv').config();

const mongoose = require('mongoose'),
  should = require('should'),
  Artist = require('../app/modules/artists/artist.model');

// Connect to db
mongoose.connect(process.env.DB_URI, {
  useMongoClient: true
});

describe('Artists', function(){
  beforeEach(function(done){

    const artist = new Artist({
      name: 'Boby',
      location: {
        city: 'BobyVille',
        coordinates: '23, 23',
        neighborhood: 'Lesquer'
      },
      categories: 'rapper',
      image: {
        thumbnailUrl: '/path/to/url.jpg'
      },
      bio: {
        summary: 'Boby the king',
        url: 'http://boby.com',
        birthdate: '01/01/1985',
        deathdate: null,
        yearsActiveStart: 2003,
        yearsActiveEnd: null
      },
      youtube: {
        clipExampleUrl: 'http://www.youtube.com'
      },
      published: false
    });

    artist.save((err) => {
      if (err) {
        console.log(err.message);
      }
      done();
    });
  });

  afterEach(function(done) {
    Artist.remove({ slug: 'boby' }, (err) => {
      if(err) {
        console.log(err);
      }

      done();
    });
  });

  it('retrieves by slug', function(done) {
    Artist.findOne({ slug: 'boby' }, (err, artist) => {
      if(err) {
        console.log(err);
      }

      artist.slug.should.equal('boby');
      done();
    });

  });

  it('cannot register an artist whitout name and city', function(done) {
    const artist = new Artist({
      name: '',
      location: {
        city: ''
      },
      published: false
    });

    artist.save((err) => {
      should.exist(err);
      done();
    });
  });
});