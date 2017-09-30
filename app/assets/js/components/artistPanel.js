import React from 'react';
import ClickOutHandler from 'react-onclickout';

export default class ArtistPanel extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      artist: this.props.artist,
      open: false,
      reduce: false,
      youtubeClip: false
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.reduce = this.reduce.bind(this);
    this.clickOutside = this.clickOutside.bind(this);
    this.handleClickOnCity = this.handleClickOnCity.bind(this);
  }

  updateArtist(artist) {
    this.setState({
      artist: artist
    }, () => {
      this.open();
    });

  }

  open() {
    this.setState({
      open: true
    }, () => {

      this.refs.panelArtist.addEventListener('transitionend', () => {
        if(event.propertyName === 'visibility') {
          this.refs.panelArtist.focus();
        }
      });

      if (this.state.artist.youtube.clipExampleUrl) {
        setTimeout(() => {
          this.setState({
            youtubeClip: true
          });
        }, 750);
      }
    });

  }

  close() {
    this.setState({
      open: false
    }, () => {
      if (this.state.artist.youtube.clipExampleUrl) {
        this.setState({
          youtubeClip: false
        });
      }
    });

  }

  reduce() {
    this.setState({
      reduce: true
    });
  }

  clickOutside(e) {
    function hasClass(elem, className) {
      return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    }

    let target = e.target;

    if(this.state.open && !hasClass(target, 'marker')) {
      this.reduce();
    }
  }

  handleClickOnCity() {
    const coordinates = JSON.parse( '[' + this.state.artist.location.coordinates + ']');
    const lng = coordinates.slice(0, coordinates.indexOf(',')).toString();
    const lat = coordinates.slice(coordinates.indexOf(','), coordinates.length).toString();
    this.props.centerView(lat, lng, 13);
  }

  render() {

    if(this.state.artist) {
      const tagsList = this.state.artist.categories.map(function(category, key) {
        return <li key={key} className='artist-panel__categories__item'>{category}</li>;
      });

      let artistBio;
      if (this.state.artist.bio.summary) {
        artistBio = (
          <p>{this.state.artist.bio.summary}</p>
        );
      }

      let artistBioUrl;
      if (this.state.artist.bio.url) {
        artistBioUrl = (
          <a tabIndex="0" className="artist-panel__readmore" title="Read more on an external website" href={this.state.artist.bio.url}>Read more about {this.state.artist.name}</a>
        );
      }

      let artistLocationNeighborhood;
      if (this.state.artist.location.neighborhood) {
        artistLocationNeighborhood = (
          <span className="artist-panel__location__neighborhood">{this.state.artist.location.neighborhood} - </span>
        );
      }

      let artistLocationCountry;
      if (this.state.artist.location.country) {
        artistLocationCountry = (
          <span className="artist-panel__location__country">({this.state.artist.location.country})</span>
        );
      }

      let artistYearsActive;
      if (this.state.artist.bio.yearsActiveStart) {
        artistYearsActive = (
          <span className="artist-panel__yearsactive">(Years active: {this.state.artist.bio.yearsActiveStart} {(this.state.artist.bio.yearsActiveEnd) ? ' - ' + this.state.artist.bio.yearsActiveEnd : '- present'})</span>
        );
      }

      return (
        <ClickOutHandler ref="panelHandler" onClickOut={this.clickOutside}>
          <div tabIndex="-1" ref="panelArtist" className={'artist-panel ' + ((this.state.open) ? 'open' : '') + ' ' + ((this.state.reduce) ? 'reduce' : '')}>
            <button type="button" onClick={() => this.close()} className="artist-panel__button--close button--close" title="Close panel">&#10799;</button>
            <div className="thumbnail artist-panel__thumbnail">
              <img className="thumbnail__picture" src={'/uploads/medium-' + this.state.artist.image.thumbnailUrl} />
            </div>
            <div className="artist-panel__body">
              <h2 className="artist-panel__name">{this.state.artist.name}</h2>
              <div className="artist-panel__location">
                { artistLocationNeighborhood }
                <a onClick={() => this.handleClickOnCity()} className="artist-panel__location__city">{this.state.artist.location.city} </a>
                { artistLocationCountry }
              </div>
              { artistYearsActive }
              <ul className="artist-panel__categories">
                {tagsList}
              </ul>
              <div className="artist-panel__bio">
                <div>
                  { artistBio }
                  { artistBioUrl }
                </div>
              </div>
            </div>
            {this.state.youtubeClip &&
              <div className={'artist-panel__youtube' + ((this.state.youtubeClip) ? ' open' : '')}>
                <iframe className="artist-panel__youtube__embed" src={this.state.artist.youtube.clipExampleUrl} frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
                <svg className="artist-panel__youtube__background" height="182px" width="340px">
                  <path d="M-0.000,4.000 L9.000,182.000 L330.000,172.000 L340.000,0.000 L-0.000,4.000 Z" style={{fill:'#ffd700'}} />
                </svg>
              </div>
            }
          </div>
        </ClickOutHandler>
      );
    }
  }
}