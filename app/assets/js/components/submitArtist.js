import React from 'react';
import Request from 'request';
import {EventEmitter} from 'events';

export default class SubmitArtist extends React.Component {
  static propTypes = {
    bus: React.PropTypes.instanceOf(EventEmitter)
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      errors: []
    };

    this.send = this.send.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleClipChange = this.handleClipChange.bind(this);
  }

  open() {
    this.setState({
      open: true
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

  handleClipChange(e) {
    this.setState({clipExampleUrl: e.target.value});
  }

  send() {
    var artist = {
      'name': this.state.name,
      'city': this.state.city,
      'clipExampleUrl': this.state.clipExampleUrl,
      'type': 'submission'
    };

    const artistsCreateUrl = window.location.href + 'artists/create';

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
        this.refs.clipExampleUrl.value = '';

        this.setState({
          name: '',
          city: '',
          clipExampleUrl: ''
        });

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
      <form className={'submit-artist-panel ' + ((this.state.open) ? 'open' : '')} action="" encType="multipart/form-data" method="POST">
        <a onClick={() => this.close()} className="submit-artist-panel__button--close button--close" title="Close panel">&#10799;</a>
        <div className="submit-artist-panel__content">
          <h2 className="panel__title">Submit a new entry</h2>
          <div className="field-group">
            <div className="field">
              <label htmlFor="name" className="field__label">Name:</label>
              <input ref="name" id="name" type="text" name="name" onChange={this.handleNameChange} />
              {errorName &&
                <label htmlFor="name" className="field-error">{errorName.msg}</label>
              }
            </div>
            <div className="field">
              <label htmlFor="city" className="field__label">City:</label>
              <input ref="city" id="city" type="text" name="city" onChange={this.handleCityChange} />
              {errorCity &&
                <label htmlFor="name" className="field-error">{errorCity.msg}</label>
              }
            </div>
            <div className="field">
              <label htmlFor="clipExampleUrl" className="field__label">Clip Example Url:</label>
              <input ref="clipExampleUrl" id="clipExampleUrl" type="text" name="clipExampleUrl" onChange={this.handleClipChange} />
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <button onClick={() => this.send()} className="button--primary--md" type="button">Submit</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}