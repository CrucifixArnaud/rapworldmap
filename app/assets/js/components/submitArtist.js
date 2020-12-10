import React from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';
import AdvanceSubmitArtist from './advancedSubmitArtist.js';

export default class SubmitArtist extends React.Component {
  static propTypes = {
    bus: PropTypes.instanceOf(EventEmitter)
  }

  defaultState = {
    open: false,
    errors: [],
    name: '',
    city: '',
    bioUrl: '',
    clipExampleUrl: ''
  };

  constructor(props) {
    super(props);

    this.state = this.defaultState;

    this.send = this.send.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleClipChange = this.handleClipChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleAdvanceSubmitClick = this.handleAdvanceSubmitClick.bind(this);
  }

  open() {
    this.setState({
      open: true
    }, () => {

      // Focus on submitPanel on submitPanel visibility transition end
      this.refs.submitPanel.addEventListener('transitionend', (event) => {
        if(event.propertyName === 'visibility') {
          this.refs.submitPanel.focus();
        }
      });

    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  handleNameChange(e) {
    this.setState({name: e.target.value});
  }

  handleCityChange(e) {
    this.setState({city: e.target.value});
  }

  handleBioChange(e) {
    this.setState({bioUrl: e.target.value});
  }

  handleClipChange(e) {
    this.setState({clipExampleUrl: e.target.value});
  }

  handleAdvanceSubmitClick() {
    this.toggleAdvanceSubmit();
  }

  send() {
    const artist = {
      name: this.state.name,
      location: {
        city: this.state.city
      },
      bio: {
        url: this.state.bioUrl
      },
      youtube: {
        clipExampleUrl: this.state.clipExampleUrl
      }
    };

    const artistsCreateUrl = window.location.href + 'artists/submit';

    const artistsPromise = new Promise((resolve, reject) => {
      fetch(artistsCreateUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artist)
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
            text: `${this.state.name} has been successfully submited`
          });
        }

        // Empty Fields
        this.refs.name.value = '';
        this.refs.city.value = '';
        this.refs.bioUrl.value = '';
        this.refs.clipExampleUrl.value = '';

        // Close submit panel
        this.close();

        // Clean Resets all states
        this.setState(this.defaultState);

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

  handleKeyDown(e) {
    if (e.keyCode === 27)
      this.close();
  }

  toggleAdvanceSubmit() {
    if(this.refs.advanceSubmitArtist.state.open === false) {
      this.refs.advanceSubmitArtist.open();
      this.close();
    }else{
      this.refs.advanceSubmitArtist.close();
    }
  }

  render() {

    const errorName = this.state.errors.find(x => x.param === 'name');
    const errorCity = this.state.errors.find(x => x.param === 'location.city');

    return (
      <div>
        <form onKeyDown={(e) => this.handleKeyDown(e)} tabIndex="-1" ref="submitPanel" className={'submit-artist-panel ' + ((this.state.open) ? 'open' : '')}>
          <button type="button" tabIndex="0" onClick={() => this.close()} className="submit-artist-panel__button--close button--close" aria-label="Close panel" title="Close panel">&#10799;</button>
          <div className="submit-artist-panel__content">
            <h2 className="panel__title">Submit a new entry</h2>
            <div className="field-group">
              <div className="field">
                <label htmlFor="name" className="field__label">Name:</label>
                <input ref="name" id="name" type="text" name="name" tabIndex="0" onChange={this.handleNameChange} />
                {errorName &&
                  <label id="submit-error-name" htmlFor="name" className="field-error">{errorName.msg}</label>
                }
              </div>
              <div className="field">
                <label htmlFor="city" className="field__label">City:</label>
                <input ref="city" id="city" type="text" name="city" tabIndex="0" onChange={this.handleCityChange} />
                {errorCity &&
                  <label id="submit-error-location.city" htmlFor="city" className="field-error">{errorCity.msg}</label>
                }
              </div>
              <div className="field">
                <label htmlFor="bioUrl" className="field__label">Biography Url <span className="field__label--optional">(optional)</span>:</label>
                <input ref="bioUrl" id="bioUrl" type="text" name="bioUrl" tabIndex="0" onChange={this.handleBioChange} />
              </div>
              <div className="field">
                <label htmlFor="clipExampleUrl" className="field__label">Clip Example Url <span className="field__label--optional">(optional)</span>:</label>
                <input ref="clipExampleUrl" id="clipExampleUrl" type="text" tabIndex="0" name="clipExampleUrl" onChange={this.handleClipChange} />
              </div>
            </div>
            <div className="field-group">
              <button type="button" className="button--link--large" onClick={(e) => this.handleAdvanceSubmitClick(e)} title="Open a more complete form to submit a new entry">Want to add more info?</button>
            </div>
            <div className="field-group">
              <div className="field">
                <button onClick={() => this.send()} className="button--primary--md" tabIndex="0" type="button">Submit</button>
              </div>
            </div>
          </div>
        </form>

        <AdvanceSubmitArtist bus={this.props.bus} addNotification={this.props.addNotification} ref="advanceSubmitArtist" />
      </div>
    );
  }
}