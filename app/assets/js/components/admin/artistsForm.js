import 'whatwg-fetch'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Cookies from 'universal-cookie';

/**
 * Admin
 */
export default class ArtistsForm extends React.Component {

  constructor(props) {
    super(props);
    const cookies = new Cookies();

    this.state = {
      jwt: cookies.get('jwt'),
      errors: [],
      artist: {
        'name': '',
        'youtube': {
          'clipExampleUrl': ''
        },
        'bio': {
          'summary': '',
          'url': '',
          'birthdate': '',
          'deathdate': '',
          'yearsActiveStart': '',
          'yearsActiveEnd': ''
        },
        'image': {
          'thumbnailUrl': ''
        },
        'categories': [],
        'location': {
          'city': '',
          'coordinates': '',
          'neighborhood': ''
        },
        published: false
      },
      submitLabel: 'Create'
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleArtistNameChange = this.handleArtistNameChange.bind(this);
    this.handleArtistCityChange = this.handleArtistCityChange.bind(this);
    this.handleArtistNeighborhoodChange = this.handleArtistNeighborhoodChange.bind(this);
    this.handleArtistCoordinatesChange = this.handleArtistCoordinatesChange.bind(this);
    this.handleArtistCategoriesChange = this.handleArtistCategoriesChange.bind(this);
    this.handleArtistSummaryChange = this.handleArtistSummaryChange.bind(this);
    this.handleArtistBioUrlChange = this.handleArtistBioUrlChange.bind(this);
    this.handleArtistBirthdateChange = this.handleArtistBirthdateChange.bind(this);
    this.handleArtistDeathdateChange = this.handleArtistDeathdateChange.bind(this);
    this.handleArtistYearsActiveStartChange = this.handleArtistYearsActiveStartChange.bind(this);
    this.handleArtistYearsActiveEndChange = this.handleArtistYearsActiveEndChange.bind(this);
    this.handleArtistClipExampleUrlChange = this.handleArtistClipExampleUrlChange.bind(this);
    this.handleArtistPublishedChange = this.handleArtistPublishedChange.bind(this);
  }

  componentDidMount() {
    // If a slug is present (edit)
    if (this.props.match.params.slug) {

      // Get the artist data (base on slug)
      const getArtistUrl = window.location.origin + '/artists/' + this.props.match.params.slug;

      const getArtistPromise = new Promise( (resolve) => {
        fetch(getArtistUrl, {
          method: 'GET'
        }).then( (response) => {
          resolve(response.json());
        }).catch( (error) => {
          console.log(error);
        });
      });

      getArtistPromise.then((res) => {

        if (res.error) {

          this.setState({
            artistNotFound: res.error
          });

        } else {
          this.setState({
            'artist': res,
            'artistsSubmitUrl': window.location.origin + '/artists/' + this.props.match.params.slug,
            'submitLabel': `Edit ${res.name}`
          });
        }
      });
    } else {
      this.setState({
        'artistsSubmitUrl': window.location.origin + '/artists/create'
      });
    }
  }

  handleArtistNameChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.name = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistCityChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.location.city = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistNeighborhoodChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.location.neighborhood = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistCoordinatesChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.location.coordinates = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistCategoriesChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;

    if (this.state.artist.categories.includes(value)) {
      const index = this.state.artist.categories.indexOf(value);
      artist.categories.splice(index, 1);
    } else {
      artist.categories.push(value);
    }

    this.setState({
      'artist': artist
    });
  }

  handleArtistSummaryChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.bio.summary = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistBioUrlChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.bio.url = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistBirthdateChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.bio.birthdate = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistDeathdateChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.bio.deathdate = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistYearsActiveStartChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.bio.yearsActiveStart = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistYearsActiveEndChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.bio.yearsActiveEnd = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistClipExampleUrlChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;
    artist.youtube.clipExampleUrl = value ;

