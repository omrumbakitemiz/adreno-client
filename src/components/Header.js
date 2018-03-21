import React, { Component } from 'react';

import './styles/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'Header'
    };
  }

  render() {
    return (
      <div className="text">
        {this.state.text}
      </div>
    );
  }
}

export default Header;
