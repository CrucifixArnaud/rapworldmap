import React from 'react';
import ClickOutHandler from 'react-onclickout';
import SubmitArtist from './submitArtist.js';

export default class AtlasMenu extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      areaOpen: false
    };

    this.handleAreaClick = this.handleAreaClick.bind(this);
    this.handleSubmitArtistClick = this.handleSubmitArtistClick.bind(this);
    this.toggleSubmenu = this.toggleSubmenu.bind(this);
    // this.toggleSubmitArtist = this.toggleSubmitArtist.bind(this);
    this.clickOutsideArea = this.clickOutsideArea.bind(this);
    this.clickOutsideSubmit = this.clickOutsideSubmit.bind(this);
    this.closeAllSubmenu = this.closeAllSubmenu.bind(this);
  }

  handleAreaClick(lat, lng, zoom) {
    this.props.centerView(lat, lng, zoom);
  }

  handleSubmitArtistClick() {
    this.toggleSubmitArtist();
  }


  toggleSubmenu(e) {
    var submenu = e.target.parentNode.nextSibling;

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
    if(this.state.submitArtistOpen === true) {
      this.toggleSubmitArtist();
    }
  }

  render() {
    return (
      <nav id="atlasMenu" className="atlas-menu">
        <ul className="menu">
          <li className="menu__item">
            <ClickOutHandler ref="areaHandler" onClickOut={this.clickOutsideArea}>
              <button className="menu__item__button" onClick={(e) => this.toggleSubmenu(e)}>
                <img className="button__icon" src="/images/placeofinterrests/placeofinterrests.svg" width="63px" height="49px" alt="" />
                <span className="button__label">Areas</span>
              </button>
              <ul className="submenu submenu--placeofinterests">
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(33.7161623, -84.3522846, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/atlanta.svg" width="65px" height="56px" alt="Atlanta" title="Atlanta" />
                    {/* <span className="button__label">Atlanta</span> */}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(37.938365, -122.344812, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/bay-a.svg" width="104px" height="52px" alt="Bay Area" title="Bay Area" />
                    {/* <span className="button__label">Bay Area</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(41.817786, -87.658691, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/chiraq.svg" width="116px" height="56px" alt="Chicago" title="Chicago" />
                    {/* <span className="button__label">Chicago</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(29.937851, -94.743895, 10)}>
                    <img className="button__icon" src="/images/placeofinterrests/h-town.svg" width="140px" height="56px" alt="Houston" title="Houston" />
                    {/* <span className="button__label">Houston</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(51.4945828, -0.1475805, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/london.svg" width="131px" height="51px" alt="London" title="London" />
                    {/* <span className="button__label">London</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(33.950426, -118.259620, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/la.svg" width="48px" height="49px" alt="Los Angeles" title="Los Angeles" />
                    {/* <span className="button__label">Los Angeles</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(43.320071, 5.374707, 13)}>
                    <img className="button__icon" src="/images/placeofinterrests/marseille.svg" width="42px" height="48px" alt="Marseille" title="Marseille" />
                    {/* <span className="button__label">Marseille</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(35.115065, -89.976974, 13)}>
                    <img className="button__icon" src="/images/placeofinterrests/memphis.svg" width="92px" height="47px" alt="Memphis" title="Memphis" />
                    {/* <span className="button__label">Memphis</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(25.809509, -80.193240, 12)}>
                    <img className="button__icon" src="/images/placeofinterrests/magic-city.svg" width="134px" height="48px" alt="Miami" title="Miami" />
                    {/* <span className="button__label">Miami</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(29.984120, -90.065548, 13)}>
                    <img className="button__icon" src="/images/placeofinterrests/nola.svg" width="95px" height="50px" alt="New Orleans" title="New Orleans" />
                    {/* <span className="button__label">New Orleans</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(40.758206, -73.887433, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/nyc.svg" width="72px" height="45px" alt="New York City" title="New York City"  />
                    {/* <span className="button__label">New York City</span>*/}
                  </button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(48.8589507, 2.2775175, 11)}>
                    <img className="button__icon" src="/images/placeofinterrests/paname.svg" width="127px" height="46px" alt="Paris" title="Paris" />
                    {/* <span className="button__label">Paris</span>*/}
                  </button>
                </li>
              </ul>
            </ClickOutHandler>
          </li>
          <li className="menu__item">
            <ClickOutHandler ref="areaHandler" onClickOut={this.clickOutsideSubmit}>
              <button className="menu__item__button" onClick={(e) => this.handleSubmitArtistClick(e)}>
                <img className="button__icon" src="/images/submit-artist.svg" width="58px" height="45px" alt="" />
                <span className="button__label">Submit an entry</span>
              </button>
              <SubmitArtist ref="submitArtist" />
            </ClickOutHandler>
          </li>
        </ul>
      </nav>
    );
  }
}