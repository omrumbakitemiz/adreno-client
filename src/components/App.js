import React, { Component } from 'react';

import Login from './Login';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'adreno-client'
    };
  }

  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default App;
