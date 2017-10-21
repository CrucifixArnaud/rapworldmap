require('dotenv').config();

const mongoose = require('mongoose'),
  should = require('should'),
  Artist = require('../app/modules/artists/artist.model');

// Replace default mongoose promise by native es6 promise
mongoose.Promise = global.Promise;

describe('Artists', function(){
  before(function(done) {
    // Connect to db
    mongoose.connect(process.env.DB_URI, {
      useMongoClient: true
    }, function(error) {
        if (error) {
          console.error('Error while connecting:\n%\n', error);
        }

        done(error);
    });
  });

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
    Artist.remove({
      slug:  {
        $in: [
          'boby',
          'bondy'
        ]
      }
    }, (err) => {
      if(err) {
        console.log(err);
      }

      done();
    });
  });

  after(function(){
    mongoose.connection.close()
  })

  // Can be save
  it('can be save', function(done) {
    const artist = new Artist({
      name: 'Bondy',
      location: {
        city: 'Bondy city'
      }
    });

    artist.save(() => {
      done();
    });
  });

  // Cannot be save whitout name and city
  it('cannot be save whitout name and city', function(done) {
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

  // Cannot be save with an allready existing name
  it('cannot be save with an allready existing name', function(done) {
    const artist = new Artist({
      name: 'Boby',
      location: {
        city: 'Bob town'
      },
      published: false
    });

    artist.save((err) => {
      should.exist(err);
      done();
    });
  });

  // Retrieves by slug
  it('retrieves by slug', function(done) {
    Artist.findOne({ slug: 'boby' }, (err, artist) => {
      if(err) {
        console.log(err);
      }

      artist.slug.should.equal('boby');
      done();
    });
  });

  // Submited artist must not be published
  it('submited artist must not be published', function(done) {
    const artist = new Artist({
      name: 'Bondy',
      location: {
        city: 'Bondy city'
      }
    });

    artist.save(() => {
      artist.published.should.equal(false);
      done();
    });
  });

  // Can be deleted
  it('can be deleted', function(done) {
    Artist.remove({ slug: 'boby' }, (err) => {
      if(err) {
        console.log(err);
      }

      done();
    });
  });
});