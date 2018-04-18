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
      image: '',
      connectedUsers: [],
      privateMessages: [],
      communityMessages: []
    };
  }

  // Logout butonuna basılmadan tarayıcı kapatılırsa otomatik logout işlemi yapılır.
  handleBrowserClose = () => {
    window.addEventListener('beforeunload', event => {
      event.preventDefault();

      this.logout();
    });
  };

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

  componentDidMount(){
    this.initSocket();

    this.handleSessionStorage();

    this.handleBrowserClose();
  }

  handleUsersChange = connectedUsers => {
    this.setState({
      connectedUsers: connectedUsers
    });
  };

  setUser = (user, image) => {
    const { socket } = this.state;

    socket.emit(USER_CONNECTED, user);

    this.setState({ user, image });
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  logout = () => {
    const { socket, user } = this.state;
    socket.emit(LOGOUT, user.name);

    this.setState({ user: null });
    sessionStorage.clear();
  };

  handlePrivateMessageState = (message) => {
    this.setState(prevState => ({
      privateMessages: [...prevState.privateMessages, message]
    }));
  };

  handleSessionStorage = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if(user) {
      this.setState({ user });
    }
  };

  render() {
    const { socket, user, connectedUsers, privateMessages, communityMessages, image } = this.state;

    return (
      <div style={{height: "100vh", width: "100vw"}}>
        {!user ? (
          <LoginForm socket={socket} setUser={this.setUser} />
        ) : (
          <ChatContainer
            user={user}
            image={image}
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
