import React, { Component } from 'react';

import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";

const styles = theme => ({
  wrapper: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "20px 15px 20px 15px",
  },
  picture: {
    display: "flex",
  },
  avatar: {
    maxWidth: 50,
    maxHeight: 50,
    borderRadius: "50%",
    marginRight: 20
  },
  username: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
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
    const { classes, user } = this.props;

    return(
      <Grid container className={classes.wrapper} spacing={16}>
        <Grid onClick={this.handleReceiverChange} item className={classes.picture}>
          <img className={classes.avatar} src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" />
          <span className={classes.username}>
            {user.name}
          </span>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(User);
