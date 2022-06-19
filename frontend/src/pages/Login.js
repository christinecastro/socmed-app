import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import Cookies from "universal-cookie"

export default class Login extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        isLoggedIn: null
      }
  
      this.login = this.login.bind(this);
    }

    componentDidMount() {
      // Send POST request to check if user is logged in
      fetch("http://localhost:3001/checkifloggedin",
        {
          method: "POST",
          credentials: "include"
        })
        .then(response => response.json())
        .then(body => {
          if (body.isLoggedIn) {
            this.setState({ isLoggedIn: true});
          } else {
            this.setState({ isLoggedIn: false });
          }
        });
    }
    
    // login - login user
    login(e) {
      e.preventDefault();
      const credentials = {
        email: document.getElementById("l-email").value,
        password: document.getElementById("l-password").value
      }
  
      // Send a POST request
      fetch(
        "http://localhost:3001/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(body => {
          if (!body.success) { alert("Failed to log in. Please check email/password"); this.setState({ isLoggedIn: false});}
          else {
            // successful log in. store the token as a cookie
            const cookies = new Cookies();
            cookies.set(
              "authToken",
              body.token,
              {
                path: "localhost:3001/",
                age: 60*60,
                sameSite: "lax"
              });
  
              localStorage.setItem("username", body.username);
              alert("Successfully logged in");
              this.setState({ isLoggedIn: true});
          }
        })
    }
  
    render() {
      if (localStorage.getItem("username")) {
        return(
          <div>
            <Redirect to="/feed"/>;
          </div>
        )
      }else{
        return (
        <div className="sl-container">
            <a href="/" className="close-btn">
              <i className="material-icons">
                clear
              </i>
            </a> 
            <div className="card">
              <h1>Log In</h1>
              <div>
                <form className="card-form" onSubmit={this.login}>
                  <label>Email</label>
                  <input type="email" id="l-email"/>&nbsp;
                  <br/>
                  <label>Password</label>
                  <input type="password" id="l-password"/>&nbsp;
                  <br/>
                  <button className="login-btn login-page" type="submit" >
                    Log In
                  </button>
                </form>
              </div>
            </div>
            <br/>
            <div className="card signup">
              <label>No account yet?</label>
              <a className="card-link" href="/sign-up">Sign up Now</a>
            </div>
        </div>
        )
      }
    }
  }