import React, { Component } from 'react';

import Button from 'material-ui/Button';

import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT } from '../Events';

import LoginForm from './LoginForm';

import './styles/Login.css';
import ChatContainer from './ChatContainer';

const socketUrl = 'http://localhost:2112';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    this.setState({ socket })
  };

  setUser = (user) => {
    const { socket } = this.state;

    socket.emit(USER_CONNECTED, user);

    this.setState({ user });
  };

  logout = () => {
    const { socket, user } = this.state;
    socket.emit(LOGOUT, user.name);
    // socket.disconnect();
    this.setState({ user: null });
  };

  render() {
    const { socket, user } = this.state;
     return (
      <div>
        {
          !user ? <LoginForm socket={socket} setUser={this.setUser} /> : <ChatContainer/>
        }

        <Button variant="raised" color="secondary" onClick={this.logout}>Logout</Button>
      </div>
    );
  }
}

export default Login;
