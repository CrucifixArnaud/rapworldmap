// artists.test.js
//==============================================

//====== Define dependencies ======
require('dotenv').config();

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  should = chai.should(),
  expect = chai.expect,
  server = require('../rapworldmap'),
  helper = require('./helper'),
  Artist = require('../app/modules/artists/artist.model');

//====== Specific configuration  ======
chai.use(chaiHttp);

//====== Tests for Artist model ======
describe('Artists Model', () => {

  beforeEach(function(done) {

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
describe('Artists Api', () => {

  describe('/artists GET', () => {

    it('it should GET all artists', (done) => {
      chai.request(server)
        .get('/artists')
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).length.to.be.above(1);
          done();
        });
    });
  });

  describe('/artists/index GET', () => {

    it('it should GET the all artists index', (done) => {
      chai.request(server)
        .get('/artists/index')
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          res.body.index.should.be.a('object');
          var indexSize = Object.keys(res.body.index).length;
          indexSize.should.be.eql(res.body.data.length);
          expect(res.body.data).to.be.a('array');
          expect(res.body.data).length.to.be.above(1);
          done();
        });
    });
  });

  describe('/artists/download GET', () => {

    it('it should download a JSON file', (done) => {
      chai.request(server)
        .get('/artists/download')
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });

  describe('/artists/geojson GET', () => {

    it('it should GET all artists formated has geojson', (done) => {
      chai.request(server)
        .get('/artists/geojson')
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.type).to.be.eql('FeatureCollection');
          expect(res.body.features).to.be.a('array');
          expect(res.body.features).length.to.be.above(1);
          done();
        });
    });
  });

  describe('/admin/artists/create GET', () => {

    it('user should GET authenticate to access the artist page creation', (done) => {
      chai.request(server)
        .get('/admin/artists/create')
        .end((err,res) => {
          expect(res).to.redirect;
          expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/`);
          done();
        });
    });
  });

  describe('/artists/:slug GET', () => {

    it('it should GET a single artist (eg. gucci-mane)', (done) => {
      chai.request(server)
        .get('/artists/gucci-mane')
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.slug).to.be.eql('gucci-mane');
          done();
        });
    });
  });

  describe('/artists/create POST', () => {

    it('user should GET authenticate to post a new artist', function(done) {
      chai.request(server)
        .post('/artists/create')
        .field('name', 'Boby')
        .field('city', 'Bobby Ville')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('it should save a new artist', function(done) {
      chai.request(server)
        .post('/artists/create')
        .auth(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PWD)
        .field('name', 'Boby')
        .field('city', 'Bobby Ville')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('it should not be save whitout name and city', function(done) {
      chai.request(server)
        .post('/artists/create')
        .auth(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PWD)
        .end((err, res) => {
          expect(err).to.not.be.empty;
          expect(res).to.have.property('error');
          expect(res).to.have.status(400);
          done();
        });
    });

  });

  describe('/artists/:slug/edit GET (eg. gucci-mane)', () => {

    it('user should GET authenticate to access the edit artist page', (done) => {
      chai.request(server)
        .get('/admin/artists/gucci-mane/edit')
        .end((err,res) => {
          expect(res).to.redirect;
          expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/`);
          done();
        });
    });

    it('it should GET the edit artist page', (done) => {
      chai.request(server)
        .get('/admin/artists/gucci-mane/edit')
        .auth(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PWD)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    });
  });

  describe('/artists/:slug POST', () => {

    it('user should GET authenticate to edit an artist', function(done) {
      chai.request(server)
        .post('/artists/gucci-mane')
        .field('name', 'Boby')
        .field('city', 'Bobby Ville')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('it should edit the existing artist (eg. gucci-mane)', function(done) {
      chai.request(server)
        .post('/artists/gucci-mane')
        .auth(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PWD)
        .field('name', 'Gucci-mane')
        .field('city', 'Atlanta')
        .field('neighborhoodName', 'Atlanta East')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });

  describe('/artists/:slug/delete GET (eg. bobby-la-pointe)', () => {

    beforeEach( (done) => {

      const artist = new Artist({
        name: 'Bobby La Pointe',
        location: {
          city: 'Pézenas',
          coordinates: '23, 23',
          neighborhood: 'Rue de la gitare tsigane'
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

    it('user should GET authenticate to delete an artist', (done) => {
      chai.request(server)
        .post('/artists/gucci-mane/delete')
        .end((err,res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('it should delete the artist', (done) => {
      chai.request(server)
        .post('/artists/bobby-la-pointe/delete')
        .auth(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PWD)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });

  describe('/artists/submit POST', () => {

    it('it should submit a new artist', (done) => {
      chai.request(server)
        .post('/artists/submit')
        .type('form')
        .send({name: 'Boby'})
        .send({bio: {
          url: ''
        }})
        .send({youtube: {
          clipExampleUrl: ''
        }})
        .send({location: {
            city: 'Bobby Ville'
        }})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });

    it('it should not submit whitout name and city', (done) => {
      chai.request(server)
        .post('/artists/submit')
        .end((err, res) => {
          expect(err).to.not.be.empty;
          expect(res).to.have.property('error');
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});