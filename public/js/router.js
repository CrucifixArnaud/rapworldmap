import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// Layouts
import MainLayout from './layouts/main-layout';

// Pages
import ArtistsCreate from './pages/artistsCreate';

export default (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/artists/create" component={ArtistsCreate} />
    </Route>
  </Router>
);