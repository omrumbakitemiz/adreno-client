import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from "material-ui/Grid";

import Dropzone from 'react-dropzone';

import { withStyles } from "material-ui/styles";

import { VERIFY_USER } from '../Events';

const styles = theme => ({
  wrapper: {
    background: "radial-gradient(circle, rgba(211,211,211,1) 0%, rgba(0,0,0,1) 500%)",
    minHeight: "100vh"
  },
  dropzoneContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 125
  },
  dropzone: {
    marginTop: theme.spacing.unit,
    height: 200,
    width: 150,
    background: "#D8D8D8",
    borderRadius: 8,
    boxShadow: "5px 5px 4px 0 rgba(0,0,0,0.50)",
    alignItems: "center",
    display: "flex"
  },
  dropzoneText: {
    textAlign: "center"
  },
  picture: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-around",
    paddingLeft: 118
  },
  username: {
    maxWidth: 300,
    height: "100%",
    justifyContent: "space-around",
    fontSize: 36
  },
  email: {
    maxWidth: 300,
    height: "100%",
    justifyContent: "space-around",
    fontSize: 36
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  login: {
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 1,
    height: 50,
    width: 150,
    borderRadius: 8,
    boxShadow: "5px 5px 4px 0 rgba(0,0,0,0.50)"
  },
  error: {
    display: "flex",
    justifyContent: "center",
    color: "red",
    fontFamily: "Roboto",
    fontSize: 24
  }
});

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      email: '',
      error: '',
      image: ''
    };
  }

  setUser = ({ user, isUser }) => {
    const { image } = this.state;
    if (isUser) {
      this.setError('User name taken :(');
    }
    else {
      this.props.setUser(user, image);
      this.setError('');
    }
  };

  setError = error => {
    this.setState({ error });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { socket } = this.props;
    const { nickname } = this.state;
    let ipAddress = null;

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const ip = await response.json();
      ipAddress = ip.ip; // api'den dönen cevap response = { ip: 1234421 } şeklinde olduğu için ip.ip işlemi uygulandı.

      socket.emit(VERIFY_USER, nickname, ipAddress, this.setUser);
    }
    catch (e) {
      console.log('hata:', e);
      ipAddress = '0.0.0.0';

      socket.emit(VERIFY_USER, nickname, ipAddress, this.setUser);
    }
  };

  onUsernameChange = event => {
    this.setState({
      nickname: event.target.value
    });
  };

  onEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  };

  onDrop = files => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileBase64 = reader.result;

        this.setState({ image: fileBase64 });
      };

      reader.readAsDataURL(file);
    });
  };

  render() {
    const { error, image } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid className={classes.dropzoneContainer} item xs={12}>
              <Dropzone className={classes.dropzone} accept="image/png, image/jpg, image/jpeg" onDrop={this.onDrop}>
                {
                  image ? <img className={classes.picture} src={image} alt="Avatar"/> :
                  <span className={classes.dropzoneText}>Profil Resminizi Buraya Sürükleyin</span>
                }
              </Dropzone>
            </Grid>
            <Grid className={classes.inputContainer} container spacing={24}>
              <Grid className={classes.username} item xs={6}>
                <TextField onChange={this.onUsernameChange} label="Username" placeholder="Please enter a username" />
              </Grid>
              <Grid className={classes.email} item xs={6}>
                <TextField onChange={this.onEmailChange} label="E-mail" placeholder="Please enter an e-mail" />
              </Grid>
            </Grid>
            <Grid className={classes.loginContainer} item xs={12}>
              <Button className={classes.login} type="submit" variant="raised" color="primary">Login</Button>
            </Grid>
            <Grid className={classes.error} item xs={12}>
              <p>{error ? error : null}</p>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(LoginForm);
