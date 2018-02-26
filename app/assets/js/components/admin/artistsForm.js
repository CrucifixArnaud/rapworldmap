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
      jwt: cookies.get('jwt')
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // handleError(errors) {

  //   error.map((error) => {
  //     console.log(error);
  //   });

  // }

  handleSubmit(e) {

    e.preventDefault();

    const artistsSubmitUrl = window.location.origin + '/artists/create';

    const formData = new FormData(this.refs.artistForm);

    const artistsSubmitPromise = new Promise( (resolve) => {
      fetch(artistsSubmitUrl, {
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

        this.setState({
          error: res.error
        });

        window.scrollTo(0, 0);

      } else {
        window.location = '/admin/artists';
      }
    });
  }

  render() {

    // Artists row
    let errors;

    if (this.state.error) {
      errors = this.state.error.detail.map((error, key) => {
        return (
          <li className="error" key={key}>
            <p>{error}</p>
          </li>
        );
      });
    }

    return (
      <div className="admin-content">

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
              <input id="name" type="text" name="name" />
            </div>
          </div>

          <div className="field-group">
            <h3 className="field-group__title">Location</h3>
            <div className="field">
              <label htmlFor="city" className="field__label">City:</label>
              <input id="city" type="text" name="city" />
            </div>
            <div className="field">
              <label htmlFor="neighborhoodName" className="field__label">Neighborhood Name:</label>
              <input id="neighborhoodName" type="text" name="neighborhoodName" />
            </div>
            <div className="field">
              <label htmlFor="coordinates" className="field__label">Coordinates:</label>
              <input id="coordinates" type="text" name="coordinates" />
            </div>
          </div>

          <div className="field-group">
            <h3 className="field-group__title">Categories:</h3>
            <div className="field--inline">
              <input type="checkbox" id="producer" name="categories" value="producer / dj" />
              <label className="field__label" htmlFor="producer">Producer / DJ</label>
            </div>
            <div className="field--inline">
              <input type="checkbox" id="rapper" name="categories" value="rapper" />
              <label className="field__label" htmlFor="rapper">Rapper</label>
            </div>
            <div className="field--inline">
              <input type="checkbox" id="singer" name="categories" value="singer" />
              <label className="field__label" htmlFor="singer">Singer</label>
            </div>
            <div className="field--inline">
              <input type="checkbox" id="group" name="categories" value="group" />
              <label className="field__label" htmlFor="group">Group</label>
            </div>
          </div>

          <div className="field-group">
            <h3 className="field-group__title">Images</h3>
            <div className="field">
              <label className="field__label" htmlFor="thumbnail">Thumbnail:</label>

              <input id="thumbnail" className="input--file" type="file" name="thumbnail" />
            </div>
          </div>

          <div className="field-group">
            <h3 className="field-group__title">Bio</h3>
            <div className="field">
              <label htmlFor="summary" className="field__label">Summary:</label>
              <textarea name="summary" rows="10" cols="50"></textarea>
            </div>
            <div className="field">
              <label htmlFor="bioUrl" className="field__label">Bio Url:</label>
              <input id="bioUrl" type="text" name="bioUrl" />
            </div>
            <div className="field field--inline">
              <label htmlFor="birthdate" className="field__label">Birthdate:</label>
              <input id="birthdate" type="date" name="birthdate" />
            </div>
            <div className="field field--inline">
              <label htmlFor="deathdate" className="field__label">Deathdate:</label>
              <input id="deathdate" type="date" name="deathdate" />
            </div>
            <div>
              <div className="field field--inline">
                <label htmlFor="yearsActiveStart" className="field__label">Years Active Start:</label>
                <input id="yearsActiveStart" type="number" min="1950" step="1" name="yearsActiveStart" />
              </div>
              <div className="field field--inline">
                <label htmlFor="yearsActiveEnd" className="field__label">Years Active End:</label>
                <input id="yearsActiveEnd" type="number" min="1950" step="1" name="yearsActiveEnd" />
              </div>
            </div>
          </div>

          <div className="field-group">
            <h3 className="field-group__title">Youtube</h3>
            <div className="field--inline">
              <label htmlFor="clipExampleUrl" className="field__label">Clip Example Url:</label>
              <input id="clipExampleUrl" type="text" name="clipExampleUrl" />
            </div>
          </div>

          <div className="field-groud">
            <h3 className="field-group__title">Published</h3>
            <div className="field--inline">
              <input type="radio" id="publishedYes" name="published" value="true" />
              <label className="field__label" htmlFor="publishedYes">Yes</label>
            </div>
            <div className="field--inline">
              <input type="radio" id="publishedNo" name="published" value="false" />
              <label className="field__label" htmlFor="publishedNo">No</label>
            </div>
          </div>

          <div className="field">
            <button className="button--primary--md" type="submit">Create</button>
          </div>

        </form>

      </div>
    );
  }
}