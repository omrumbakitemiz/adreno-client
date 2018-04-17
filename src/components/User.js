import React, { Component } from 'react';

import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";

const styles = theme => ({
  wrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px 0px 10px 15px",
  },
  picture: {
    display: "flex",
  },
  avatar: {
    maxWidth: 50,
    maxHeight: 50,
    borderRadius: "25%",
    marginRight: 20
  },
  avatarSelected: {
    maxWidth: 50,
    maxHeight: 50,
    borderRadius: "25%",
    marginRight: 20,
    boxShadow: "4px 4px 5px #aaa"
  },
  username: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "capitalize",
    color: "black"
  },
  usernameSelected: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "red",
    textShadow: '3px 3px 5px #aaa',
    textTransform: "capitalize",
    fontSize: "1.3em",
  }
});

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };
  }

  handleReceiverChange = () => {
    this.props.onReceiverChange(this.props.user);
  };

  render() {
    const { classes, user, selected } = this.props;

    return(
      <Grid container onClick={this.handleReceiverChange} className={classes.wrapper} spacing={16}>
        <Grid item className={classes.picture}>
          <img className={selected ? classes.avatarSelected : classes.avatar} src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" />
          <span className={selected ? classes.usernameSelected : classes.username}>
            {user.name}
          </span>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(User);
