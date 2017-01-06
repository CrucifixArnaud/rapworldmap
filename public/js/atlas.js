import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';
import L from 'mapbox.js';
import LeafletMarkercluster from 'leaflet.markercluster';

/**
 * Panel
 */
export class Panel extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      open: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  render() {

    if(this.props.artist) {

      var tagsList = this.props.artist.categories.map(function(category, key){
        return <li key={key} className='panel-artist__categories__item'>{category}</li>;
      });

      let artistBio;
      if (this.props.artist.bio.summary) {
        artistBio = (
          <p>{this.props.artist.bio.summary}</p>
        );
      }

      let artistWikipediaUrl;
      if (this.props.artist.bio.wikipediaUrl) {
        artistWikipediaUrl = (
          <a href={this.props.artist.bio.wikipediaUrl}>Wikipedia Page</a>
        );
      }

      let artistClipExample;
      if (this.props.artist.youtube.clipExampleUrl) {
        artistClipExample = (
          <iframe className="panel-artist__youtube__embed" src={this.props.artist.youtube.clipExampleUrl} frameBorder="0"></iframe>
        );
      }

      let artistYoutubePage;
      if (this.props.artist.youtube.pageUrl) {
        artistYoutubePage = (
          <a href={this.props.artist.youtube.pageUrl}>Youtube Channel</a>
        );
      }

      return (
        <div id="panel" className={'panel ' + ((this.state.open) ? 'open' : '')}>
          <a onClick={() => this.close()} className="panel-button--close" title="Close panel">&#10799;</a>
          <h2 className="panel-artist__name">{this.props.artist.name}</h2>
          <ul className="panel-artist__categories">
            {tagsList}
          </ul>
          <img className="panel-artist__thumbnail" src={this.props.artist.image.thumbnailUrl} />
          <div className="panel-artist__bio">
            { artistBio }
            { artistWikipediaUrl }
          </div>
          <div className="panel-artist__youtube">
            { artistClipExample }
            { artistYoutubePage }
          </div>
        </div>
      );

    } else {
      return null;
    }
  }

}

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
  }

  createAtlas() {
    var self = this;

    var map = L.mapbox.map('map', 'mapbox.dark', {
      minZoom: 3.5
    }).setView([36.3843749, -98.7628543], 3);

    L.mapbox.featureLayer().loadURL('/artists/geojson').on('ready', function(e) {
      // The clusterGroup gets each marker in the group added to it
      // once loaded, and then is added to the map
      var clusterGroup = new L.MarkerClusterGroup();
      e.target.eachLayer(function(layer) {

        var marker = layer,
          feature = marker.feature,
          artist = feature.properties;

        marker.addEventListener('click', function() {
          // var panel = document.getElementById('panel');
          // panel.classList.add('open');

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
        <Panel ref='panel' artist={this.state.artist} />
      </div>
    );
  }
}

ReactDOM.render(<Atlas />,
  document.getElementById('app')
);