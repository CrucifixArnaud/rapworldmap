import React from 'react';
import ClickOutHandler from 'react-onclickout';

export default class Dropdown extends React.Component {

  constructor(props) {
    super(props);

    // State
    this.state = {
      open: false
    };

    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.clickOutsideDropdown = this.clickOutsideDropdown.bind(this);
  }

  handleDropdownClick() {
    this.toggleDropdown();
  }

  clickOutsideDropdown() {
    this.toggleDropdown();
  }

  toggleDropdown() {
    this.setState({
      open: !this.state.open
    });
  }

  // This function will be called for the 'click' event in any
  // fields rendered by any of child components.
  handleChildClick(event) {
    // If child is a link, toggle the dropdown
    if(event.target.tagName.toLowerCase() === 'a') {
      this.toggleDropdown();
    }
  }

  render() {
    return (
      <div className="dropdown">
        <a className={'dropdown__button ' + (this.state.open ? 'open' : '')} onClick={() => this.handleDropdownClick()}>{this.props.label}</a>

        {this.state.open === true &&
          <ClickOutHandler onClickOut={this.clickOutsideDropdown}>
            <div className="dropdown__content" onClick={this.handleChildClick.bind(this)}>
              {this.props.children}
            </div>
          </ClickOutHandler>
        }
      </div>
    );
  }
}