import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';

import moment from 'moment';

const styles = theme => ({
  messageWrapperLight: {
    display: "flex",
    justifyContent: "space-between",
    flexFlow: "row wrap",
    alignItems: "center",
    width: "99%",
    padding: "8px 0px 8px 0px",
    border: "1px solid #4e4c4c",
    borderRadius: "16px",
    margin: "4px -5px 4px 1px",
    color: "#000",
    minHeight: 20,
    boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)"
  },
  messageWrapperDark: {
    display: "flex",
    justifyContent: "space-between",
    flexFlow: "row wrap",
    alignItems: "center",
    width: "99%",
    padding: "8px 0px 8px 0px",
    border: "1px solid #ddd",
    borderRadius: "16px",
    margin: "4px -5px 4px 1px",
    color: "#303f9f",
    minHeight: 20,
    boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)"
  },
  messageText: {
    fontFamily: "Roboto",
    fontSize: "14px",
    lineHeight: "150%",
    marginLeft: 15,
  },
  messageTime: {
    fontFamily: "Roboto",
    lineHeight: "150%",
    fontSize: "12px",
    textAlign: "right",
    marginRight: 15
  }
});

class ChatMessage extends Component {
  constructor(props) {
    super(props);

    moment.locale('tr');
    moment().format('LT');
  }

  render(){
    const { classes, message, theme } = this.props;

    const time = moment.unix(message.date).format("HH:mm:ss");

    return(
      <div className={theme === 'light' ? classes.messageWrapperLight : classes.messageWrapperDark}>
        <div className={classes.messageText}>
          {message.text}
        </div>
        <div className={classes.messageTime}>
          {time}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ChatMessage);
