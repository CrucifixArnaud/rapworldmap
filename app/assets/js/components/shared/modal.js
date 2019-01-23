import React from 'react';
import FocusTrap from 'focus-trap-react';

export default class Modal extends React.Component {

  constructor(props) {
    super(props);

    // State
    this.state = {
      open: false,
      modalOpener: null,
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    if (this.state.open === false) {
      this.openModal();
    } else {
      this.closeModal();
    }

  }

  openModal() {
    this.setState({
      modalOpener: document.activeElement,
      open: true
    });
  }

  closeModal() {
    this.setState({
      open: false
    });
    // Set focus back on the element that trigger the modal opening
    this.state.modalOpener.focus();

    if(this.props.onCloseModal) {
      this.props.onCloseModal();
    }
  }

  // This function will be called for the 'click' event in any
  // fields rendered by any of child components.
  handleChildClick(event) {
    // If child is a link, toggle the dropdown
    if(event.target.tagName.toLowerCase() === 'a') {
      this.toggleModal();
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 27)
      this.toggleModal();
  }

  render() {
    const modal = this.state.open ?
      <FocusTrap>
        <div onKeyDown={(e) => this.handleKeyDown(e)} role="dialog" aria-labelledby={this.props.ariaLabelledby} aria-describedby={this.props.ariaLabelledby} className={'modal ' + (this.props.className) + ((this.state.open) ? ' open' : '')}>
          {this.state.open === true &&
            <div className="modal__body" onClick={this.handleChildClick.bind(this)}>
              <div className="modal__body__content">
                {this.props.children}
              </div>
              <button type="button" onClick={() => this.toggleModal()} className="button--close modal__button-close" aria-label="Close modal" title="Close modal (esc)">&#10799;</button>
            </div>
          }
        </div>
      </FocusTrap>
      : false;

    return (
      <div>
        {modal}
      </div>
    );
  }
}