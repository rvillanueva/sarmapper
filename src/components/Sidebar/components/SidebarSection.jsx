import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

export default class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }
  renderChildren = () => {
    return <div className="sidebar-section__body">
      {this.props.children}
    </div>;
  }
  toggleOpenState = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  render() {
    return (
      <div className="sidebar-section">
        <div className="sidebar-section__header" onClick={this.toggleOpenState}>
          <div className="sidebar-section__header__caret">
            {
              this.state.isOpen
                ? <FontAwesomeIcon icon={faCaretDown}/>
                : <FontAwesomeIcon icon={faCaretRight}/>
            }
          </div>
          <div className="sidebar-section__header__name">
            {this.props.name}
          </div>
        </div>
        {
          this.state.isOpen
            ? this.renderChildren()
            : null
        }
        <div className="sidebar-section__footer">
        </div>
      </div>
    );
  }
}
