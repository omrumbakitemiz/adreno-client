import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import { PRIVATE_CHAT } from '../Events';
import User from './User';
import Message from '../Models/Message';
import ChatMessage from './ChatMessage';

const styles = () => ({
  wrapper: {
    background:
      'radial-gradient(circle, rgba(211,211,211,1) 80%, rgba(0,0,0,1) 200%)',
    height: '100vh',
    padding: '1px 1px 1px 1px',
    display: 'grid',
    gridGap: '3px',
    gridTemplateColumns: 'repeat(16, 1fr)',
    gridTemplateRows: 'repeat(10, 1fr)'
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '2px 2px 8px 8px',
    background: '#C8C8C8',
    gridColumn: '1 / 4',
    gridRow: '1 / 2',
    maxHeight: 100,
    boxShadow: '1px 0 4px 0 rgba(0,0,0,0.80)',
    borderRadius: '0px 10px 10px 0px'
  },
  userImage: {
    display: 'flex',
    maxWidth: 50,
    maxHeight: 50,
    borderRadius: '25%',
    marginRight: 12
  },
  userInfoUsername: {
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: '1.2em',
    textTransform: 'capitalize',
    textShadow: '4px 4px 5px #aaa',
    margin: '8px 5px 5px 15px'
  },
  userInfoIpAddress: {
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: '0.9em',
    textTransform: 'capitalize',
    textShadow: '4px 4px 5px #aaa',
    margin: '8px 5px 5px 15px'
  },
  chatInfoWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: '#E8E8E8',
    gridColumn: '4 / -1',
    gridRow: '1 / 2',
    maxHeight: 100,
    borderRadius: '10px 0px 0px 10px',
    boxShadow: '1px 0 4px 0 rgba(0,0,0,0.80)',
    marginLeft: 2
  },
  chatInfo: {
    display: 'flex',
    flexGrow: '50'
  },
  chatInfoUsername: {
    fontFamily: 'Roboto',
    textTransform: 'capitalize',
    fontSize: '1.3em',
    margin: '10px 5px 5px 20px',
    letterSpacing: '2px',
    textShadow: '1px 1px 5px #aaa',
    fontStyle: 'italic'
  },
  chatInfoEmail: {
    fontFamily: 'Roboto',
    fontSize: '0.9em',
    margin: '0px 5px 0px 20px'
  },
  workInProgress: {
    marginLeft: 5,
    fontSize: '16px'
  },
  logout: {
    display: 'flex',
    marginTop: 20,
    marginRight: 15,
    width: 32,
    height: 32,
    opacity: '0.6'
  },
  friends: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    gridColumn: '1 / 4',
    gridRow: '2 / -1',
    boxShadow: '1px 0 4px 0 rgba(0,0,0,0.80)',
    borderRadius: '0px 10px 10px 0px'
  },
  chat: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gridColumn: '4 / -1',
    gridRow: '2 / -2',
    overflow: 'auto'
  },
  selectChatWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gridColumn: '4 / -1',
    gridRow: '2 / -2'
  },
  selectChatMessage: {
    fontFamily: 'Roboto',
    fontSize: '1.3em',
    fontStyle: 'italic',
    textShadow: '4px 4px 4px #aaa'
  },
  chatMessageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: 5
  },
  send: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    gridColumn: '4 / -1',
    gridRow: '-2 / -1',
    maxHeight: 100,
    paddingRight: 3,
    paddingLeft: 10,
    boxShadow: '-2px -2px 2px 1px rgba(0, 0, 0, 0.2)',
    borderRadius: '10px 0px 0px 10px',
    marginLeft: 2
  },
  messageText: {
    display: 'flex',
    margin: '15px 5px 15px 5px'
  },
  sendButton: {
    border: 0,
    padding: 0,
    marginLeft: 5,
    marginRight: 15,
    background: 'none',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  container: {
    border: '2px solid #dedede',
    backgroundColor: '#f1f1f1',
    borderRadius: '5px',
    padding: 10,
    margin: '10px 0'
  },
  containerDarker: {
    border: '2px solid #dedede',
    borderRadius: '5px',
    padding: 10,
    margin: '10px 0',
    borderColor: '#ccc',
    backgroundColor: '#ddd'
  },
  containerAfter: {
    content: '',
    clear: 'both',
    display: 'table'
  },
  imgAvatarLeft: {
    float: 'left',
    maxWidth: 60,
    width: '100%',
    marginRight: 20,
    borderRadius: '50%'
  },
  imgAvatarRight: {
    float: 'right',
    maxWidth: 60,
    width: '100%',
    marginRight: 20,
    borderRadius: '50%'
  },
  timeRight: {
    float: 'right',
    color: '#aaa'
  },
  timeLeft: {
    float: 'left',
    color: '#999'
  }
});

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receiver: '',
      message: '',
      selectedUser: null
    };
  }

  sendMessage = () => {
    const {
      socket,
      connectedUsers,
      user: sender,
      handlePrivateMessageState
    } = this.props;
    const { message: text, receiver } = this.state;
    const date = Math.round(+new Date() / 1000);
    let socketId = null;

    for (let i = 0; i < connectedUsers.length; i++) {
      if (connectedUsers[i].name === receiver.name) {
        socketId = connectedUsers[i].socketId;
      }
    }

    // sending to individual socketid (private message)
    socket.emit(PRIVATE_CHAT, socketId, sender, receiver, text, date);

    /**
     * handlePrivateMessageState fonksiyonu emit edilen (yayınlanan) privateMessage'ı
     * parent component olan Login componentinin state'ine eklemektedir
     * */
    const newMessage = new Message(sender, receiver, text, date);
    handlePrivateMessageState(newMessage);
  };

  onReceiverChange = receiver => {
    /*this.setState({
      receiver: receiver,
      selectedUser: receiver, // şecilmiş sohbeti renklendirmek için gerekli işlem
    });*/

    this.setState({
      receiver: receiver,
      selectedUser: receiver
    });
  };

  onMessageChange = event => {
    this.setState({
      message: event.target.value
    });
  };

  /*sendCommunityMessage = () => {
    const { socket } = this.props;
    const { message: text } = this.state;
    const date = Math.round(+new Date() / 1000);
    const { user: sender } = this.props;

    socket.emit(COMMUNITY_CHAT, sender, text, date);
  };*/

  handleEnterPress = event => {
    if (event.key === 'Enter') {
      this.sendMessage();
      this.setState({
        message: ''
      });
    }
  };

  render() {
    const {
      user,
      messages,
      classes,
      connectedUsers,
      logout,
      image
    } = this.props;
    const { receiver, message, selectedUser } = this.state;
    const tempAvatar =
      'data:image/png;base64,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';
    let conversation = [];

    messages.forEach(message => {
      if (
        (message.sender.name === user.name &&
          message.receiver.name === receiver.name) ||
        (message.sender.name === receiver.name &&
          message.receiver.name === user.name)
      ) {
        conversation.push(message);
      }
    });

    return (
      <Grid container className={classes.wrapper} spacing={0}>
        <Grid item className={classes.userInfo}>
          <div>
            <img
              className={classes.userImage}
              src={image ? image : tempAvatar}
              alt="Avatar"
            />
          </div>
          <div>
            <p className={classes.userInfoUsername}>{user.name}</p>
            <p className={classes.userInfoIpAddress}>IP: {user.ipAddress}</p>
          </div>
        </Grid>
        <Grid item className={classes.chatInfoWrapper}>
          <div className={classes.chatInfo}>
            <div>
              {selectedUser ? (
                <div>
                  <p className={classes.chatInfoUsername}>{receiver.name}</p>
                  <p className={classes.chatInfoEmail}>
                    Last seen:
                    <span
                      className={classes.workInProgress}
                      role="img"
                      aria-label="Construction"
                    >
                      🚧 🚧 🚧 🚧
                    </span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          <span className={classes.logout} onClick={logout}>
            <svg>
              <path d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z" />
            </svg>
          </span>
        </Grid>
        <Grid item className={classes.friends}>
          {connectedUsers.map((connectedUser, index) => {
            if (connectedUser.name !== user.name) {
              return selectedUser ? (
                <User
                  user={connectedUser}
                  selected={selectedUser.name === connectedUser.name}
                  onReceiverChange={this.onReceiverChange}
                  key={index}
                />
              ) : (
                <User
                  user={connectedUser}
                  selected={false}
                  onReceiverChange={this.onReceiverChange}
                  key={index}
                />
              );
            } else {
              return null;
            }
          })}
        </Grid>
        {selectedUser ? (
          <Grid item className={classes.chat} id="chatMessages">
            {conversation.map((message, index) => {
              let theme = message.sender.name === user.name ? 'light' : 'dark';

              return (
                <ChatMessage theme={theme} key={index} message={message} />
              );
            })}
          </Grid>
        ) : (
          <Grid item className={classes.selectChatWrapper}>
            <p className={classes.selectChatMessage}>
              Please select chat from left section
            </p>
          </Grid>
        )}
        <Grid item className={classes.send}>
          {selectedUser ? (
            <TextField
              className={classes.messageText}
              onKeyPress={this.handleEnterPress}
              placeholder="Type a message"
              onChange={this.onMessageChange}
              value={message}
              fullWidth
            />
          ) : (
            <TextField
              className={classes.messageText}
              placeholder="Type a message"
              disabled
              fullWidth
            />
          )}
          <button className={classes.sendButton} onClick={this.sendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#263238"
                fillOpacity=".45"
                d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
              />
            </svg>
          </button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChatContainer);
