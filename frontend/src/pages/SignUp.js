import React, { Component } from 'react'
import "./SignUp.css"

export default class SignUp extends Component {
  
  constructor(props){
    super(props);
    this.state={
        pw1:"",
        pw2:"",
        pwMatch: null,
        pwValid: null
    }
    this.inputChange=this.inputChange.bind(this)
    this.validate=this.validate.bind(this)
    }
  
  // inputChange - handles input change
  inputChange(e){
    this.setState({[e.target.name]: e.target.value})
  }

  // validate - validates form input
  validate(e) {
    e.preventDefault();

    this.setState({ samePassword: false });
        const {pw1, pw2}= this.state
  
        const errA = pw1.match(/[0-9]/) // at least one digit
        const errB = pw1.match(/[a-z]/) // at least one lowercase letter
        const errC = pw1.match(/[A-Z]/) // at least one uppercase letter

        // Password not empty
        if (pw1.length>=8 && (errA&&errB&&errC) != null){ // Password has 8 characters and matched the requirements
            this.setState({pwValid: true})
            console.log("Password is valid");
            if (pw1===pw2){   // Password Match
                this.setState({pwMatch: true})
                alert("Signing Up...") // User can Sign Up
                this.signup();
            }else // Password do not Match
                this.setState({pwMatch: false})
        }else if(pw1!==""){ // Password do not follow requirements
            this.setState({pwValid: false})
            console.log("Invalid Password");
        }    
  }

  // signup - signup user data
  signup(){
    const user = {
      fname: document.getElementById("s-fname").value.trim(),
      lname: document.getElementById("s-lname").value.trim(),
      email: document.getElementById("s-email").value.trim(),
      password: document.getElementById("s-password").value.trim()
    }

    // send a POST request for user signup
    fetch(
      "http://localhost:3001/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) { 
          alert("Successfully saved user"); 
          //clear form
          document.getElementById("signup-form").reset()
          this.setState({fname: "", lname:"", email:""})
        }
        else { alert("Failed to save user - Existing email"); }
      });
      
  }

  render() {
    const {pw1} = this.state
    const enabled = pw1.length>8; // condition for enabling input for repeat password

      return (
        <div className="sl-container">
          <a href="/" className="close-btn">
            <i className="material-icons">
              clear
            </i>
          </a> 
          <div className="card">
            <h1>Sign Up</h1>
            <form id="signup-form" className="card-form" onSubmit={this.validate}>
              <label>First Name</label>
              <input 
                id="s-fname"
                name="fname"
                type="text"
                value={this.state.fname}
                onChange={this.inputChange}
                required
              />
              <br/>
              <label>Last Name</label>
              <input 
                id="s-lname"
                name="lname"
                type="text"
                value={this.state.lname}
                onChange={this.inputChange}
                required
              />
              <br/>
              <label>Email</label>
              <input
                id="s-email"
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.inputChange}
                required
              />
              <br/>
              <label>Password</label>
              <input
                id="s-password"
                className={this.state.pwValid===false ? "invalid":""}
                name="pw1"
                type="password"
                onChange={this.inputChange}
                minLength="8"
                required
              />
              <p className={ this.state.pwValid===false ? "show":"hide"}>
                Password should have at least 1 number, 1 lowercase letter,and 1 uppercase letter
              </p>
              <br/>
              <label>Repeat Password</label>
              <input
                className={this.state.pwMatch===false ? "invalid":""}
                name="pw2"
                type="password"
                onChange={this.inputChange}
                disabled={!enabled}
              />
              <p className={this.state.pwMatch===false ? "show":"hide"}> Passwords should match</p>
              <br/> 
              <button className="signup-btn signup-page" type="submit">Sign Up</button>
            </form>
          </div>
          <br/>
          <div className="card signup">
            <label>Already have an account? </label>
            <a  className="card-link" href="/log-in">Log in</a>
          </div>
        </div>
    )
  }
}