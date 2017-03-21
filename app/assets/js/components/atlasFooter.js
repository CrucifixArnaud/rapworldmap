import React from 'react';
import ClickOutHandler from 'react-onclickout';
import Request from 'request';

export default class AtlasFooter extends React.Component {
  constructor(props) {
    super(props);

    // State
    this.state = {
      aboutOpen: false
    };
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
      <nav className="atlas-footer">
        <ul className="menu">
          <li className="menu__item menu__item--about-panel">
            <ClickOutHandler ref="aboutHandler" onClickOut={() => this.clickOutsideAbout()}>
              <button className="menu__item__button" onClick={(e) => this.handleAboutClick(e)}>
                <span className="button__label">About Rap World Map ?</span>
              </button>
              <div className={'about-panel modal ' + ((this.state.aboutOpen) ? 'open' : '')}>
                <a onClick={() => this.handleAboutClick()} className="button--close about-panel__button--close" title="Close panel">&#10799;</a>
                <div className="about-panel__body">
                  <h2 className="panel__title">About Rap World Map</h2>
                  <h3 className="panel__subtitle">Data Presented ({this.props.artistsTotal} artists)</h3>
                  <p>This atlas don't aim to be exaustif. It's impossible to give a complete panel of what exists. In concequence we have probably missed a lot of artists, don't hesitate to suggest a new adition.</p>
                  <h3 className="panel__subtitle">Localisation precision</h3>
                  <p>We have decide to locate each artists where they grow up or where they spent a signifiant part of their life instead of their born place (wich could be sometime irrelevant). It could occured in some strong opinionated decision.</p>
                  <p>The exact localisation of some artists is quite easy to found (we know in wich house, street they grew up, etc), but for the other one it's not the case. We try to locate their childhood neighborhood, where they went to school, and display them there. If the only know information is the city, we choose a random set of coordinates in this area.</p>
                  <p>If you think we have made a major mistake about an artist, don't hesitate to <a href="mailto:contact@rapworldmap.com">contact us</a> with your remarks, we will adapt the database based on your input.</p>
                  <h3 className="panel__subtitle">Suggestions, comments, remarks ?</h3>
                  <p>Contact us on <a href="mailto:contact@rapworldmap.com">contact@rapworldmap.com</a></p>
                  <h3 className="panel__subtitle">Licence</h3>
                  <p>Project create by <a href="http://crucifixarnaud.com" title="Visit Crucifix Arnaud portfolio">Arnaud Crucifix</a>.</p>
                  <p>Build with <a href="https://nodejs.org/en/" title="">node.js</a>, <a href="https://facebook.github.io/react/" title="">React</a>, <a href="https://www.mapbox.com/">Mapbox</a>.</p>
                  <p>This website use Liberation Font, created by <a href="https://en.wikipedia.org/wiki/Steve_Matteson" title="Visit Steve Matteson wikipedia page">Steve Matteson</a> and distributed by <a href="http://ascendercorp.us/" title="Visit velvetyne website">Ascender Corp.</a> type foundry. The logo and icons use Grotesk typeface, created by <a href="http://www.fadebiaye.com/" title="Visit Frank Adebiaye website">Frank Adebiaye</a> and distributed by <a href="http://www.velvetyne.fr/" title="Visit velvetyne website">Velvetyne</a> type foundry. Both two licensed under <a href="http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&amp;id=OFL"><abbr title="SIL Open Font License">SIL OFL</abbr> licence</a>.</p>
                  <p>Rapworldmap.com is licensed under the terms of the <a href="https://opensource.org/licenses/MIT">MIT license</a>.</p>
                  <h3 className="panel__subtitle">See also</h3>
                  <p><a href="http://rapatlas.com/">Rapatlas.com</a>, a similar project created by <a href="http://jongerlach.com/" title="Visit Jon Gerlach portfolio">Jon Gerlach</a>.</p>
                  <a onClick={() => this.handleAboutClick()} className="link-close" title="Close panel">Close this modal</a>
                </div>
              </div>
            </ClickOutHandler>
          </li>
        </ul>
      </nav>
    );
  }
}