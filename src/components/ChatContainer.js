import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from "material-ui/Grid";
import { withStyles } from "material-ui/styles";

import { PRIVATE_CHAT, COMMUNITY_CHAT } from '../Events';

const styles = theme => ({
  wrapper: {
    backgroundColor: "#fff",
    height: 700,
    padding: theme.spacing.unit / 2,
    display: 'grid',
    gridGap: "5px",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridTemplateRows: "repeat(10, 1fr)",
  },
  userInfo: {
    backgroundColor: 'red',
    gridColumn: "1 / 3",
    gridRow: "1 / 2"
  },
  chatInfo: {
    backgroundColor: 'yellow',
    gridColumn: "3 / -1",
    gridRow: "1 / 2"
  },
  friends: {
    backgroundColor: 'blue',
    gridColumn: "1 / 3",
    gridRow: "2 / -1"
  },
  chat: {
    backgroundColor: 'green',
    gridColumn: "3 / -1",
    gridRow: "2 / -2"
  },
  send: {
    backgroundColor: 'aqua',
    gridColumn: "3 / -1",
    gridRow: "-2 / -1"
  }
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
      if (connectedUsers[i].name === receiver) {
        socketId = connectedUsers[i].socketId;
      }
    }

    // sending to individual socketid (private message)
    socket.emit(PRIVATE_CHAT, socketId, sender, receiver, text, date);
  };

  onReceiverChange = event => {
    this.setState({
      receiver: event.target.value
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
    const { messages } = this.props;
    const { classes } = this.props;

    return (
      <Grid container className={classes.wrapper} spacing={12}>
        <Grid item className={classes.userInfo}>1</Grid>
        <Grid item className={classes.chatInfo}>2</Grid>
        <Grid item className={classes.friends}>3</Grid>
        <Grid item className={classes.chat}>4</Grid>
        <Grid item className={classes.send}>5</Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChatContainer);
