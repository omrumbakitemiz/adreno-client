import React, { Component } from 'react';

import { Button } from 'reactstrap';

import './styles/LoginForm.css';

import { VERIFY_USER } from '../Events';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      error: ''
    };
  }

  setUser = ({ user, isUser }) => {
    console.log(user, isUser);
    if (isUser) {
      this.setError('User name taken');
    } else {
      this.props.setUser(user);
      this.setError('');
    }
  };

  setError = error => {
    this.setState({ error });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { socket } = this.props;
    const { nickname } = this.state;
    let ipAddress = null;

    // fetch('https://api.ipify.org?format=json')
    //   .then(response => response.json())
    //   .then(ip => {
    //     if (ip != null) {
    //       ipAddress = ip;
    //     }
    //   })

    const getIp = async () => {
      const response = await fetch('https://api.ipify.org?format=json');
      const ip = await response.json();
      ipAddress = ip.ip; // api'den dönen cevap response = { ip: 1234421 } şeklinde olduğu için ip.ip işlemi uygulandı.

      socket.emit(VERIFY_USER, nickname, ipAddress, this.setUser);
    };

    getIp();
  };

  handleChange = e => {
    this.setState({ nickname: e.target.value });
  };

  render() {
    const { nickname, error } = this.state;

    return (
      <div className="login">
        <form onSubmit={this.handleSubmit} className="login-form">
          <label htmlFor="nickname">
            <h2>Nickname ?</h2>
          </label>

          <input
            ref={input => {
              this.textInput = input;
            }}
            type="text"
            id="nickname"
            value={nickname}
            onChange={this.handleChange}
            placeholder="Username :)"
          />
          <div className="error">{error ? error : null}</div>
          <Button color="primary">Login</Button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
