import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';
import L from 'mapbox.js';
import LeafletMarkercluster from 'leaflet.markercluster';

export default class Atlas extends React.Component {
  constructor(props) {
    super(props);
  }

  createAtlas(geojson) {

    var map = L.mapbox.map('map', 'mapbox.dark', {
      minZoom: 3.5
    }).setView([36.3843749, -98.7628543], 3);

    L.mapbox.featureLayer().loadURL('/artists/geojson').on('ready', function(e) {
      // The clusterGroup gets each marker in the group added to it
      // once loaded, and then is added to the map
      var clusterGroup = new L.MarkerClusterGroup();
      e.target.eachLayer(function(layer) {

        var marker = layer,
          feature = marker.feature;

        marker.addEventListener('click', function() {
          // console.log(marker.feature);
          var panel = document.getElementById("panel");
          panel.classList.add('open');
        });

        marker.setIcon(L.icon(feature.properties.icon));

        var content = '<h2>'+ feature.properties.name+'<\/h2>' + '<img src="'+feature.properties.icon.iconUrl+'" alt="">';

        clusterGroup.addLayer(layer);
      });
      map.addLayer(clusterGroup);
    });
  }

  render() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3J1Y2lmaXhhcm5hdWQiLCJhIjoiY2lxejJocHB6MDA1dWkybWc1MnhyMWRoOCJ9.BcDRx2fZ0sl3q5ofSTbZ_g';

    const artistsGeojsonUrl = 'http://localhost:3666/artists/geojson';

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

    return (
      <div id='map' className='mapbox'></div>
    );
  }
}

ReactDOM.render(<Atlas />,
  document.getElementById('app')
);