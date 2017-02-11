import React from 'react';
import ClickOutHandler from 'react-onclickout';
import Utils from '../utils/utils';

export default class AtlasMenu extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      areaOpen: false
    };

    this.handleAreaClick = this.handleAreaClick.bind(this);
    this.toggleSubmenu = this.toggleSubmenu.bind(this);
    this.clickOutsideArea = this.clickOutsideArea.bind(this);
    this.closeAllSubmenu = this.closeAllSubmenu.bind(this);
  }

  handleAreaClick(lat, lng, zoom) {
    this.props.centerView(lat, lng, zoom);
  }

  toggleSubmenu(e) {
    var submenu = e.target.parentNode.nextSibling;

    submenu.classList.toggle('open');
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

  render() {
    return (
      <nav id="atlasMenu" className="atlas-menu">
        <ul className="menu">
          <li className="menu__item">
            <ClickOutHandler ref="areaHandler" onClickOut={this.clickOutsideArea}>
              <button className="menu__item__button" onClick={(e) => this.toggleSubmenu(e)}>
                <img className="button__icon" src="/images/placeofinterrests.svg" width="50px" height="40px" alt="" />
                <span className="button__label">Areas</span>
              </button>
              <ul className="submenu">
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(33.7161623, -84.3522846, 11)}>Atlanta</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(37.938365, -122.344812, 11)}>Bay Area</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(41.817786, -87.658691, 11)}>Chicago</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(29.937851, -94.743895, 10)}>Houston / Port Arthur</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(51.4945828, -0.1475805, 11)}>London</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(33.950426, -118.259620, 11)}>Los Angeles</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(43.320071, 5.374707, 13)}>Marseille</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(35.115065, -89.976974, 13)}>Memphis</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(25.809509, -80.193240, 12)}>Miami</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(29.984120, -90.065548, 13)}>New Orleans</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(40.758206, -73.887433, 11)}>New York</button>
                </li>
                <li className="submenu__item">
                  <button className="submenu__item__button" onClick={() => this.handleAreaClick(48.8589507, 2.2775175, 11)}>Paris</button>
                </li>
              </ul>
            </ClickOutHandler>
          </li>
        </ul>
      </nav>
    );
  }
}