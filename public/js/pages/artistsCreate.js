import React from 'react';

import ArtistsForm from '../components/artistsForm';

export default class ArtistsCreate extends React.Component {
  render() {
    return (
      <ArtistsForm action="/artists/create" />
    );
  }
}