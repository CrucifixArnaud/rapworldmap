// atlas.controller.js
//==============================================

//====== Define depencies ======

//====== Export method ======
module.exports = {
  showAtlas: showAtlas
};

//====== Methods ======

/**
 * [showAtlas Show the atlas]
 */
function showAtlas (req, res) {
  const locals = {
    slug: 'page-atlas',
    title: 'An Atlas of World Rap',
    description: 'Discover rap artists from all around the world.',
    mapboxToken: process.env.MAPBOXTOKEN
  };
  res.render('pages/atlas/atlas', locals);
}