    this.setState({
      'artist': artist
    });
  }

  handleArtistPublishedChange(e) {
    const value = e.target.value;
    const artist = this.state.artist;

    if (this.state.artist.published === false) {
      artist.published = true;
    } else {
      artist.published = false;
    }

    this.setState({
      'artist': artist
    });
  }

  handleSubmit(e) {

    e.preventDefault();
    const formData = new FormData(this.refs.artistForm);

    const artistsSubmitPromise = new Promise( (resolve) => {
      fetch(this.state.artistsSubmitUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer '+ this.state.jwt
        }
      }).then( (response) => {
        resolve(response.json());
      }).catch( (error) => {
        console.log(error);
      });
    });

    artistsSubmitPromise.then((res) => {

      if (res.error) {
        let errors = res.error.detail;
        let newErrors = [];

        errors.map((error) => {
          newErrors.push(error);
        });

        this.setState({
          errors: newErrors
        }, () => {
          window.scrollTo(0, 0);
          const firstError = document.getElementById(newErrors[0].param);
          firstError.focus();
        });


      } else {
        window.location = '/admin/artists';
      }
    });
  }

  render() {

    const errorName = this.state.errors.find(x => x.param === 'name');
    const errorCity = this.state.errors.find(x => x.param === 'city');
    const errorThumbnail = this.state.errors.find(x => x.param === 'thumbnail');

    return (
      <div className="admin-content">

        {this.state.artistNotFound ? (

          <div className="errors-container">
            <h2 className="error__title">{this.state.artistNotFound.title}</h2>
            <div className="error__content">
              {this.state.artistNotFound.detail}
              <p>Go back to the <a href="/admin/artists">artists list</a>.</p>
            </div>
          </div>

        ) : (

          <div>
            {this.state.error &&

              <div className="errors">
                <p>{this.state.error.title} </p>
                <ul>
                  {errors}
                </ul>
              </div>
            }

            <a href="/admin/artists" className="link--back-to">&larr; Back to artist list</a>

            <form ref="artistForm" className="form" onSubmit={this.handleSubmit} encType="multipart/form-data" method="POST">

              <div className="field-group">
                <h3 className="field-group__title">About</h3>
                <div className="field">
                  <label htmlFor="name" className="field__label">Name:</label>
                  <input id="name" type="text" name="name" value={this.state.artist.name || ''} onChange={this.handleArtistNameChange} />
                  {errorName &&
                    <label id="submit-error-name" htmlFor="name" className="field-error">{errorName.msg}</label>
                  }
                </div>
              </div>

              <div className="field-group">
                <h3 className="field-group__title">Location</h3>
                <div className="field">
                  <label htmlFor="city" className="field__label">City:</label>
                  <input id="city" type="text" name="city" value={this.state.artist.location.city || ''} onChange={this.handleArtistCityChange} />
                  {errorCity &&
                    <label id="submit-error-city" htmlFor="city" className="field-error">{errorCity.msg}</label>
                  }
                </div>
                <div className="field">
                  <label htmlFor="neighborhoodName" className="field__label">Neighborhood Name:</label>
                  <input id="neighborhoodName" type="text" name="neighborhoodName" value={this.state.artist.location.neighborhood || ''} onChange={this.handleArtistNeighborhoodChange} />
                </div>
                <div className="field">
                  <label htmlFor="coordinates" className="field__label">Coordinates:</label>
                  <input id="coordinates" type="text" name="coordinates" value={this.state.artist.location.coordinates || ''} onChange={this.handleArtistCoordinatesChange} />
                </div>
              </div>

              <div className="field-group">
                <h3 className="field-group__title">Categories:</h3>
                <div className="field--inline">
                  <input type="checkbox" id="producer" name="categories" value="producer / dj" checked={this.state.artist.categories.includes('producer / dj')} onChange={this.handleArtistCategoriesChange} />
                  <label className="field__label" htmlFor="producer">Producer / DJ</label>
                </div>
                <div className="field--inline">
                  <input type="checkbox" id="rapper" name="categories" value="rapper" checked={this.state.artist.categories.includes('rapper')} onChange={this.handleArtistCategoriesChange} />
                  <label className="field__label" htmlFor="rapper">Rapper</label>
                </div>
                <div className="field--inline">
                  <input type="checkbox" id="singer" name="categories" value="singer" checked={this.state.artist.categories.includes('singer')} onChange={this.handleArtistCategoriesChange} />
                  <label className="field__label" htmlFor="singer">Singer</label>
                </div>
                <div className="field--inline">
                  <input type="checkbox" id="group" name="categories" value="group" checked={this.state.artist.categories.includes('group')} onChange={this.handleArtistCategoriesChange}/>
                  <label className="field__label" htmlFor="group">Group</label>
                </div>
              </div>

              <div className="field-group">
                <h3 className="field-group__title">Images</h3>
                <div className="field">
                  <label className="field__label" htmlFor="thumbnail">Thumbnail:</label>

                  {this.state.artist.image.thumbnailUrl &&
                    <div>
                      <div className="thumbnail field__thumbnail">
                        <img className="thumbnail__picture" src={'/uploads/medium-' + this.state.artist.image.thumbnailUrl} alt="" />
                      </div>
                    </div>
                  }

                  <input id="thumbnail" className="input--file" type="file" name="thumbnail" />

                  {errorThumbnail &&
                    <label id="submit-error-thumbnail" htmlFor="thumbnail" className="field-error">{errorThumbnail.msg}</label>
                  }
                </div>
              </div>

              <div className="field-group">
                <h3 className="field-group__title">Bio</h3>
                <div className="field">
                  <label htmlFor="summary" className="field__label">Summary:</label>
                  <textarea name="summary" rows="10" cols="50" value={this.state.artist.bio.summary || ''} onChange={this.handleArtistSummaryChange} />
                </div>
                <div className="field">
                  <label htmlFor="bioUrl" className="field__label">Bio Url:</label>
                  <input id="bioUrl" type="text" name="bioUrl" value={this.state.artist.bio.url || ''} onChange={this.handleArtistBioUrlChange} />
                </div>
                <div className="field field--inline">
                  <label htmlFor="birthdate" className="field__label">Birthdate:</label>
                  <input id="birthdate" type="date" name="birthdate" value={(this.state.artist.bio.birthdate ? moment(this.state.artist.bio.birthdate).format('YYYY-MM-DD') : '') || ''} onChange={this.handleArtistBirthdateChange} />
                </div>
                <div className="field field--inline">
                  <label htmlFor="deathdate" className="field__label">Deathdate:</label>
                  <input id="deathdate" type="date" name="deathdate" value={(this.state.artist.bio.deathdate ? moment(this.state.artist.bio.deathdate).format('YYYY-MM-DD') : '') || ''} onChange={this.handleArtistDeathdateChange} />
                </div>
                <div>
                  <div className="field field--inline">
                    <label htmlFor="yearsActiveStart" className="field__label">Years Active Start:</label>
                    <input id="yearsActiveStart" type="number" min="1950" step="1" name="yearsActiveStart" value={this.state.artist.bio.yearsActiveStart || ''} onChange={this.handleArtistYearsActiveStartChange} />
                  </div>
                  <div className="field field--inline">
                    <label htmlFor="yearsActiveEnd" className="field__label">Years Active End:</label>
                    <input id="yearsActiveEnd" type="number" min="1950" step="1" name="yearsActiveEnd" value={this.state.artist.bio.yearsActiveEnd || ''} onChange={this.handleArtistYearsActiveEndChange} />
                  </div>
                </div>
              </div>

              <div className="field-group">
                <h3 className="field-group__title">Youtube</h3>
                <div className="field--inline">
                  <label htmlFor="clipExampleUrl" className="field__label">Clip Example Url:</label>
                  <input id="clipExampleUrl" type="text" name="clipExampleUrl" value={this.state.artist.youtube.clipExampleUrl || ''} onChange={this.handleArtistClipExampleUrlChange} />
                </div>
              </div>

              <div className="field-groud">
                <h3 className="field-group__title">Published</h3>
                <div className="field--inline">
                  <input type="radio" id="publishedYes" name="published" value="true" checked={this.state.artist.published} onChange={this.handleArtistPublishedChange} />
                  <label className="field__label" htmlFor="publishedYes">Yes</label>
                </div>
                <div className="field--inline">
                  <input type="radio" id="publishedNo" name="published" value="false" checked={!this.state.artist.published} onChange={this.handleArtistPublishedChange} />
                  <label className="field__label" htmlFor="publishedNo">No</label>
                </div>
              </div>

              <div className="field">
                <button className="button--primary--md" type="submit">{this.state.submitLabel}</button>
              </div>

            </form>
          </div>

        )}

      </div>
    );
  }
}