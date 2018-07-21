// error.test.js
//==============================================

//====== Define dependencies ======
require('dotenv').config();

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  should = chai.should(),
  expect = chai.expect,
  server = require('../rapworldmap'),
  helper = require('./helper');

//====== Specific configuration  ======
chai.use(chaiHttp);

//====== Tests for User Api ======
describe('Errors Controllers', () => {

  describe('/bobby-la-pointe', () => {
    it('should return a 404', (done) => {

      chai.request(server)
        .get('/bobby-la-pointe')
        .end((err,res) => {
          expect(res).to.have.status(404);
          expect(res).to.be.html;
          done();
        });
    });
  });

  describe('/500', () => {
    it('should return a 500', (done) => {

      chai.request(server)
        .get('/500')
        .end((err,res) => {
          expect(res).to.have.status(500);
          expect(res).to.be.html;
          done();
        });
    });
  });
});