import React from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';
import Modal from './shared/modal.js';
import moment from 'moment';

export default class AdvanceSubmitArtist extends React.Component {
  static propTypes = {
    bus: PropTypes.instanceOf(EventEmitter)
  }

  defaultState = {
    open: false,
    errors: [],
    name: '',
    city: '',
    bioUrl: '',
    clipExampleUrl: '',
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
  };

  constructor(props) {
    super(props);

    this.state = this.defaultState;

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

  open() {
    this.setState({
      open: true
    });

    this.refs.modalSubmit.toggleModal();
  }

  close() {
    this.setState({
      open: false,
    });
  }

  handleKeyDown(e) {
    if (e.keyCode === 27)
      this.refs.modalSubmit.toggleModal();
  }

  send() {
    // const artist = JSON.stringify({
    //   name: this.state.name,
    //   city: this.state.city,
    //   'bioUrl': this.state.bioUrl,
    //   'clipExampleUrl': this.state.clipExampleUrl
    // });

    let requestBody = JSON.stringify(this.state.artist);

    const artistsCreateUrl = window.location.href + 'artists/submit';

    const artistsPromise = new Promise((resolve, reject) => {
      fetch(artistsCreateUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: requestBody
      }).then((response) => {
        resolve(response.json());
      }).catch((error) => {
        console.log(error);
      });
    });

    artistsPromise.then((response) => {
      if (response.success !== undefined) {
        // Success
        if (typeof this.props.bus !== 'undefined') {
          this.props.bus.emit('add', {
            type: 'success',
            text: `${this.state.artist.name} has been successfully submited`
          });
        }


        // Empty Fields
        // this.refs.name.value = '';
        // this.refs.city.value = '';
        // this.refs.bioUrl.value = '';
        // this.refs.clipExampleUrl.value = '';

        // Clean Resets all states
        this.setState(this.defaultState);

        // Close submit modal
        this.close();
        this.refs.modalSubmit.closeModal()
      } else {

        let errors = response.error.detail;
        let newErrors = [];

        errors.map((error) => {
          newErrors.push(error);
        });

        this.setState({
          errors: newErrors
        }, () => {
          const firstError = document.getElementById('submit-error-' + newErrors[0].param);
          firstError.focus();
        });
      }
    });
  }

  render() {
    const errorName = this.state.errors.find(x => x.param === 'name');
    const errorCity = this.state.errors.find(x => x.param === 'location.city');

    return (
      <Modal ref="modalSubmit" ariaLabelledby="submitModalTitle" onCloseModal={this.close.bind(this)} className="modal--submit">
        <div className="search-panel__body">
          <h2 id="submitModalTitle" className="panel__title">Submit an artist</h2>

          <form ref="submitModalForm">
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
                  <label id="submit-error-location.city" htmlFor="city" className="field-error">{errorCity.msg}</label>
                }
              </div>
              <div className="field">
                <label htmlFor="neighborhoodName" className="field__label">Neighborhood Name <span className="field__label--optional">(optional)</span>:</label>
                <input id="neighborhoodName" type="text" name="neighborhoodName" value={this.state.artist.location.neighborhood || ''} onChange={this.handleArtistNeighborhoodChange} />
              </div>
              <div className="field">
                <label htmlFor="coordinates" className="field__label">Coordinates <span className="field__label--optional">(longitude, latitude) (optional)</span>:</label>
                <input id="coordinates" type="text" name="coordinates" value={this.state.artist.location.coordinates || ''} onChange={this.handleArtistCoordinatesChange} />
              </div>
            </div>

            <div className="field-group">
              <h3 className="field-group__title">Categories <span className="field__label--optional">(optional)</span>:</h3>
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
              <h3 className="field-group__title">Bio</h3>
              <div className="field">
                <label htmlFor="summary" className="field__label">Summary <span className="field__label--optional">(optional)</span>:</label>
                <textarea name="summary" rows="10" cols="50" value={this.state.artist.bio.summary || ''} onChange={this.handleArtistSummaryChange} />
              </div>
              <div className="field">
                <label htmlFor="bioUrl" className="field__label">Bio Url <span className="field__label--optional">(optional)</span>:</label>
                <input id="bioUrl" type="text" name="bioUrl" value={this.state.artist.bio.url || ''} onChange={this.handleArtistBioUrlChange} />
              </div>
              <div className="field field--inline">
                <label htmlFor="birthdate" className="field__label">Birthdate <span className="field__label--optional">(optional)</span>:</label>
                <input id="birthdate" type="date" name="birthdate" value={(this.state.artist.bio.birthdate ? moment(this.state.artist.bio.birthdate).format('YYYY-MM-DD') : '') || ''} onChange={this.handleArtistBirthdateChange} />
              </div>
              <div className="field field--inline">
                <label htmlFor="deathdate" className="field__label">Deathdate <span className="field__label--optional">(optional)</span>:</label>
                <input id="deathdate" type="date" name="deathdate" value={(this.state.artist.bio.deathdate ? moment(this.state.artist.bio.deathdate).format('YYYY-MM-DD') : '') || ''} onChange={this.handleArtistDeathdateChange} />
              </div>
              <div>
                <div className="field field--inline">
                  <label htmlFor="yearsActiveStart" className="field__label">Years Active Start <span className="field__label--optional">(optional)</span>:</label>
                  <input id="yearsActiveStart" type="number" min="1950" step="1" name="yearsActiveStart" value={this.state.artist.bio.yearsActiveStart || ''} onChange={this.handleArtistYearsActiveStartChange} />
                </div>
                <div className="field field--inline">
                  <label htmlFor="yearsActiveEnd" className="field__label">Years Active End <span className="field__label--optional">(optional)</span>:</label>
                  <input id="yearsActiveEnd" type="number" min="1950" step="1" name="yearsActiveEnd" value={this.state.artist.bio.yearsActiveEnd || ''} onChange={this.handleArtistYearsActiveEndChange} />
                </div>
              </div>
            </div>

            <div className="field-group">
              <h3 className="field-group__title">Youtube</h3>
              <div className="field--inline">
                <label htmlFor="clipExampleUrl" className="field__label">Clip Example Url <span className="field__label--optional">(optional)</span>:</label>
                <input id="clipExampleUrl" type="text" name="clipExampleUrl" value={this.state.artist.youtube.clipExampleUrl || ''} onChange={this.handleArtistClipExampleUrlChange} />
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <button onClick={() => this.send()} className="button--primary--md" tabIndex="0" type="button">Submit</button>
              </div>
            </div>
          </form>

          <button onClick={() => this.refs.modalSubmit.closeModal()} className="modal__link-close" aria-label="Close modal" title="Close modal" tabIndex="0">Close this modal</button>
        </div>
      </Modal>
    );
  }
}