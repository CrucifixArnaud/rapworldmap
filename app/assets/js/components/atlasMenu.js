import React from 'react';
import ClickOutHandler from 'react-onclickout';
import SubmitArtist from './submitArtist.js';
import {EventEmitter} from 'events';

export default class AtlasMenu extends React.Component {
  static propTypes = {
    bus: React.PropTypes.instanceOf(EventEmitter)
  }

  constructor(props) {
    super(props);

    // State
    this.state = {
      areaOpen: false,
      aboutOpen: false
    };

    this.handleAreaClick = this.handleAreaClick.bind(this);
    this.handleSubmitArtistClick = this.handleSubmitArtistClick.bind(this);
    this.toggleAreaMenu = this.toggleAreaMenu.bind(this);
    // this.toggleSubmitArtist = this.toggleSubmitArtist.bind(this);
    this.clickOutsideArea = this.clickOutsideArea.bind(this);
    this.clickOutsideSubmit = this.clickOutsideSubmit.bind(this);
    this.closeAllSubmenu = this.closeAllSubmenu.bind(this);
  }

  handleAreaClick(lat, lng, zoom) {

    setTimeout(this.toggleAreaMenu(), 2000);
    this.props.centerView(lat, lng, zoom);
  }

  handleSubmitArtistClick() {
    this.toggleSubmitArtist();
  }

