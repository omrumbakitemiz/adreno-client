import React, { Component } from 'react';

import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';

import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT, USERS_CHANGED, COMMUNITY_CHAT } from '../Events';
import Message from '../Models/Message';

import LoginForm from './LoginForm';

import './styles/Login.css';
import ChatContainer from './ChatContainer';

const socketUrl = 'http://192.168.0.20:2112';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null,
      connectedUsers: [],
      privateMessages: [],
      communityMessages: []
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

    socket.on('privateMessage', (sender, receiver, text, date) => {
      const newMessage = new Message(sender, receiver, text, date);

      this.setState(prevState => ({
        privateMessages: [...prevState.privateMessages, newMessage]
      }));
      // Alternative approach
      // this.setState({privateMessages:[...this.state.privateMessages, newMessage]});
    });

    socket.on(COMMUNITY_CHAT, (sender, text, date) => {
      const newCommunityMessage = new Message(sender, 'all', text, date);

      this.setState(prevState => ({
        communityMessages: [...prevState.communityMessages, newCommunityMessage]
      }));
    });
  };

  handleUsersChange = connectedUsers => {
    this.setState({
      connectedUsers: connectedUsers
    });
  };

  setUser = user => {
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
    const { socket, user, connectedUsers, privateMessages, communityMessages } = this.state;
    return (
      <div>
        {!user ? (
          <LoginForm socket={socket} setUser={this.setUser} />
        ) : (
          <ChatContainer
            user={user}
            connectedUsers={connectedUsers}
            messages={privateMessages}
            communityMessages={communityMessages}
            socket={socket}
          />
        )}
        <Button variant="raised" color="secondary" onClick={this.logout}>
          Logout
        </Button>

        {user ? (
          <div>
            <h3>Connected Users</h3>
            <List>
              {connectedUsers.map((user, index) => {
                return (
                  <ListItem key={index}>
                    <ListItemText primary={user.name} secondary={user.id} />
                    <ListItemText primary={user.ipAddress} />
                  </ListItem>
                );
              })}
            </List>
          </div>
        ) : (
          <h4>You must login to see connected users :)</h4>
        )}
      </div>
    );
  }
}

export default Login;
