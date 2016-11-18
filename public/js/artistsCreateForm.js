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
      <div>
        <form action="/artists/create" method="post">
          <div id="inputNameField" className="field">
            <InputName value={this.state.currentArtist.name} updateArtist={this.updateArtist.bind(this)}/>
          </div>
          <div>
            <h3>Location</h3>
            <div>
              <label htmlFor="inputCity">City:</label>
              <input id="inputCity" type="text" name="city" value={this.state.currentArtist.city} />
            </div>
            <div>
              <label htmlFor="inputNeighborhoodName">Neighborhood Name:</label>
              <input id="inputNeighborhoodName" type="text" name="neighborhoodName" />
            </div>
            <div>
              <label htmlFor="coordinates">Coordinates:</label>
              <input id="coordinates" type="text" name="coordinates" />
            </div>
          </div>
          <div>
            <h3>Categories:</h3>
            <label htmlFor="producer">Producer</label>
            <input type="checkbox" id="producer" name="categories" value="producer" />
            <label htmlFor="rapper">Rapper</label>
            <input type="checkbox" id="rapper" name="categories" value="rapper" />
            <label htmlFor="singer">Singer</label>
            <input type="checkbox" id="singer" name="categories" value="singer" />
          </div>
          <div>
            <h3>Images</h3>
            <label htmlFor="thumbnailUrl">Thumbnail Url:</label>
            <input id="thumbnailUrl" type="text" name="thumbnailUrl" value={this.state.currentArtist.thumbnailUrl}/>
          </div>
          <div>
            <h3>Bio</h3>
            <div>
              <label htmlFor="inputSummary">Summary:</label>
              <textarea id="inputSummary" name="summary">
              </textarea>
            </div>
            <div>
              <label htmlFor="inputWikipediaUrl">Wikipedia Url:</label>
              <input id="inputWikipediaUrl" type="string" name="wikipediaUrl" />
            </div>
            <div>
              <label htmlFor="inputBirthDate">Birthdate:</label>
              <input id="inputBirthDate" value={this.state.currentArtist.birthdate} type="date" name="birthdate" />
            </div>
            <div>
              <label htmlFor="inputDeathDate">Deathdate:</label>
              <input id="inputDeathDate" value={this.state.currentArtist.deathdate} type="date" name="deathdate" />
            </div>
          </div>
          <div>
            <h3>Youtube</h3>
            <div>
              <label htmlFor="inputYoutubePageUrl">Page Url:</label>
              <input id="inputYoutubePageUrl" type="string" name="youtugePageUrl" />
            </div>
            <div>
              <label htmlFor="inputClipExampleUrl">Clip Example Url:</label>
              <input id="inputClipExampleUrl" type="string" name="clipExampleUrl" />
            </div>
          </div>

          <button type="submit">Create</button>
        </form>
      </div>
    );
  }
}