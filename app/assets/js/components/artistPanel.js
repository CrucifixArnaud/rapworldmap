import React from 'react';
import ClickOutHandler from 'react-onclickout';

export default class ArtistPanel extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
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

  open() {
    this.setState({
      open: true
    });

    if (this.props.artist.youtube.clipExampleUrl) {
      setTimeout(() => {
        this.setState({
          youtubeClip: true
        });
      }, 750);
    }
  }

  close() {
    this.setState({
      open: false
    });

    if (this.props.artist.youtube.clipExampleUrl) {
      this.setState({
        youtubeClip: false
      });
    }
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
    const coordinates = JSON.parse( '[' + this.props.artist.location.coordinates + ']');
    const lng = coordinates.slice(0, coordinates.indexOf(',')).toString();
    const lat = coordinates.slice(coordinates.indexOf(','), coordinates.length).toString();
    this.props.centerView(lat, lng, 13);
  }

  render() {

    if(this.props.artist) {
      const tagsList = this.props.artist.categories.map(function(category, key) {
        return <li key={key} className='artist-panel__categories__item'>{category}</li>;
      });

      let artistBio;
      if (this.props.artist.bio.summary) {
        artistBio = (
          <p>{this.props.artist.bio.summary}</p>
        );
      }

      let artistBioUrl;
      if (this.props.artist.bio.url) {
        artistBioUrl = (
          <a className="artist-panel__readmore" title="Read more on an external website" href={this.props.artist.bio.url}>Read more about {this.props.artist.name}</a>
        );
      }

      let artistLocationNeighborhood;
      if (this.props.artist.location.neighborhood) {
        artistLocationNeighborhood = (
          <span className="artist-panel__location__neighborhood">{this.props.artist.location.neighborhood} - </span>
        );
      }

      let artistLocationCountry;
      if (this.props.artist.location.country) {
        artistLocationCountry = (
          <span className="artist-panel__location__country">({this.props.artist.location.country})</span>
        );
      }

      let artistYearsActive;
      if (this.props.artist.bio.yearsActiveStart) {
        artistYearsActive = (
          <span className="artist-panel__yearsactive">(Years active: {this.props.artist.bio.yearsActiveStart} {(this.props.artist.bio.yearsActiveEnd) ? ' - ' + this.props.artist.bio.yearsActiveEnd : '- present'})</span>
        );
      }

      return (
        <ClickOutHandler ref="panelHandler" onClickOut={this.clickOutside}>
          <div className={'artist-panel ' + ((this.state.open) ? 'open' : '') + ' ' + ((this.state.reduce) ? 'reduce' : '')}>
            <a onClick={() => this.close()} className="artist-panel__button--close button--close" title="Close panel">&#10799;</a>
            <div className="artist-panel__thumbnail">
              <img className="artist-panel__thumbnail__picture" src={'/uploads/medium-' + this.props.artist.image.thumbnailUrl} />
            </div>
            <div className="artist-panel__body">
              <h2 className="artist-panel__name">{this.props.artist.name}</h2>
              <div className="artist-panel__location">
                { artistLocationNeighborhood }
                <a onClick={() => this.handleClickOnCity()} className="artist-panel__location__city">{this.props.artist.location.city} </a>
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
                <iframe className="artist-panel__youtube__embed" src={this.props.artist.youtube.clipExampleUrl} frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
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