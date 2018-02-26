import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import ArtistsList from './components/admin/artistsList';
import ArtistsForm from './components/admin/artistsForm';

const Admin = () => (
  <Router>
    <div>
      <Route exact path="/admin/artists" component={ArtistsList} />
      <Route exact path="/admin/artists/create" component={ArtistsForm} />
    </div>
  </Router>
)
export default Admin;

ReactDOM.render(<Admin />,
  document.getElementById('app')
);