// user.test.js
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
describe('Users Api', () => {
  it('should login a user an access artist admin/artists', (done) => {

      var agent = chai.request.agent(server)
      agent
        .post('/login')
        .type('form')
        .send({
          'email': process.env.TEST_USER_EMAIL,
          'password': process.env.TEST_USER_PWD
        })
        .end(function (err, res) {
          expect(res).to.have.cookie('session');
          expect(res).to.have.status(200);
          expect(res).to.redirect;
          expect(res).to.redirectTo(`${res.request.protocol}//${res.request.host}/admin/artists`);

          done();
        });
    });
});