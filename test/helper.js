const mongoose = require('mongoose');
const Artist = require('../app/modules/artists/artist.model');

// Replace default mongoose promise by native es6 promise
mongoose.Promise = global.Promise;

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
  mongoose.connection.close();
});