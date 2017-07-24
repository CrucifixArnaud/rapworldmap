// admin.controller.js
//==============================================

//====== Define depencies ======
const Artist = require('../artists/artist.model'),
  moment = require('moment');

//====== Export method ======
module.exports = {
  showArtists: showArtists
};

//====== Methods ======

/**
 * [showArtists Show a list of all artists]
 */
function showArtists (req, res) {
  Artist.find({}, (err, artists) => {

    var publishedArtists = artists.filter(function(item) {
      if(item.published === true) {
        return item;
      }
    });

    const locals = {
      artists: artists,
      moment: moment,
      success: req.flash('success'),
      layout: 'admin',
      title: 'All artists (' + publishedArtists.length + ' / ' + artists.length + ')',
      slug: 'page-admin'
    };

    if(err) {
      res.status(404);
      res.send('Artists not found!');
    }

    res.render('pages/admin/artists', locals);
  });
}