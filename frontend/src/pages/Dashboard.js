import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import Cookies from "universal-cookie"
import Feed from "../components/feed/Feed"
import LeftSideBar from "../components/leftSideBar/LeftSideBar"
import Navbar from "../components/navbar/Navbar"
import RightSideBar from "../components/rightSideBar/RightSideBar"
import "./Dashboard.css"

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      userId: localStorage.getItem("username"),
      user :[]
    }
    this.logout = this.logout.bind(this);
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
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: true, userId: localStorage.getItem("username")});
          this.setUser(body.user);
        } else {
          this.setState({ checkedIfLoggedIn: true, isLoggedIn: false });
        }
      });
  }

  // logout - logouts user
  logout(e){
    e.preventDefault();

    // Delete cookie with authToken
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Delete username in local storage
    localStorage.removeItem("username");
    this.setState({ isLoggedIn: false });
  }

  setUser(user){
    this.setState({user:user});
  }


  render() {
    if (!this.state.checkedIfLoggedIn) {
      // delay redirect/render
      return (<div></div>)
    }

    else {
      if (localStorage.getItem("username")) {
        // render the page
        return (
          <div className="dashboard-container">
            <Navbar userId={this.state.userId}/>
            <div className="dashboard-main">
              <LeftSideBar userId={this.state.userId} func={this.logout} />
              <Feed  user={this.state.user} userId={this.state.userId}/>
              <RightSideBar userId={this.state.userId}/>
            </div>
          </div> 
        )
      }

      else {
        // redirect
        return <Redirect to="/" />
      }
    }
  }
}