import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';
import moment from 'moment';

/**
 * Admin
 */
export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artists: [],
      allArtist: [],
      filters: {
        isPublished: true,
        isNotPublished: true
      }
    };

    this.filterArtists = this.filterArtists.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    const artistsUrl = window.location.origin + '/artists';

    let artistsPromise = new Promise(function(resolve) {
      Request(artistsUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          // Success
          resolve(JSON.parse(body));
        } else {
          console.error(error);
        }
      });
    });

    artistsPromise.then((res) => {
      // Prepare loaderCell destruction
      const loaderCell = document.getElementById('loaderCell');

      loaderCell.remove();

      this.setState({
        artists: res,
        allArtist: res,
        artistsTotal: res.length,
      });

    });
  }

  filterArtists() {

    let filteredArtist = [];

    if (this.state.filters.isPublished === true) {
      const publishedArtist = this.state.allArtist.filter( function (artist) {
        return artist.published === true;
      });

      filteredArtist.push(publishedArtist);
    }

    if (this.state.filters.isNotPublished === true) {
      const notPublishedArtist = this.state.allArtist.filter( function (artist) {
        return artist.published === false;
      });

      filteredArtist.push(notPublishedArtist);
    }

    const mergedFilteredArtist = [].concat.apply([], filteredArtist);

    this.setState({
      artists: mergedFilteredArtist
    });

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const dataFilter = target.dataset.filter;

    const filters = Object.assign(this.state.filters, {
      [dataFilter]: value
    });

    this.setState({
      [name]: value,
      filters: filters
    }, () => {
      this.filterArtists();
    });

  }

  render() {

    // Artists row
    const artistsResult = this.state.artists.map((artist) => {
      // Artist Bio Url
      let artistBioUrl;
      if (artist.bio.url) {
        artistBioUrl = (
          <a href={artist.bio.url} title="View details (json)">{artist.name}</a>
        );
      } else {
        artistBioUrl = (
          <p>{artist.name}</p>
        );
      }

      // Artist Categories
      const artistCategories = artist.categories.map((category, step) =>
        <span key={artist._id+step}>{category}&nbsp;</span>
      );

      return (
        <tr className='table__row' key={artist._id}>
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
            <a href={'/artists/' + artist.slug + '/delete'} className="button--danger">Delete</a>
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
              <input
                id="filterIsPublished"
                type="checkbox"
                name="filterIsPublished"
                value={this.state.filters.isPublished}
                defaultChecked={this.state.filters.isPublished}
                data-filter="isPublished"
                onChange={this.handleInputChange} />
                <label className="field__label" htmlFor="filterIsPublished">Published</label>
            </div>
            <div className="field--inline">
              <input
                id="filterIsNotPublished"
                type="checkbox"
                name="filterIsNotPublished"
                value={this.state.filters.isNotPublished}
                defaultChecked={this.state.filters.isNotPublished}
                data-filter="isNotPublished"
                onChange={this.handleInputChange} />
                <label className="field__label" htmlFor="filterIsNotPublished">Not Published</label>
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

              {this.state.artists.length > 0 &&
                artistsResult
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