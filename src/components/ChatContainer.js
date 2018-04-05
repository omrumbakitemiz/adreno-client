import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import { PRIVATE_CHAT } from '../Events';

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
    const date = Math.round(+new Date()/1000);
    let socketId = null;

    // TODO: state içindeki username değişkeni kullanılarak connectedUsers içinde socket id bulunacak
    // for(let user in connectedUsers) {
    //   if(user.name === receiver) {
    //     socketId = user.socketId;
    //   }
    // }

    for(let i = 0; i < connectedUsers.length; i++) {
      if(connectedUsers[i].name === receiver) {
        socketId = connectedUsers[i].socketId;
      }
    }

    console.log('socketId: ', socketId);

    // sending to individual socketid (private message)
    socket.emit(PRIVATE_CHAT, socketId, sender, receiver, text, date);
  };

  onReceiverChange = (event) => {
    this.setState({
      receiver: event.target.value
    });
  };

  onMessageChange = (event) => {
    this.setState({
      message: event.target.value
    });
  }

  render() {
    const style = {
      border: '1px solid red',
      display: 'grid',
      gridTemplateColumns: '175px 175px',
      width: '400px',
      height: '400px',
      margin: 30
    };

    const textFieldStyle = {
      marginTop: 10,
      marginLeft: 20,
      width: 150,
      height: '100%',
      color: 'red'
    };

    return (
      <div style={style}>
        <TextField
          id="receiver"
          label="Message Receiver"
          placeholder="Enter username"
          style={textFieldStyle}
          onChange={this.onReceiverChange} />

        <TextField
          id="message"
          label="Message"
          placeholder="Enter message"
          style={textFieldStyle}
          onChange={this.onMessageChange} />

        <div style={{ width: "100", height: "20"}}>
          <Button variant="raised" color="primary" onClick={this.sendMessage}>
            Send Message
          </Button>
        </div>

        <div>
          <Paper style={{backgroundColor: "#1abc9c", paddingTop: 16, paddingBottom: 16,
            paddingLeft: 5, paddingRight: 5}} elevation={10} >
            <Typography variant="title">
              Messages
            </Typography>
            <Typography component="p">
              No message :(
            </Typography>
          </Paper>
        </div>
      </div>
    );
  }
}

export default ChatContainer;
