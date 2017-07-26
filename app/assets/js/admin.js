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
      artists: []
    };
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
      this.setState({
        artists: res,
        artistsTotal: res.length,
      });
    });
  }

  render() {


    // Artists row
    const artistsResult = this.state.artists.map((artist, step) => {
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

            {this.state.artists.length > 0 &&
              <tbody className='table__body'>
                {artistsResult}
              </tbody>
            }
        </table>
      </div>
    );
  }
}

ReactDOM.render(<Admin />,
  document.getElementById('app')
);