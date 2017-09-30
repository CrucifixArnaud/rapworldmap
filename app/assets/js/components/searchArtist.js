import React from 'react';
import Request from 'request';
import lunr from 'lunr';

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
    Request.get({url:artistsJsonUrl}, (error, response) => {
      if (!error && response.statusCode === 200) {

        const artists = JSON.parse(response.body);

        const artistsIndex = lunr(function () {
          this.ref('slug');
          this.field('name');
          this.field('city');
          this.field('neighborhood');
          this.field('thumbnail');

          artists.data.forEach(function (doc) {
            this.add(doc);
          }, this);
        });

        this.setState({
          artists: artists,
          artistsIndex: artistsIndex
        });

      } else {
        console.error(error);
      }
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
      if(searchText.length > 3) {
        this.search();
      }
    });

  }

  search() {
    const textToSearch = this.state.search;
    // Use lunr search to search into the artist index load on component init
    const searchRef = this.state.artistsIndex.search(textToSearch);

    // Define the search result array
    let searchResults = [];

    // For each search reference found
    searchRef.map((object, step) => {
      // Return the associated key using the artist.slug
      const artistKey = this.state.artists.index[object.ref];
      // Use the artist key to return the correct related artist
      const artist = this.state.artists.data[artistKey];
      // Push it to the search result array
      searchResults.push(artist);
    });

    this.setState({
      searchResults: searchResults
    });
  }

  render() {

    // Artists list
    const artistsResult = this.state.searchResults.map((artist, step) => {
      return (
        <li className="search-result__item" key={step}>
          <button type="button" className="search-result__item__link" tabIndex="0" onClick={() => this.handleClickOnArtist(artist)}>
            <div className="thumbnail--small search-result__item__thumbnail">
              <img src={'/uploads/medium-' + artist.thumbnail} alt="" />
            </div>
            <p>{artist.name} <span className="search-result__item__location">({artist.city})</span></p>
          </button>
        </li>
      );
    });

    return (
      <div ref="modalSearch" className={'modal ' + ((this.state.open) ? 'open' : '')}>
        <button type="button" onClick={() => this.close()} className="button--close about-panel__button--close" title="Close panel" tabIndex="0">&#10799;</button>
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
          <button onClick={() => this.close()} className="link-close" title="Close panel" tabIndex="0">Close this modal</button>
        </div>
      </div>
    );
  }
}