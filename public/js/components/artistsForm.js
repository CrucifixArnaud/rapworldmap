import React from 'react';

import InputName from './inputName';

class InputCity extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      value: props.value
    };

    // Method
    this.handleChange = this.handleChange.bind(this);
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
          // console.error(error);
        }
      });
    }
  }

  /**
   * [render InputName]
   */
  render() {
    return(
      <div className="field">
        <label className="field__label" htmlFor="inputCity">City:</label>
        <input id="inputCity" type="text" name="city" value={this.state.value} onChange={this.handleChange} />
      </div>
    );
  }
}

export default class ArtistsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentArtist: {
        name: '',
        city: ''
      },
      action: props.action
    }
  }

  updateArtist(artist) {

    const birthdate = artist['life-span']['begin'];
    const deathdate = artist['life-span']['ended'];

    console.log("Update artists");

    this.setState({
      currentArtist: {
        name: artist.name,
        city: artist.area.name,
        birthdate: (birthdate ? birthdate : ''),
        deathdate: (deathdate ? deathdate : '')
      }
    });
  }

  render() {
    return (
      <form className="form-create" action={this.state.action} method="post">
        <div className="field-group">
          <InputName value={this.state.currentArtist.name} updateArtist={this.updateArtist.bind(this)}/>
        </div>
        <div className="field-group">
          <h3 className="field-group__title">Location</h3>
          <InputCity value={this.state.currentArtist.city} />
          <div className="field">
            <label className="field__label" htmlFor="inputNeighborhoodName">Neighborhood Name:</label>
            <input id="inputNeighborhoodName" type="text" name="neighborhoodName" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="coordinates">Coordinates:</label>
            <input id="coordinates" type="text" name="coordinates" />
          </div>
        </div>
        <div className="field-group">
          <h3 className="field-group__title">Categories:</h3>
          <div className="field--inline">
            <input type="checkbox" id="producer" name="categories" value="producer" />
            <label className="field__label" htmlFor="producer">Producer</label>
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
            <label className="field__label" htmlFor="thumbnailUrl">Thumbnail Url:</label>
            <input id="thumbnailUrl" type="text" name="thumbnailUrl" />
          </div>
        </div>
        <div className="field-group">
          <h3 className="field-group__title">Bio</h3>
          <div className="field">
            <label className="field__label" htmlFor="inputSummary">Summary:</label>
            <textarea id="inputSummary" name="summary">
            </textarea>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="inputWikipediaUrl">Wikipedia Url:</label>
            <input id="inputWikipediaUrl" type="text" name="wikipediaUrl" />
          </div>
          <div className="field--inline">
            <label className="field__label" htmlFor="inputBirthDate">Birthdate:</label>
            <input id="inputBirthDate" value={this.state.currentArtist.birthdate} type="date" name="birthdate" />
          </div>
          <div className="field--inline">
            <label className="field__label" htmlFor="inputDeathDate">Deathdate:</label>
            <input id="inputDeathDate" value={this.state.currentArtist.deathdate} type="date" name="deathdate" />
          </div>
        </div>
        <div className="field-group">
          <h3 className="field-group__title">Youtube</h3>
          <div className="field--inline">
            <label className="field__label" htmlFor="inputYoutubePageUrl">Page Url:</label>
            <input id="inputYoutubePageUrl" type="text" name="youtugePageUrl" />
          </div>
          <div className="field--inline">
            <label className="field__label" htmlFor="inputClipExampleUrl">Clip Example Url:</label>
            <input id="inputClipExampleUrl" type="text" name="clipExampleUrl" />
          </div>
        </div>
        <div className="field">
          <button className="button--primary--md" type="submit">
            Add artist
          </button>
        </div>
      </form>
    );
  }
}