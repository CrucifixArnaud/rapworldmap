import React from 'react';

export default class ArtistPanel extends React.Component {
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
          <a className="artist-panel__readmore" href={this.props.artist.bio.wikipediaUrl}>Read more on Wikipedia</a>
        );
      }

      let artistClipExample;
      if (this.props.artist.youtube.clipExampleUrl) {
        artistClipExample = (
          <div className="artist-panel__youtube">
            <iframe className="artist-panel__youtube__embed" src={this.props.artist.youtube.clipExampleUrl} frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
            <svg className="artist-panel__youtube__background" height="182px" width="340px">
              <path d="M-0.000,4.000 L9.000,182.000 L330.000,172.000 L340.000,0.000 L-0.000,4.000 Z" style={{fill:'#ffd700'}} />
            </svg>
          </div>
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

      return (
        <div id="panel" className={'artist-panel ' + ((this.state.open) ? 'open' : '')}>
          <a onClick={() => this.close()} className="artist-panel__button--close" title="Close panel">&#10799;</a>
          <div className="artist-panel__thumbnail">
            <img className="artist-panel__thumbnail__picture" src={this.props.artist.image.thumbnailUrl} />
          </div>
          <div className="artist-panel__body">
            <h2 className="artist-panel__name">{this.props.artist.name}</h2>
            <div className="artist-panel__location">
              { artistLocationNeighborhood }
              <span className="artist-panel__location__city">{this.props.artist.location.city} </span>
              { artistLocationCountry }
            </div>
            <ul className="artist-panel__categories">
              {tagsList}
            </ul>
            <div className="artist-panel__bio">
              <div>
                { artistBio }
                { artistWikipediaUrl }
              </div>
            </div>
            { artistClipExample }
          </div>
          <svg className="artist-panel__background" height="100%" width="100%">
            <path d="M16.000,14.000 L0.000,300.000 L603.000,295.000 L596.000,-0.000 L16.000,14.000 Z" style={{fill:'#1b2b34'}} />
          </svg>
        </div>
      );

    } else {
      return (
        <div id="panel" className={'artist-panel'}>
        </div>
      );
    }
  }
}