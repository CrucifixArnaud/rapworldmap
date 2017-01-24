// artists.controller.js
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
    title: 'Atlas'
  };
  res.render('pages/atlas/atlas', locals);
}