import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faBars
} from '@fortawesome/free-solid-svg-icons';
import './navbar.css';
class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <div className="navbar__drawer-button" onClick={this.props.toggleDrawer}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className="navbar__title">
          Lost Person Behavior Mapper
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
};

export default Navbar;
