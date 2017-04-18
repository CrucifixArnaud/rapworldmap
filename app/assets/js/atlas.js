import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';
import L from 'mapbox.js';
import LeafletMarkercluster from 'leaflet.markercluster';
import {EventEmitter} from "events";

import ArtistPanel from './components/artistPanel';
import AtlasMenu from './components/atlasMenu';
import AtlasNotifications from './components/atlasNotifications';
import AtlasFooter from './components/atlasFooter';

import { getClosest } from './utils/utils';

const bus = new EventEmitter();

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
            'summary': 'Radric Delantic Davis (born February 12, 1980), known professionally as Gucci Mane, is an American rapper from Atlanta, Georgia.',
            'url': 'https://en.wikipedia.org/wiki/Gucci_Mane',
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

    let artistsPromise = new Promise(function(resolve, reject) {
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
        artistsTotal: res.features.length,
        geojson: res
      });
      this.createAtlas(res);
    });
  }

  createAtlas() {
    // Prepare loader destruction
    const loader = document.getElementById('loader');
    loader.addEventListener('transitionend', () => {
      loader.remove();
    });

    let initialLatLng = [];

    if(window.innerWidth < 768) {
      initialLatLng = [40, -75];
    }else{
      initialLatLng = [40, -45];
    }

    this.map = L.mapbox.map('map', 'mapbox.dark', {
      minZoom: 3.5,
      zoomControl: false
    }).setView(initialLatLng, 3.5);

    new L.Control.Zoom({ position: 'topright' }).addTo(this.map);

    let clusterGroup = new L.MarkerClusterGroup({
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

    for (let i = 0; i < this.state.geojson.features.length; i++) {
      let a = this.state.geojson.features[i];
      let artist = a.properties;
      let marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), {
        alt: artist.name
      });

      marker.addEventListener('click', () => {
        this.setState({
          artist: artist
        });
        this.refs.panel.open();
      });

      marker.addEventListener('mouseover', (e) => {
        let target = e.originalEvent.target;
        let parentWrapper = getClosest(target, '.leaflet-interactive');
        parentWrapper.classList.add('mouse-over');
      });

      marker.addEventListener('mouseout', (e) => {
        let target = e.originalEvent.target;
        let parentWrapper = getClosest(target, '.leaflet-interactive');
        parentWrapper.classList.remove('mouse-over');
      });

      // marker.setIcon(L.icon(a.properties.icon));
      marker.setIcon(L.divIcon({
        className: 'marker__icon',
        html: `<div class='${artist.icon.className}' style='width:${artist.icon.iconSize[0]}px; height:${artist.icon.iconSize[1]}px; margin-left:-${artist.icon.iconAnchor[0]}px; margin-top:-${artist.icon.iconAnchor[1]}px;'>
                <img class='marker__icon' src='${artist.icon.iconUrl}' />
                <span class='marker__title'>${artist.name}</span>
              </div>`
      }));
      clusterGroup.addLayer(marker);
    }

    this.map.addLayer(clusterGroup);

    L.mapbox.tileLayer('mapbox.dark')
    .addTo(this.map) // add your tiles to the map
    .on('load', () => {
      // Atlas is create hide loader
      loader.classList.remove('active');
    });
  }

  centerView(lat, lng, zoom = 10) {
    this.map.setView([lat, lng], zoom);
  }

  render() {
    return (
      <div>
        <AtlasNotifications bus={bus} />
        <AtlasMenu centerView={this.centerView.bind(this)} bus={bus} />
        <AtlasFooter artistsTotal={this.state.artistsTotal} />
        <div id='map' className='mapbox'></div>
        <ArtistPanel ref='panel' centerView={this.centerView.bind(this)} artist={this.state.artist} />
      </div>
    );
  }
}

ReactDOM.render(<Atlas />,
  document.getElementById('app')
);