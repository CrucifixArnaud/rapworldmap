import React from 'react';
import PropTypes from 'prop-types';
import ClickOutHandler from 'react-onclickout';
import SubmitArtist from './submitArtist.js';
import SearchArtist from './searchArtist.js';
import FilterArtists from './filterArtists.js';
import { EventEmitter } from 'events';

export default class AtlasMenu extends React.Component {
  static propTypes = {
    bus: PropTypes.instanceOf(EventEmitter)
  }

  constructor(props) {
    super(props);

    // State
    this.state = {
      areaOpen: false
    };

    this.handleAreaClick = this.handleAreaClick.bind(this);
    this.handleSubmitArtistClick = this.handleSubmitArtistClick.bind(this);
    this.handleSearchArtistClick = this.handleSearchArtistClick.bind(this);
    this.handleFilterArtistsClick = this.handleFilterArtistsClick.bind(this);
    this.toggleAreaMenu = this.toggleAreaMenu.bind(this);
    this.clickOutsideArea = this.clickOutsideArea.bind(this);
    this.clickOutsideSubmit = this.clickOutsideSubmit.bind(this);
    this.clickOutsideSearch = this.clickOutsideSearch.bind(this);
    this.clickOutsideFilter = this.clickOutsideFilter.bind(this);
    this.closeAllSubmenu = this.closeAllSubmenu.bind(this);
  }

  handleAreaClick(lat, lng, zoom) {
    setTimeout(this.toggleAreaMenu(), 2000);
    this.props.centerView(lat, lng, zoom);
  }

  handleSubmitArtistClick() {
    this.toggleSubmitArtist();
  }

  handleSearchArtistClick() {
    this.toggleSearchArtist();
  }

  handleFilterArtistsClick() {
    this.toggleFilterArtist();
  }

  toggleAreaMenu() {
    const submenu = this.refs.areaSubmenu;
    let children = Array.from(submenu.childNodes);

    if(this.state.areaOpen === false) {
      this.setState({
        areaOpen: true
      }, () => {

      });


    } else {

      children = children.reverse();

      this.setState({
        areaOpen: false
      });
    }

    children.forEach((item, index) => {
      setTimeout(() => {
        item.classList.toggle('open');

        if(this.state.areaOpen === true) {
          item.firstChild.removeAttribute('tabindex');
        } else {
          item.firstChild.setAttribute('tabindex', '-1');
        }

      }, 50 * index);
    });
  }

  toggleSubmitArtist() {
    if(this.refs.submitArtist.state.open === false) {
      this.refs.submitArtist.open();
    }else{
      this.refs.submitArtist.close();
    }
  }

  toggleSearchArtist() {
    if(this.refs.searchArtist.state.open === false) {
      this.refs.searchArtist.open();
    }else{
      this.refs.searchArtist.close();
    }
  }

  toggleFilterArtist() {
    if(this.refs.filterArtists.state.open === false) {
      this.refs.filterArtists.open();
    }else{
      this.refs.filterArtists.close();
    }
  }

  closeAllSubmenu() {
    let submenus = document.getElementById('atlasMenu').getElementsByClassName('submenu open');

    Object.keys(submenus).forEach(key => {
      submenus[key].classList.remove('open');
    });
  }

  clickOutsideArea() {
    this.closeAllSubmenu();
  }

  clickOutsideSubmit() {
    if(this.refs.submitArtist.state.open === true) {
      this.refs.submitArtist.close();
    }
  }

  clickOutsideSearch() {
    if(this.refs.searchArtist.state.open === true) {
      this.refs.searchArtist.close();
    }
  }

  clickOutsideFilter() {
    if(this.refs.filterArtists.state.open === true) {
      this.refs.filterArtists.close();
    }
  }

  handleAreasKeyDown(e) {
    if (e.keyCode === 27)
      this.toggleAreaMenu();
  }

