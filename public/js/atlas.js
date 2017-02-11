import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';
import L from 'mapbox.js';
import LeafletMarkercluster from 'leaflet.markercluster';

import ArtistPanel from './components/artistPanel';
import AtlasMenu from './components/atlasMenu';

/**
 * Atlas
 */
export default class Atlas extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      artist: {
        'name': 'Gucci Mane',
        'youtube': [
          {
            'clipExampleUrl': 'https://www.youtube.com/embed/r4n8s6PVzl8'
          }
        ],
        'bio': [
          {
            'summary': 'Radric Delantic Davis (born February 12, 1980),[1][2] known professionally as Gucci Mane, is an American rapper from Atlanta, Georgia.',
            'wikipediaUrl': 'https://en.wikipedia.org/wiki/Gucci_Mane',
            'birthdate': null,
            'deathdate': null
          }
        ],
        'image': {
          'thumbnailUrl': '1484925966101-guccimane.jpg'
        },
        'categories': [
          'rapper'
        ],
        'location': [
          {
            'city': 'Atlanta',
            'coordinates': '-84.34546, 33.74001',
            'neighborhood': ''
          }
        ]
      }
    };

    this.map = '';
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

    this.map = L.mapbox.map('map', 'mapbox.dark', {
      minZoom: 3.5,
      zoomControl: false
    }).setView([40, -45], 3);

    L.mapbox.featureLayer().loadURL('/artists/geojson').on('ready', function(e) {
      // The clusterGroup gets each marker in the group added to it
      // once loaded, and then is added to the map
      var clusterGroup = new L.MarkerClusterGroup({
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 45,
        polygonOptions: {
          fillColor: 'transparent',
          color: '#8f399a',
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
      self.map.addLayer(clusterGroup);
    });

  }

  centerView(lat, lng, zoom = 10) {
    this.map.setView([lat, lng], zoom);
  }

  render() {
    return (
      <div>
        <AtlasMenu centerView={this.centerView.bind(this)} />
        <div id='map' className='mapbox'></div>
        <ArtistPanel ref='panel' centerView={this.centerView.bind(this)} artist={this.state.artist} />
      </div>
    );
  }
}

ReactDOM.render(<Atlas />,
  document.getElementById('app')
);