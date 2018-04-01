import React, { Component } from 'react';

import Button from 'material-ui/Button';
import { List, ListItem } from 'material-ui/List';

import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT, USERS_CHANGED } from '../Events';

import LoginForm from './LoginForm';

import './styles/Login.css';
import ChatContainer from './ChatContainer';

const socketUrl = 'http://localhost:2112';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null,
      connectedUsers: []
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);

    this.setState({ socket });

    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on(USERS_CHANGED, this.handleUsersChange);
  };

  handleUsersChange = (connectedUsers) => {
    console.log('users: ', connectedUsers);

    this.setState({
      connectedUsers: connectedUsers
    });
  }

  setUser = (user) => {
    const { socket } = this.state;

    socket.emit(USER_CONNECTED, user);

    this.setState({ user });
  };

  logout = () => {
    const { socket, user } = this.state;
    socket.emit(LOGOUT, user.name);

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

        {/* <List>
          {this.state.connectedUsers.map((user, index) => {
            return(
              <ListItem primaryText={user} />
            )
          })}
        </List> */}
      </div>
    );
  }
}

export default Login;
