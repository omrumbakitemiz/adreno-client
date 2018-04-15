import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";

import moment from 'moment';

import { PRIVATE_CHAT, COMMUNITY_CHAT } from '../Events';
import User from './User';
import Message from '../Models/Message';

const styles = theme => ({
  wrapper: {
    backgroundColor: "#fff",
    height: 700,
    padding: theme.spacing.unit / 2,
    display: 'grid',
    gridGap: "5px",
    gridTemplateColumns: "repeat(16, 1fr)",
    gridTemplateRows: "repeat(10, 1fr)",
  },
  userInfo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle, rgba(211,211,211,1) 0%, rgba(0,0,0,1) 500%)",
    gridColumn: "1 / 4",
    gridRow: "1 / 2",
    maxHeight: 100
  },
  chatInfoWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: '#E8E8E8',
    gridColumn: "4 / -1",
    gridRow: "1 / 2",
    maxHeight: 100
  },
  chatInfo: {
    display: "flex",
    flexGrow: "50",
  },
  logout: {
    display: "flex",
    marginTop: 32,
    marginRight: 20,
    width: 32,
    height: 30,
    opacity: "0.6"
  },
  friends: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: '#E8E8E8',
    gridColumn: "1 / 4",
    gridRow: "2 / -1"
  },
  chat: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    background: "radial-gradient(circle, rgba(211,211,211,1) 0%, rgba(0,0,0,1) 500%)",
    gridColumn: "4 / -1",
    gridRow: "2 / -2"
  },
  chatMessageWrapper: {
    display: "flex",
    flexDirection: "column",
    margin: 5
  },
  send: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: '#E8E8E8',
    gridColumn: "4 / -1",
    gridRow: "-2 / -1",
    maxHeight: 100,
    paddingRight: 3
  },
  messageText : {
    display: "flex",
    margin: "15px 5px 15px 5px"
  },
  sendButton: {
    border: 0,
    padding: 0,
    marginLeft: 5,
    marginRight: 15,
    background: "none",
    outline: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  container: {
    border: "2px solid #dedede",
    backgroundColor: "#f1f1f1",
    borderRadius: "5px",
    padding: 10,
    margin: "10px 0"
  },
  containerDarker: {
    border: "2px solid #dedede",
    borderRadius: "5px",
    padding: 10,
    margin: "10px 0",
    borderColor: "#ccc",
    backgroundColor: "#ddd"
  },
  containerAfter: {
    content: "",
    clear: "both",
    display: "table"
  },
  imgAvatarLeft: {
    float: "left",
    maxWidth: 60,
    width: "100%",
    marginRight: 20,
    borderRadius: "50%",
  },
  imgAvatarRight: {
    float: "right",
    maxWidth: 60,
    width: "100%",
    marginRight: 20,
    borderRadius: "50%",
  },
  timeRight: {
    float: "right",
    color: "#aaa"
  },
  timeLeft: {
    float: "left",
    color: "#999"
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

    moment.locale('tr');
    moment().format('LT');
  }

  sendMessage = () => {
    const { socket, connectedUsers, user: sender, handlePrivateMessageState } = this.props;
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
    this.setState({
      receiver: receiver,
      selectedUser: receiver // şecilmiş sohbeti renklendirmek için gerekli işlem
    });
  };

  onMessageChange = event => {
    this.setState({
      message: event.target.value
    });
  };

  sendCommunityMessage = () => {
    const { socket } = this.props;
    const { message: text } = this.state;
    const date = Math.round(+new Date() / 1000);
    const { user: sender } = this.props;

    socket.emit(COMMUNITY_CHAT, sender, text, date);
  };

  handleEnterPress = event => {
    if(event.key === 'Enter') {
      this.sendMessage();
      this.setState({
        message: ''
      })
    }
  };

  render() {
    const { user, messages, classes, connectedUsers, logout } = this.props;
    const { receiver, message, selectedUser } = this.state;
    let conversation = [];

    messages.forEach((message) => {
      if((message.sender.name === user.name && message.receiver.name === receiver.name)
        || (message.sender.name === receiver.name && message.receiver.name === user.name)) {
        conversation.push(message);
      }
    });

    return (
      <Grid container className={classes.wrapper} spacing={16}>
        <Grid item className={classes.userInfo}>
          <div>
            <p>{user.name}</p>
            <p>IP: {user.ipAddress}</p>
          </div>
        </Grid>
        <Grid item className={classes.chatInfoWrapper}>
          <div className={classes.chatInfo}>
            user
          </div>
          <span className={classes.logout} onClick={logout}>
            <svg style={{width: 32}}>
              <path d="M24 20v-4h-10v-4h10v-4l6 6zM22 18v8h-10v6l-12-6v-26h22v10h-2v-8h-16l8 4v18h8v-6z" />
            </svg>
          </span>
        </Grid>
        <Grid item className={classes.friends}>
          {connectedUsers.map((connectedUser, index) => {
            if(connectedUser.name !== user.name) {
              return (
                selectedUser ?
                <User user={connectedUser} selected={selectedUser.name === connectedUser.name}
                      onReceiverChange={this.onReceiverChange} key={index}/>
                  :
                <User user={connectedUser} selected={false} onReceiverChange={this.onReceiverChange} key={index}/>
              )
            }
          })}
        </Grid>
        <Grid item className={classes.chat}>
          {conversation.map((message, index) => {
            let theme = (message.sender.name  === user.name) ? 'light' : 'dark';

            const timestamp = moment.unix(message.date);

            return(
              <div key={index}>
                { theme === 'light' ?
                  <div className={classes.chatMessageWrapper}>
                    <div className={classes.container}>
                      <p className={classes.messageText}>{message.text}</p>
                      <span className={classes.timeRight}>
                        {timestamp.format("HH:mm")}
                      </span>
                    </div>
                  </div> :
                  <div className={classes.chatMessageWrapper}>
                    <div className={classes.containerDarker}>
                      <p className={classes.messageText}>{message.text}</p>
                      <span className={classes.timeLeft}>
                        {timestamp.format("HH:mm")}
                      </span>
                    </div>
                  </div>
                }
              </div>
            )
            })
          }
        </Grid>
        <Grid item className={classes.send}>
          <TextField className={classes.messageText} onKeyPress={this.handleEnterPress} placeholder="Type a message" onChange={this.onMessageChange} value={message} fullWidth/>
          <button className={classes.sendButton} onClick={this.sendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#263238" fillOpacity=".45" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
            </svg>
          </button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChatContainer);
