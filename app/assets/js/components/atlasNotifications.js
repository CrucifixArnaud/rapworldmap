import React from 'react';
import {EventEmitter} from 'events';

export default class AtlasNotifications extends React.Component {
  static propTypes = {
    bus: React.PropTypes.instanceOf(EventEmitter)
  }

  constructor(props) {
    super(props);

    this.state = {
      notifications: {}
    };
  }

  componentWillMount() {
    if (typeof this.props.bus !== "undefined") {
      this.props.bus.on("add", (notification) => {
          this.add(notification);
      })
    }
  }

  add(item) {
    let notifications = this.state.notifications;
    let index = Date.now();
    notifications[index] = item;

    setTimeout(() => {
      this.remove(index);
    }, 5000);

    this.setState({
      notifications: notifications
    });
  }

  remove(key) {
    let notifications = this.state.notifications;
    delete notifications[key];

    this.setState({
      notifications: notifications
    });
  }

  render() {
    return (
      <div className="notifications">
        <ul className="notifications__list">
          {
            Object.keys(this.state.notifications).map(function(key) {
              return <li className={'notification notification--' + this.state.notifications[key].type} key={key} onClick={() => this.remove(key)}>{this.state.notifications[key].message}</li>;
            }, this)
          }
        </ul>
      </div>
    );
  }
}