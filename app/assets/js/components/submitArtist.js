import React from 'react';
import Request from 'request';
import {EventEmitter} from 'events';

export default class SubmitArtist extends React.Component {
  static propTypes = {
    bus: React.PropTypes.instanceOf(EventEmitter)
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

  send() {

    const artist = {
      'name': this.state.name,
      'city': this.state.city,
      'bioUrl': this.state.bioUrl,
      'clipExampleUrl': this.state.clipExampleUrl
    };

    const artistsCreateUrl = window.location.href + 'artists/submit';

    Request.post({url:artistsCreateUrl, form: artist}, (error, response) => {
      if (!error && response.statusCode === 200) {
        // Success
        if (typeof this.props.bus !== 'undefined') {
          this.props.bus.emit('add', {
            type: 'success',
            text: `${artist.name} has been successfully submited`
          });
        }

        // Close submit panel
        this.close();

        // Empty Fields
        this.refs.name.value = '';
        this.refs.city.value = '';
        this.refs.bioUrl.value = '';
        this.refs.clipExampleUrl.value = '';

        // Clean Resets all states
        this.setState(this.defaultState);

      } else {
        let errors = JSON.parse(response.body);
        let newErrors = [];

        errors.map((error) => {
          newErrors.push(error);
        });

        this.setState({
          errors: newErrors
        });
      }
    });
  }

  render() {

    const errorName = this.state.errors.find(x => x.param === 'name');
    const errorCity = this.state.errors.find(x => x.param === 'city');

    return (
      <form tabIndex="-1" ref="submitPanel" className={'submit-artist-panel ' + ((this.state.open) ? 'open' : '')}>
        <button type="button" tabIndex="0" onClick={() => this.close()} className="submit-artist-panel__button--close button--close" title="Close panel">&#10799;</button>
        <div className="submit-artist-panel__content">
          <h2 className="panel__title">Submit a new entry</h2>
          <div className="field-group">
            <div className="field">
              <label htmlFor="name" className="field__label">Name:</label>
              <input ref="name" id="name" type="text" name="name" tabIndex="0" onChange={this.handleNameChange} />
              {errorName &&
                <label htmlFor="name" className="field-error">{errorName.msg}</label>
              }
            </div>
            <div className="field">
              <label htmlFor="city" className="field__label">City:</label>
              <input ref="city" id="city" type="text" name="city" tabIndex="0" onChange={this.handleCityChange} />
              {errorCity &&
                <label htmlFor="name" className="field-error">{errorCity.msg}</label>
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
            <div className="field">
              <button onClick={() => this.send()} className="button--primary--md" tabIndex="0" type="button">Submit</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}