import React, { Component } from 'react';

import './styles/App.css';
import Login from './Login';
import Header from './Header';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'adreno-client'
    };
  }

  render() {
    return (
      <div className="title">
        <Header />
        {this.state.title}
        <Login />
      </div>
    );
  }
}

export default App;
