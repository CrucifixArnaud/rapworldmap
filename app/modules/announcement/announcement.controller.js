// announcement.controller.js
//==============================================

//====== Define depencies ======

//====== Export method ======
module.exports = {
  showBlackLivesMatter: showBlackLivesMatter,
};

//====== Methods ======

/**
 * [showBlackLivesMatter Display Black live mater page]
 */
function showBlackLivesMatter (req, res) {
  const locals = {
    slug: 'page-errors',
    title: 'Black Lives Matter',
    description: ''
  };
  res.status(503).render('pages/announcement/blacklivesmatter.ejs', locals);
}