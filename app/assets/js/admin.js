import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'request';

/**
 * Admin
 */
export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: {}
    };
  }

  componentWillMount() {
    const artistsUrl = window.location.href + 'artists/geojson';

    let artistsPromise = new Promise(function(resolve, reject) {
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
        artists: res.artists,
        artistsTotal: res.artists.length,
      });
      this.createAtlas(res);
    });
  }

  render() {
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

            <tbody className='table__body'>

            </tbody>
        </table>
      </div>
    );
  }
}

ReactDOM.render(<Admin />,
  document.getElementById('app')
);