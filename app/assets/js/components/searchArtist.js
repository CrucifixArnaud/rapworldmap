import React from 'react';

export default class SearchArtist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      search: '',
      artists: [],
      searchResults: []
    };

    this.search = this.search.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleClickOnArtist = this.handleClickOnArtist.bind(this);

    const artistsJsonUrl = window.location.href + 'artists/index';

    const artistsPromise = new Promise((resolve, reject) => {
      fetch(artistsJsonUrl).then((response) => {
        resolve(response.json());
      }).catch((error) => {
        console.log(error);
      });
    });

    artistsPromise.then((response) => {
      const artists = response;

      this.setState({
        artists: artists
      });
    });
  }

  open() {
    this.setState({
      open: true
    });

    // Focus on searchTermsInput on modalSearch visibility transition end
    this.refs.modalSearch.addEventListener('transitionend', (event) => {
      if(event.propertyName === 'visibility') {
        this.refs.searchTermsInput.focus();
      }
    });
  }

  close() {
    this.setState({
      open: false,
      search: '',
      searchResults: []
    });

    // Clean Resets input value
    this.refs.searchTermsInput.value = '';
  }

  handleClickOnArtist(artist) {
    this.props.showArtist(artist);
    this.close();
  }

  handleSearchChange(e) {
    const searchText = e.target.value;
    this.setState({search: e.target.value}, function() {
      if(searchText.length >= 3) {
        this.search();
      }
    });

  }

  search() {
    const textToSearch = this.state.search.toLowerCase();

    // Define the search result array
    let searchResults = [];

      const prop = (typeof prop === 'undefined') ? 'name' : prop;

      const artists = this.state.artists.data;

      for (var i=0; i < artists.length; i++) {
        if (artists[i]['name'].toLowerCase().indexOf(textToSearch) !== -1 ) {
          searchResults.push(artists[i]);
        }

        if (artists[i]['city'].toLowerCase().indexOf(textToSearch) !== -1 ) {
          searchResults.push(artists[i]);
        }

        if (artists[i]['neighborhood'].toLowerCase().indexOf(textToSearch) !== -1 ) {
          searchResults.push(artists[i]);
        }
      }

    this.setState({
      searchResults: searchResults
    });

  }

  handleKeyDown(e) {
    if (e.keyCode === 27)
      this.close();
  }

  render() {

    // Artists list
    const artistsResult = this.state.searchResults.map((artist, step) => {
      return (
        <li className="search-result__item" key={step}>
          <button aria-label={artist.name +', click to view ' + artist.name + ' detail.' }  type="button" className="search-result__item__link" tabIndex="0" onClick={() => this.handleClickOnArtist(artist)}>
            <div className="thumbnail--small search-result__item__thumbnail">
              <img src={'/uploads/medium-' + artist.thumbnail} alt="" />
            </div>
            <p>{artist.name} <span className="search-result__item__location">({artist.city})</span></p>
          </button>
        </li>
      );
    });

    return (
      <div onKeyDown={(e) => this.handleKeyDown(e)} ref="modalSearch" className={'modal ' + ((this.state.open) ? 'open' : '')}>
        <button type="button" onClick={() => this.close()} className="button--close about-panel__button--close" aria-label="Close panel" title="Close panel" tabIndex="0">&#10799;</button>
        <div className="search-panel__body">
          <h2 className="panel__title">Search an artist</h2>
          <div className="field field--search">
            <label htmlFor="searchTermsInput" className="field__label">Enter your search <span className="field__label--optional">(Name, City, Neighborhood)</span>:</label>
            <input ref="searchTermsInput" id="searchTermsInput" type="text" name="searchTermsInput" className="field--search__input" onChange={this.handleSearchChange} />
            <button onClick={() => this.search()} className="button--primary field--search__button" type="button" tabIndex="-1">Search</button>
          </div>

          {this.state.searchResults.length > 0 &&
            <ul className="search-result">{artistsResult}</ul>
          }
          <button onClick={() => this.close()} className="link-close" aria-label="Close panel" title="Close panel" tabIndex="0">Close this modal</button>
        </div>
      </div>
    );
  }
}