import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';
import L from 'mapbox.js';
import LeafletMarkercluster from 'leaflet.markercluster';
import {EventEmitter} from "events";

import ArtistPanel from './components/artistPanel';
import AtlasMenu from './components/atlasMenu';
import AtlasNotifications from './components/atlasNotifications';

var bus = new EventEmitter();

/**
 * Atlas
 */
export default class Atlas extends React.Component {
  static propTypes = {
    bus: React.PropTypes.instanceOf(EventEmitter)
  }

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
            'summary': 'Radric Delantic Davis (born February 12, 1980), known professionally as Gucci Mane, is an American rapper from Atlanta, Georgia.',
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
      },
      artistsTotal: 0
    };

    this.map = '';
  }

  componentWillMount() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3J1Y2lmaXhhcm5hdWQiLCJhIjoiY2lxejJocHB6MDA1dWkybWc1MnhyMWRoOCJ9.BcDRx2fZ0sl3q5ofSTbZ_g';

    const artistsGeojsonUrl = window.location.href + 'artists/geojson';

    var artistsPromise = new Promise(function(resolve, reject) {
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
      this.setState({
        artistsTotal: res.features.length
      })
      this.createAtlas(res);
    });
  }

  // componentDidMount() {
  //   if (typeof bus !== "undefined") {
  //     bus.emit("results", true)
  //   }
  // }

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
        <AtlasNotifications bus={bus} />
        <AtlasMenu artistsTotal={this.state.artistsTotal} centerView={this.centerView.bind(this)} bus={bus} />
        <div id='map' className='mapbox'></div>
        <ArtistPanel ref='panel' centerView={this.centerView.bind(this)} artist={this.state.artist} />
      </div>
    );
  }
}

ReactDOM.render(<Atlas />,
  document.getElementById('app')
);