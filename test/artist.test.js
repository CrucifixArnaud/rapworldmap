// artists.test.js
//==============================================

//====== Define dependencies ======
require('dotenv').config();

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  should = chai.should(),
  expect = chai.expect(),
  server = require('../rapworldmap'),
  helper = require('./helper.js'),
  Artist = require('../app/modules/artists/artist.model');

//====== Specific configuration  ======
chai.use(chaiHttp);

//====== Tests for Artist model ======
describe('Artists Model', function(){

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
      err.should.exist;
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
      err.should.exist;
      done();
    });
  });

  // Can be retrieves by slug
  it('can be retrieves by slug', function(done) {
    Artist.findOne({ slug: 'boby' }, (err, artist) => {
      if(err) {
        console.log(err);
      }

      artist.slug.should.equal('boby');
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

  // Submited artist should not be published
  it('submited artist should not be published', function(done) {
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
});

//====== Tests for Artist Api ======
describe('Artists Api', function(){

  const artistsCreateUrl = '/artists/create';

  // Can be save
  it(`can be save (${artistsCreateUrl}, POST)`, function(done) {

    chai.request(server)
      .post(artistsCreateUrl)
      .auth(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PWD)
      .field('name', 'Boby')
      .field('city', 'Bobby Ville')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});