import React from 'react';
import {EventEmitter} from 'events';
import {TransitionMotion, spring, presets} from 'react-motion';

export default class AtlasNotifications extends React.Component {
  static propTypes = {
    bus: React.PropTypes.instanceOf(EventEmitter)
  }

  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      value: '',
      selected: 'all'
    };
  }

  componentWillMount() {
    if (typeof this.props.bus !== "undefined") {
      this.props.bus.on("add", (notification) => {
        this.handleAdd(notification);
      })
    }
  }

  handleAdd(item) {
    const newItem = {
      key: 't' + Date.now(),
      data: item,
    };

    setTimeout(() => {
      this.handleRemove(newItem.key);
    }, 5000)

    this.setState({
      notifications: [newItem].concat(this.state.notifications)
    });
  }

  handleRemove(item) {
    this.setState({
      notifications: this.state.notifications.filter(({key}) => key !== item)
    });
  }

  getDefaultStyles() {
    return this.state.notifications.map(notification => ({...notification, style: {height: 0, opacity: 1}}));
  }

  getStyles() {
    const {notifications, value, selected} = this.state;
    return notifications.map((notification, i) => {
      return {
        ...notification,
        style: {
          height: spring(44, presets.gentle),
          opacity: spring(1, presets.gentle)
        }
      };
    });
  }

  willEnter() {
    return {
      height: 0,
      opacity: 1,
    };
  }

  willLeave() {
    return {
      height: spring(0),
      opacity: spring(0),
    };
  }

  render() {
    const {notifications, value, selected} = this.state;
    return (
      <div className="notifications">
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willLeave={this.willLeave}
          willEnter={this.willEnter}>
          {styles =>
            <ul className="notifications__list">
              {
                styles.map(({key, style, data: {text, type}}) => {
                  return (
                    <li key={key} style={style} className={'notification' + (type ? ' notification--' + type : '')} onClick={() => this.handleRemove(key)}>
                      <span className="notification__content">{text}</span>
                    </li>
                  )
                })
              }
            </ul>
          }
        </TransitionMotion>
      </div>
    );
  }
}