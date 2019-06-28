import React from 'react';
import PropTypes from 'prop-types';
import {EventEmitter} from 'events';

export default class SubmitArtist extends React.Component {
  static propTypes = {
    bus: PropTypes.instanceOf(EventEmitter)
  }

  currentYear = new Date().getFullYear();
  minYearActiveStart = 1970;

  defaultState = {
    open: false,
    errors: [],
    name: '',
    city: '',
    bioUrl: '',
    clipExampleUrl: '',
    yearsActiveStart: this.minYearActiveStart,
    yearsActiveEnd: this.currentYear,
    filters: {
      'categories': ['producer / dj', 'rapper', 'singer', 'group'],
      'bio.yearsActiveStart' : this.minYearActiveStart,
      'bio.yearsActiveEnd' : this.currentYear,
    }
  };

  constructor(props) {
    super(props);

    this.state = this.defaultState;

    this.handleFilterCategoriesChange = this.handleFilterCategoriesChange.bind(this);
    this.handleFilterYearActiveStartChange = this.handleFilterYearActiveStartChange.bind(this);
    this.handleFilterYearActiveEndChange = this.handleFilterYearActiveEndChange.bind(this);
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

  handleFilterCategoriesChange(e) {
    const value = e.target.value;
    const filters = this.state.filters;

    if (this.state.filters.categories.includes(value)) {
      const index = this.state.filters.categories.indexOf(value);
      filters.categories.splice(index, 1);
    } else {
      filters.categories.push(value);
    }

    this.setState({
      'filters': filters
    });

    this.apply();
  }

  handleFilterYearActiveStartChange(e) {
    const value = Number(e.target.value);
    const filters = this.state.filters;

    filters['bio.yearsActiveStart'] = value;

    this.setState({
      'filters': filters,
      'yearsActiveStart': value
    });

    this.apply();
  }

  handleFilterYearActiveEndChange(e) {
    const value = Number(e.target.value);
    const filters = this.state.filters;

    filters['bio.yearsActiveEnd'] = value;

    this.setState({
      'filters': filters,
      'yearsActiveEnd': value
    });

    this.apply();
  }

  handleApplyClick(e) {
    this.apply();
    this.close();
  }

  apply() {
    if (typeof this.props.bus !== 'undefined') {
      this.props.bus.emit('updateArtists', this.state.filters);
    }
  }

  send() {
    const artist = JSON.stringify({
      name: this.state.name,
      city: this.state.city,
      'bioUrl': this.state.bioUrl,
      'clipExampleUrl': this.state.clipExampleUrl
    });

    const artistsCreateUrl = window.location.href + 'artists/submit';

    const artistsPromise = new Promise((resolve, reject) => {
      fetch(artistsCreateUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: artist
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

  render() {

    const errorName = this.state.errors.find(x => x.param === 'name');
    const errorCity = this.state.errors.find(x => x.param === 'city');

    return (
      <form onKeyDown={(e) => this.handleKeyDown(e)} tabIndex="-1" ref="submitPanel" className={'submit-artist-panel ' + ((this.state.open) ? 'open' : '')}>
        <button type="button" tabIndex="0" onClick={() => this.close()} className="submit-artist-panel__button--close button--close" aria-label="Close panel" title="Close panel">&#10799;</button>
        <div className="submit-artist-panel__content">
          <h2 className="panel__title">Filter Artists</h2>
          <div className="field-group">
            <h3 className="field-group__title">Categories:</h3>
            <div className="field--inline">
              <input type="checkbox" id="producer" name="categories" value="producer / dj" checked={this.state.filters.categories.includes('producer / dj')} onChange={this.handleFilterCategoriesChange} />
              <label className="field__label" htmlFor="producer">Producer / DJ</label>
            </div>
            <div className="field--inline">
              <input type="checkbox" id="rapper" name="categories" value="rapper" checked={this.state.filters.categories.includes('rapper')} onChange={this.handleFilterCategoriesChange} />
              <label className="field__label" htmlFor="rapper">Rapper</label>
            </div>
            <div className="field--inline">
              <input type="checkbox" id="singer" name="categories" value="singer" checked={this.state.filters.categories.includes('singer')} onChange={this.handleFilterCategoriesChange} />
              <label className="field__label" htmlFor="singer">Singer</label>
            </div>
            <div className="field--inline">
              <input type="checkbox" id="group" name="categories" value="group" checked={this.state.filters.categories.includes('group')} onChange={this.handleFilterCategoriesChange}/>
              <label className="field__label" htmlFor="group">Group</label>
            </div>
          </div>
          <div className="field-group">
            <h3 className="field-group__title">Years actives:</h3>
            <div className="field--inline">
              <label className="field__label" htmlFor="yearActiveStart">From: {this.state.yearsActiveStart}</label>
              <input id="yearActiveStart"  name="yearActiveStart" type="range" min={this.minYearActiveStart} max={ this.currentYear } onChange={this.handleFilterYearActiveStartChange} />
            </div>
            <div className="field--inline">
              <label className="field__label" htmlFor="yearActiveEnd">To: {this.state.yearsActiveEnd}</label>
              <input id="yearActiveEnd"  name="yearActiveEnd" type="range" min={this.minYearActiveStart} max={this.currentYear} value={this.state.yearsActiveEnd} onChange={this.handleFilterYearActiveEndChange} />
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <button onClick={() => this.handleApplyClick()} className="button--primary--md" tabIndex="0" type="button">Apply</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}