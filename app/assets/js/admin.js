import 'whatwg-fetch'

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Cookies from 'universal-cookie';

import Dropdown from './components/shared/dropdown';

/**
 * Admin
 */
export default class Admin extends React.Component {

  constructor(props) {
    super(props);
    const cookies = new Cookies();

    const savedFilters = cookies.get('filters');
    const filters = (savedFilters) ? savedFilters : {
      published: 'all',
      clip: 'all',
      category: 'all'
    };

    this.state = {
      artistsLoaded: false,
      artists: [],
      allArtist: [],
      filters: filters
    };

    this.filterArtists = this.filterArtists.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentWillMount() {
    this.getArtist();
  }

  getArtist() {
    const artistsUrl = window.location.origin + '/artists';

    const artistsPromise = new Promise(function(resolve) {
      fetch(artistsUrl).then( (response) => {
        resolve(response.json());
      }).catch( (error) => {
        console.log(error);
      });
    });

    artistsPromise.then((res) => {
      // Prepare loaderCell destruction
      const loaderCell = document.getElementById('loaderCell');

      loaderCell.remove();

      this.setState({
        artistsLoaded: true,
        allArtist: res,
        artistsTotal: res.length,
      }, () => {
        this.filterArtists();
      });

    });
  }

  filterArtists() {

    let filteredArtists  = [];

    // Published Filter
    let publishedArtistFilter;

    switch(this.state.filters.published) {
      case 'published': {
        publishedArtistFilter = this.state.allArtist.filter( function (artist) {
          return artist.published === true;
        });
        break;
      }
      case 'not-published': {
        publishedArtistFilter = this.state.allArtist.filter( function (artist) {
          return artist.published === false;
        });
        break;
      }
      default: {
        publishedArtistFilter = this.state.allArtist.filter( function (artist) {
          return artist.published === false || artist.published === true;
        });
        break;
      }
    }

    // Clip Filter
    let clipArtistFilter;

    switch(this.state.filters.clip) {
      case 'with-clip': {
        clipArtistFilter = publishedArtistFilter.filter( function (artist) {
          return artist.youtube.clipExampleUrl.length > 0;
        });
        break;
      }
      case 'without-clip': {
        clipArtistFilter = publishedArtistFilter.filter( function (artist) {
          return artist.youtube.clipExampleUrl.length === 0;
        });
        break;
      }
      default: {
        clipArtistFilter = publishedArtistFilter.filter( function (artist) {
          return artist.youtube.clipExampleUrl.length > 0 || artist.youtube.clipExampleUrl.length === 0;
        });
        break;
      }
    }

    // Category Filter
    let categoryArtistFilter;

    switch(this.state.filters.category) {
      case 'rapper': {
        categoryArtistFilter = clipArtistFilter.filter( function (artist) {
          return artist.categories.indexOf('rapper') > -1;
        });
        break;
      }
      case 'singer': {
        categoryArtistFilter = clipArtistFilter.filter( function (artist) {
          return artist.categories.indexOf('singer') > -1;
        });
        break;
      }
      case 'dj-producer': {
        categoryArtistFilter = clipArtistFilter.filter( function (artist) {
          return artist.categories.indexOf('dj / producer') > -1;
        });
        break;
      }
      case 'group': {
        categoryArtistFilter = clipArtistFilter.filter( function (artist) {
          return artist.categories.indexOf('group') > -1;
        });
        break;
      }
      default: {
        categoryArtistFilter = clipArtistFilter;
        break;
      }
    }

    // Apply filters
    filteredArtists = categoryArtistFilter;

    const mergedFilteredArtist = [].concat.apply([], filteredArtists);

    this.setState({
      artists: mergedFilteredArtist
    });

  }

  handleFilterChange(filter, value) {
    if (value !== this.state.filters[filter]) {

      const filters = Object.assign(this.state.filters, {
        [filter]: value
      });

      this.setState({
        filters: filters
      }, () => {
        const cookies = new Cookies();

        cookies.set('filters', filters, { path: '/' });
        this.filterArtists();
      });
    }
  }

  handleDeleteClick(slug) {
    const confirmation = confirm(`Are you sure you want to delete: ${slug}?`);

    if (confirmation === true) {
      const artistsDeleteUrl = window.location.origin + '/artists/' + slug + '/delete';

      Request(artistsDeleteUrl, (error, response) => {
        if (!error && response.statusCode === 200) {
          window.location.reload(false);
        } else {
          console.error(error);
        }
      });
    }
  }

  render() {

    // Artists row
    const artistsResult = this.state.artists.map((artist, step) => {
      // Artist Bio Url
      let artistBioUrl;
      if(artist.bio !== undefined) {
        if (artist.bio.url) {
          artistBioUrl = (
            <a href={artist.bio.url} title="View details (json)">{artist.name}</a>
          );
        } else {
          artistBioUrl = (
            <p>{artist.name}</p>
          );
        }
      } else {
        artistBioUrl = (
          <p>{artist.name}</p>
        );
      }

      // Artist Categories
      const artistCategories = artist.categories.map((category, index) =>
        <span key={artist._id + category}>{(index > 0 ? ', ' : null)}{category}</span>
      );

      return (
        <tr className='table__row' key={artist._id + step}>
          <td className='table__cell'>
            { artistBioUrl }
          </td>
          <td className="table__cell">
            {artist.location.city}
          </td>
          <td className="table__cell">
              {artistCategories}
          </td>
          <td className="table__cell">
            {artist.youtube.clipExampleUrl.length > 0 &&
              <a href={artist.youtube.clipExampleUrl}>Link</a>
            }
          </td>
          <td className="table__cell table__cell--publication-date">
            {moment(artist.createDate).format('MM/DD/YYYY HH:mm')}
          </td>
          <td className={artist.published !== true ? 'table__cell unpublished' : 'table__cell'}>
            {String(artist.published)}
          </td>
          <td className="table__cell table__cell--action">
            <a href={'/artists/' + artist.slug + '/edit'} className="button--primary">Edit</a>
            <a className="button--danger" onClick={() => this.handleDeleteClick(artist.slug)}>Delete</a>
          </td>
        </tr>
      );
    });

    return (
      <div className="admin-content">
        <a className='button--primary--md' href='/artists/create'>Create a new artist</a>

        <div className="filters-box">
          <h3 className="filters-box__title">Filters:</h3>
          <div className="field-group">
            <div className="field--inline">
              <Dropdown label={'Published ' + '(' + this.state.filters.published + ')'}>
                <ul className="dropdown__list">
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.published === 'all' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('published', 'all')}>All
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.published === 'published' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('published', 'published')}>Published
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.published === 'not-published' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('published', 'not-published')}>Not Published
                    </a>
                  </li>
                </ul>
              </Dropdown>
            </div>
            <div className="field--inline">
              <Dropdown label={'Clip ' + '(' + this.state.filters.clip + ')'}>
                <ul className="dropdown__list">
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.clip === 'all' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('clip', 'all')}>All
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.clip === 'with-clip' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('clip', 'with-clip')}>With clip
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.clip === 'without-clip' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('clip', 'without-clip')}>Without clip
                    </a>
                  </li>
                </ul>
              </Dropdown>
            </div>
            <div className="field--inline">
              <Dropdown label={'Category ' + '(' + this.state.filters.category + ')'}>
                <ul className="dropdown__list">
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.category === 'all' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('category', 'all')}>All
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.category === 'rapper' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('category', 'rapper')}>Rapper
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.category === 'singer' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('category', 'singer')}>Singer
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.category === 'dj-producer' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('category', 'dj-producer')}>Dj / Producder
                    </a>
                  </li>
                  <li className="dropdown__list__item">
                    <a className={'dropdown__item__link ' + (this.state.filters.category === 'group' ? 'active' : '')}
                      onClick={() => this.handleFilterChange('category', 'group')}>Group
                    </a>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        <table className='table table--artist'>
            <thead className='table__head'>
                <tr className='table__head__row'>
                    <th className='table__head__cell'>Name</th>
                    <th className='table__head__cell'>City</th>
                    <th className='table__head__cell'>Categorie(s)</th>
                    <th className='table__head__cell'>Clip</th>
                    <th className='table__head__cell table__head__cell--publication-date'>Creation Date</th>
                    <th className='table__head__cell'>Published</th>
                    <th></th>
                </tr>
            </thead>

            <tbody className='table__body'>

              <tr id="loaderCell" className="table__row">
                <td colSpan="7" className="table__cell--loader">
                  <div id="loader" className="loader active">
                    <div className="loader__spin"></div>
                  </div>
                </td>
              </tr>

              {this.state.artistsLoaded === true && this.state.artists.length > 0 &&
                artistsResult
              }

              {this.state.artistsLoaded === true && this.state.artists.length === 0 &&
                <tr className='table__row' >
                  <td className='table__cell' colSpan='7'>
                    <p>Selected filter doesn't return any result.</p>
                  </td>
                </tr>
              }

            </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<Admin />,
  document.getElementById('app')
);