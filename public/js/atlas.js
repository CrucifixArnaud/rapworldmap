import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';
import L from 'mapbox.js';
import LeafletMarkercluster from 'leaflet.markercluster';

import ArtistPanel from './components/artistPanel';

/**
 * Atlas
 */
export default class Atlas extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      artist: ''
    };
  }

  componentWillMount() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3J1Y2lmaXhhcm5hdWQiLCJhIjoiY2lxejJocHB6MDA1dWkybWc1MnhyMWRoOCJ9.BcDRx2fZ0sl3q5ofSTbZ_g';

    const artistsGeojsonUrl = window.location.href + 'artists/geojson';

    var artistsPromise = new Promise(function(resolve, reject) {
      // setTimeout(() => resolve(4), 2000);
      Request(artistsGeojsonUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          // Success
          resolve(JSON.parse(body));
        } else {
          console.error(error);
        }
      });
    });

    artistsPromise.then((res) => {
      this.createAtlas(res);
    });
  }

  createAtlas() {
    var self = this;

    var map = L.mapbox.map('map', 'mapbox.dark', {
      minZoom: 3.5,
      zoomControl: false
    }).setView([40, -45], 3);

    L.mapbox.featureLayer().loadURL('/artists/geojson').on('ready', function(e) {
      // The clusterGroup gets each marker in the group added to it
      // once loaded, and then is added to the map
      var clusterGroup = new L.MarkerClusterGroup({
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 40,
        polygonOptions: {
          fillColor: '#ff00666',
          color: '#ff0066',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
        }
      });
      e.target.eachLayer(function(layer) {

        var marker = layer,
          feature = marker.feature,
          artist = feature.properties;

        marker.addEventListener('click', function() {
          self.setState({
            artist: artist
          });
          self.refs.panel.open();
        });

        marker.setIcon(L.icon(feature.properties.icon));
        clusterGroup.addLayer(layer);
      });
      map.addLayer(clusterGroup);
    });
  }

  render() {
    return (
      <div>
        <div id='map' className='mapbox'></div>
        <ArtistPanel ref='panel' artist={this.state.artist} />
      </div>
    );
  }
}

ReactDOM.render(<Atlas />,
  document.getElementById('app')
);