  toggleAreaMenu() {
    var submenu = this.refs.areaSubmenu;
    var children = Array.from(submenu.childNodes);

    if(this.state.areaOpen === false) {
      this.setState({
        areaOpen: true
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

  closeAllSubmenu() {
    var submenus = document.getElementById('atlasMenu').getElementsByClassName('submenu open');

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

  toggleAbout() {
    if(this.state.aboutOpen === false) {
      this.setState({
        aboutOpen: true
      });
    } else {
      this.setState({
        aboutOpen: false
      });
    }
  }

  handleAboutClick() {
    this.toggleAbout();
  }

  clickOutsideAbout() {
    if(this.state.aboutOpen === true) {
      this.toggleAbout();
    }
  }

  render() {
    return (
      <nav id="atlasMenu" className="atlas-menu">
        <ul className="menu">
          <li className="menu__item">
            <ClickOutHandler ref="areaHandler" onClickOut={this.clickOutsideArea}>
              <button className="menu__item__button" onClick={(e) => this.toggleAreaMenu(e)}>
                <img className="button__icon" src="/images/placeofinterrests/placeofinterrests.svg" width="63px" height="49px" alt="" />
                <span className="button__label">Areas</span>
              </button>
              <ul ref="areaSubmenu" className="submenu submenu--placeofinterests">
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(33.7161623, -84.3522846, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/atlanta.svg" width="65px" height="56px" alt="Atlanta" title="Atlanta" />
                    <span className="button__label">Atlanta</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(37.938365, -122.344812, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/bay-a.svg" width="104px" height="52px" alt="Bay Area" title="Bay Area" />
                    <span className="button__label">Bay Area</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(41.817786, -87.658691, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/chiraq.svg" width="116px" height="56px" alt="Chicago" title="Chicago" />
                    <span className="button__label">Chicago</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(29.937851, -94.743895, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/h-town.svg" width="140px" height="56px" alt="Houston" title="Houston" />
                    <span className="button__label">Houston</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(51.4945828, -0.1475805, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/london.svg" width="131px" height="51px" alt="London" title="London" />
                    <span className="button__label">London</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(33.950426, -118.259620, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/la.svg" width="48px" height="49px" alt="Los Angeles" title="Los Angeles" />
                    <span className="button__label">Los Angeles</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(43.320071, 5.374707, 12)}>
                    <img className="button__icon" src="/images/placeofinterrests/marseille.svg" width="42px" height="48px" alt="Marseille" title="Marseille" />
                    <span className="button__label">Marseille</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(35.115065, -89.976974, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/memphis.svg" width="92px" height="47px" alt="Memphis" title="Memphis" />
                    <span className="button__label">Memphis</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(25.809509, -80.193240, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/magic-city.svg" width="134px" height="48px" alt="Miami" title="Miami" />
                    <span className="button__label">Miami</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(29.984120, -90.065548, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/nola.svg" width="95px" height="50px" alt="New Orleans" title="New Orleans" />
                    <span className="button__label">New Orleans</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(40.758206, -73.887433, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/nyc.svg" width="72px" height="45px" alt="New York City" title="New York City"  />
                    <span className="button__label">New York City</span>
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(48.8589507, 2.2775175, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/paname.svg" width="138px" height="48px" alt="Paris" title="Paris" />
                    <span className="button__label">Paris</span>
                  </button>
                </li>
              </ul>
            </ClickOutHandler>
          </li>
          <li className="menu__item menu__item--submit-artist">
            <ClickOutHandler ref="submitHandler" onClickOut={this.clickOutsideSubmit}>
              <button className="menu__item__button" onClick={(e) => this.handleSubmitArtistClick(e)}>
                <img className="button__icon" src="/images/submit-artist.svg" width="58px" height="45px" alt="" />
                <span className="button__label">Submit an entry</span>
              </button>
              <SubmitArtist bus={this.props.bus} ref="submitArtist" addNotification={this.props.addNotification} />
            </ClickOutHandler>
          </li>
          <li className="menu__item menu__item--about-panel">
            <ClickOutHandler ref="aboutHandler" onClickOut={() => this.clickOutsideAbout()}>
              <button className="menu__item__button" onClick={(e) => this.handleAboutClick(e)}>
                <img className="button__icon" src="/images/about.svg" width="60px" height="39px" alt="" />
                <span className="button__label">About</span>
              </button>
              <div className={'about-panel ' + ((this.state.aboutOpen) ? 'open' : '')}>
                <a onClick={() => this.handleAboutClick()} className="button--close about-panel__button--close" title="Close panel">&#10799;</a>
                <div className="about-panel__body">
                  <h2 className="panel__title">About Rap World Map</h2>
                  <p>Project create by <a href="http://crucifixarnaud.com" title="Visit Crucifix Arnaud portfolio">Arnaud Crucifix</a>.</p>
                  <h2 className="panel__title">Data Presented</h2>
                  <p>This atlas don't aim to be exaustif. There is a incredible amount of rap artists, each day new one appears and releases new songs, mixtapes and projects. It's impossible to give a complete panel of what exists. In concequence we have probably missed a lot of artists, don't hesitate to suggest a new adition.</p>
                  <h2 className="panel__title">Localisation precision</h2>
                  <p>We have decide to locate each artist where they grow up or where they spent a signifiant part of their life that influence their musique instead of their born place (wich could be sometime irrelevant). It could occured in some strong opinionated decision. For example:</p>
                  <p>2 Pac have grow up en attempt school in Harlem until is 18 years old. Even if he only start producing song and album after is move to California, and that he is a major representante of the westcoast school. I considred that the vast majority of is education, and what could possibly influence him as a human being, occured in Harlem (New York). In concequence 2 Pac is represented in Harlem instead of California.</p>
                  <p>The precise localisation of certain artists is quite easy (we know in wich house, street they grew up, etc), but for a majority of them it's don't easy to define a correct localisation. We generaly try to locate the neighborhood where they grew up, where they goes to school, and display them there. If we don't found any other information than the city, we choose a random set of coordinates in this area.</p>
                  <p>If you concider we have made a major mistake about an artist, don't hesitate to <a href="mailto:contact@rapworldmap.com">contact us</a> with your remarks, we will adapt the database based on your input.</p>
                  <h2 className="panel__title">Licence</h2>
                  <p>This project is licensed under the terms of the MIT license. (<a href="https://opensource.org/licenses/MIT">https://opensource.org/licenses/MIT</a>)</p>
                </div>
              </div>
            </ClickOutHandler>
          </li>
        </ul>
      </nav>
    );
  }
}