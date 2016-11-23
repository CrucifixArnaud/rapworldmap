import React from 'react';
import ReactDOM from 'react-dom'

import Request from 'request';

// Artist
// Item add as suggestion when typing inside input name
//==============================================
class Artist extends React.Component {
  // handleClick Handle click event on artist
  handleClick(event) {
    event.preventDefault();
    this.props.updateArtist(this.props.artist);

    this.props.resetArtists();
  }

  // Render artist
  render() {
    return (
      <li key={this.props.step}>
        <a className="artist" href="#" onClick={(event) => this.handleClick(event)}>
        {this.props.artist.name} ({this.props.artist.disambiguation}) {(this.props.artist.area) ? <span className="city">({this.props.artist.area.name})</span> : ''}
        </a>
      </li>
    );
  }
}

// InputName
//==============================================
export default class InputName extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      artists: [],
      value: props.value
    }

    // Method
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }


  // Update state on props change
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  /**
   * [handleChange Handle input change]
   */
  handleChange(event) {
    const that = this;


    this.setState({
      value: event.target.value
    });

    const name = event.target.value;
    const nameLenght = name.length;

    // Only call predictive search if user type 3 or more character
    if (nameLenght >= 3) {

      var url = 'http://musicbrainz.org/ws/2/artist?query="' + name + '"AND comment:rapper&fmt=json';

      Request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {

          // Success
          const res = JSON.parse(body);

          const artists = [];

          if(res.artists.length > 0) {
            for (let i = res.artists.length - 1; i >= 0; i--) {

              artists.push(res.artists[i]);

              that.setState({
                artists: artists
              });
            }
          }
        } else {
          console.error(error);
        }
      })
    }
  }

  /**
   * [handleBlur Handle input blur]
   */
  handleBlur(event) {
    if(event.relatedTarget !== null) {
      if(!event.relatedTarget.classList.contains("artist")) {
        this.resetArtists();
      }
    }else{
      this.resetArtists();
    }
  }

  resetArtists() {
    this.setState({
      artists: []
    });
  }

  /**
   * [render InputName]
   */
  render() {

    let inputName = null;

    // Artists list
    const artists = this.state.artists.map((artist, step) => {
      return (
        <Artist key={step} artist={artist} resetArtists={this.resetArtists.bind(this)} updateArtist={this.props.updateArtist.bind(this)} />
      );
    });

    // Input
    return (
      <div>
        <h3 className="field-group__title">About</h3>
        <div className="field">
          <label className="field__label" htmlFor="inputName">Name:</label>
          <input ref="inputName" id="inputName" type="text" name="name" onChange={this.handleChange} onBlur={this.handleBlur} value={this.state.value} />
          <ul>{artists}</ul>
        </div>
      </div>
    );
  }
}