  render() {
    return (
      <nav id="atlasMenu" role="menu" className="atlas-menu">
        <ul className="menu">
          <li role="menuitem" className="menu__item">
            <ClickOutHandler ref="areaHandler" onClickOut={this.clickOutsideArea}>
              <button className="menu__item__button" title="Display a selection of place of interest" onClick={(e) => this.toggleAreaMenu(e)}>
                <img className="button__icon" src="/images/placeofinterrests/placeofinterrests.svg" width="63px" height="49px" alt="" />
                <span className="button__label">Areas</span>
              </button>
              <ul onKeyDown={(e) => this.handleAreasKeyDown(e)} ref="areaSubmenu" className="submenu submenu--placeofinterests">
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(33.7161623, -84.3522846, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/atlanta.svg" width="65px" height="56px" alt="" title="Atlanta" />
                    <span className="button__label">Atlanta</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(37.938365, -122.344812, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/bay-a.svg" width="104px" height="52px" alt="" title="Bay Area" />
                    <span className="button__label">Bay Area</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(41.817786, -87.658691, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/chiraq.svg" width="116px" height="56px" alt="" title="Chicago" />
                    <span className="button__label">Chicago</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(29.937851, -94.743895, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/h-town.svg" width="140px" height="56px" alt="" title="Houston" />
                    <span className="button__label">Houston</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(51.4945828, -0.1475805, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/london.svg" width="131px" height="51px" alt="" title="London" />
                    <span className="button__label">London</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(33.950426, -118.259620, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/la.svg" width="48px" height="49px" alt="" title="Los Angeles" />
                    <span className="button__label">Los Angeles</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(43.320071, 5.374707, 12)}>
                    <img className="button__icon" src="/images/placeofinterrests/marseille.svg" width="42px" height="48px" alt="" title="Marseille" />
                    <span className="button__label">Marseille</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(35.115065, -89.976974, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/memphis.svg" width="92px" height="47px" alt="" title="Memphis" />
                    <span className="button__label">Memphis</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(25.809509, -80.193240, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/magic-city.svg" width="134px" height="48px" alt="" title="Miami" />
                    <span className="button__label">Miami</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(29.984120, -90.065548, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/nola.svg" width="95px" height="50px" alt="" title="New Orleans" />
                    <span className="button__label">New Orleans</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(40.758206, -73.887433, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/nyc.svg" width="72px" height="45px" alt="" title="New York City"  />
                    <span className="button__label">New York City</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button tabIndex="-1" className="submenu__item__button" onClick={() => this.handleAreaClick(48.8589507, 2.2775175, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/paname.svg" width="138px" height="48px" alt="" title="Paris" />
                    <span className="button__label">Paris</span>
                  </button>
                </li>
              </ul>
            </ClickOutHandler>
          </li>
          <li role="menuitem" className="menu__item menu__item--submit-artist">
            <ClickOutHandler ref="submitHandler" onClickOut={this.clickOutsideSubmit}>
              <button className="menu__item__button" onClick={(e) => this.handleSubmitArtistClick(e)}>
                <img className="button__icon" src="/images/submit-artist.svg" width="58px" height="45px" alt="" />
                <span className="button__label">Submit an entry</span>
              </button>
              <SubmitArtist bus={this.props.bus} ref="submitArtist" addNotification={this.props.addNotification} />
            </ClickOutHandler>
          </li>
          <li role="menuitem" className="menu__item menu__item--search-artist">
            <ClickOutHandler ref="searchHandler" onClickOut={this.clickOutsideSearch}>
              <button className="menu__item__button" onClick={(e) => this.handleSearchArtistClick(e)}>
                <img className="button__icon" src="/images/search-artist.svg" width="58px" height="38px" alt="" />
                <span className="button__label">Search an artist</span>
              </button>
              <SearchArtist ref="searchArtist" showArtist={this.props.showArtist} centerView={this.props.centerView} />
            </ClickOutHandler>
          </li>
          <li role="menuitem" className="menu__item menu__item--filter-artist">
            <ClickOutHandler ref="filterHandler" onClickOut={this.clickOutsideFilter}>
              <button className="menu__item__button" onClick={(e) => this.handleFilterArtistsClick(e)}>
                <img className="button__icon" src="/images/filter-artist.svg" width="54px" height="39px" alt="" />
                <span className="button__label">Filter artists</span>
              </button>
              <FilterArtists bus={this.props.bus} ref="filterArtists" showArtist={this.props.showArtist} centerView={this.props.centerView} />
            </ClickOutHandler>
          </li>
        </ul>
      </nav>
    );
  }
}