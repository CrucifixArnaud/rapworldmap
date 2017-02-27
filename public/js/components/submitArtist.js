import React from 'react';
import Request from 'request';

export default class SubmitArtist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
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
    const self = this;

    var artist = {
      'name': this.state.name,
      'city': this.state.city,
      'clipExampleUrl': this.state.clipExampleUrl
    };

    const artistsCreateUrl = window.location.href + 'artists/create';

    Request.post({url:artistsCreateUrl, form: artist}, function(error, response) {
      if (!error && response.statusCode === 200) {
        // Success
        console.log(artist.name + ' has been submited. Thank you!');
        // Close submit panel
        self.close();

        // Empty Fields
        self.refs.name.value = '';
        self.refs.city.value = '';
        self.refs.clipExampleUrl.value = '';
      } else {
        console.error(error);
      }
    });
  }

  render() {
    return (
      <form className={'submit-artist-panel ' + ((this.state.open) ? 'open' : '')} action="" encType="multipart/form-data" method="POST">
        <a onClick={() => this.close()} className="submit-artist-panel__button--close button--close" title="Close panel">&#10799;</a>
        <div className="submit-artist-panel__content">
          <h2 className="panel__title">Submit a new entry</h2>
          <div className="field-group">
            <div className="field">
              <label htmlFor="name" className="field__label">Name:</label>
              <input ref="name" id="name" type="text" name="name" onChange={this.handleNameChange} />
            </div>
            <div className="field">
              <label htmlFor="city" className="field__label">City:</label>
              <input ref="city" id="city" type="text" name="city" onChange={this.handleCityChange} />
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
        <svg className="submit-artist-panel__background" height="100%" width="100%"><path d="M 15 0 14 17.3 0 295 560 310 573 9z" style={{fill:'#1b2b34'}} /></svg>
      </form>
    );
  }
}