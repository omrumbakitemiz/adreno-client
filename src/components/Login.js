import React, { Component } from 'react';

import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT } from '../Events';

import LoginForm from './LoginForm';

import './styles/Login.css';

const socketUrl = 'http://localhost:2112';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log('Connected');
    })
    this.setState({ socket })
  }

  setUser = (user) => {
    const { socket } = this.state;

    socket.emit(USER_CONNECTED, user);

    this.setState({ user });
  }

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  }

  componentWillMount() {
    this.initSocket();
  }

  render() {
    return (
      <div>
        <LoginForm socket={this.state.socket} setUser={this.setUser} />
      </div>
    );
  }
}

export default Login;
