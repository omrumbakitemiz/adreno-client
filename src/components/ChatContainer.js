import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";

import { PRIVATE_CHAT, COMMUNITY_CHAT } from '../Events';
import User from './User';

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
    margin: 5
  },
  chatMessageText: {

  },
  chatMessageDate: {

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
    marginLeft: 15,
    marginRight: 10
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
  
});

class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receiver: '',
      message: ''
    };
  }

  sendMessage = () => {
    console.log('sending message please wait :)');

    const { socket, connectedUsers, user: sender } = this.props;
    const { message: text, receiver } = this.state;
    const date = Math.round(+new Date() / 1000);
    let socketId = null;

    // TODO: state içindeki username değişkeni kullanılarak connectedUsers içinde socket id bulunacak
    // for(let user in connectedUsers) {
    //   if(user.name === receiver) {
    //     socketId = user.socketId;
    //   }
    // }

    for (let i = 0; i < connectedUsers.length; i++) {
      if (connectedUsers[i].name === receiver.name) {
        socketId = connectedUsers[i].socketId;
      }
    }

    // sending to individual socketid (private message)
    socket.emit(PRIVATE_CHAT, socketId, sender, receiver, text, date);
  };

  onReceiverChange = receiver => {
    this.setState({
      receiver: receiver
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

  render() {
    const { user, messages, classes, connectedUsers, logout } = this.props;
    const { receiver } = this.state;
    let tempMessages = [];

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
          {connectedUsers.map((user, index) => {
            return (
              <User user={user} onReceiverChange={this.onReceiverChange} key={index}/>
            )
          })}
        </Grid>
        <Grid item className={classes.chat}>
          {/*{
            messages.map((message, index) => {
              return(
                <div className={classes.chatMessageWrapper} key={index}>
                  <p className={classes.chatMessageText}>
                    Message: {message.text}
                  </p>
                  <p className={classes.chatMessageDate}>
                    Date: {message.date}
                  </p>
                </div>
              )
            })
          }*/}
          {/*<p className={classes.chatMessageWrapper}>
            <h4 className={classes.chatMessageText}>
              Message: mesaj1
            </h4>
            <h5 className={classes.chatMessageDate}>
              Date: date1
            </h5>
          </p>
          <p className={classes.chatMessageWrapper}>
            <h4 className={classes.chatMessageText}>
              Message: mesaj2
            </h4>
            <h5 className={classes.chatMessageDate}>
              Date: date2
            </h5>
          </p>*/}

          {/*receiver ve privateMessages içindeki name eşleşiyorsa
            message render edilecek
          */}

          {
            messages.forEach((message) => {
              if( message.sender.name === receiver.name ){
                console.log('eşleşme var');
                tempMessages.push(message);
              }
              else {
                // TODO: debug amaçlı yazıldı silinecek
                console.log('eşleşme yok');
                console.log(message.sender.name);
                console.log(receiver.name);
              }
            })
          }

          {
            tempMessages.map((message, index) => {
              return(
                <div className={classes.chatMessageWrapper} key={index}>
                  <p className={classes.chatMessageText}>
                    Message: {message.text}
                  </p>
                  <p className={classes.chatMessageDate}>
                    Date: {message.date}
                  </p>
                </div>
              )
            })
          }
        </Grid>
        <Grid item className={classes.send}>
          <TextField className={classes.messageText} placeholder="Type a message" fullWidth onChange={this.onMessageChange}/>
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
