import React, { Component } from 'react';

import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT, USERS_CHANGED, COMMUNITY_CHAT } from '../Events';
import Message from '../Models/Message';

import LoginForm from './LoginForm';

import ChatContainer from './ChatContainer';

// const socketUrl = 'https://adreno-server.herokuapp.com';
const socketUrl = 'http://localhost:2112';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null, // user nesnesi null haricinde ayarlanırsa login ekranı pas geçilir
      connectedUsers: [],
      privateMessages: [],
      communityMessages: []
    };
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
    });

    socket.on(COMMUNITY_CHAT, (sender, text, date) => {
      const newCommunityMessage = new Message(sender, 'all', text, date);

      this.setState(prevState => ({
        communityMessages: [...prevState.communityMessages, newCommunityMessage]
      }));
    });
  };

  // TODO: console'da çıkan component hatası bu kısımla ilgili olabilir, initSocket metodunu constructor'a taşımak sorunu çözebilir.
  componentWillMount() {
    this.initSocket();
  }

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

  handlePrivateMessageState = (message) => {
    this.setState(prevState => ({
      privateMessages: [...prevState.privateMessages, message]
    }));
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
            logout={this.logout}
            socket={socket}
            handlePrivateMessageState={this.handlePrivateMessageState}
          />
        )}
      </div>
    );
  }
}

export default Login;
