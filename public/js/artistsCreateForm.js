import React from 'react';

import InputName from './inputName';

export default class ArtistsCreateForm extends React.Component {
  constructor() {
    super();
    this.state = {
      currentArtist: {
        name: '',
        city: '',
        thumbnailUrl: ''
      }
    }
  }

  updateArtist(artist) {

    const birthdate = artist['life-span']['begin'];
    const deathdate = artist['life-span']['ended'];

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
      <form className="form-create" action="/artists/create" method="post">
        <div className="field-group">
          <InputName value={this.state.currentArtist.name} updateArtist={this.updateArtist.bind(this)}/>
        </div>
        <div className="field-group">
          <h3 className="field-group__title">Location</h3>
          <div className="field">
            <label className="field__label" htmlFor="inputCity">City:</label>
            <input id="inputCity" type="text" name="city" value={this.state.currentArtist.city} />
          </div>
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
        </div>
        <div className="field-group">
          <h3 className="field-group__title">Images</h3>
          <div className="field">
            <label className="field__label" htmlFor="thumbnailUrl">Thumbnail Url:</label>
            <input id="thumbnailUrl" type="text" name="thumbnailUrl" value={this.state.currentArtist.thumbnailUrl}/>
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
          <button className="button" type="submit">
            Add artist
          </button>
        </div>
      </form>
    );
  }
}