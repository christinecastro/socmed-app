import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import Cookies from "universal-cookie"
import LeftSideBar from "../components/leftSideBar/LeftSideBar"
import Navbar from "../components/navbar/Navbar"
import Feed from "../components/feed/Feed"
import "./Search.css"

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      userId: localStorage.getItem("username"),
      user :[],
      users: [1]
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
      //search user by name in the input
      this.search();
  }

  componentDidUpdate(prevProps){
    if (prevProps.match.params.name !== this.props.match.params.name){
      window.location.reload()
    }
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

   // search - searches users by name
  search(){
    const searchInput = this.props.match.params.name
    if (searchInput===(""||null)) return alert("no users");
    console.log(searchInput);
    // Send POST request to search users by name 
    const params = new URLSearchParams([
      ['name',searchInput]
    ]);
 
    const url = "http://localhost:3001/search/?"+params.toString();
    const temp = {
      id : this.state.userId
    }
    fetch(url,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(temp)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          this.setFound(body.users);
        } else {
          this.setFound(1)
        }
      });
  }

  setUser(user){
    this.setState({user:user});
  }

  setFound(users){
    this.setState({found:users});
  }
  

  render() {
    
    if (!this.state.checkedIfLoggedIn) {
      // delay redirect/render
      return <div></div>
    }

    else {
      if (localStorage.getItem("username")) {
        // render the page
        return (
          <div className="search-container">
            <Navbar userId={this.state.userId}/>
            <div className="search-main">
              <LeftSideBar userId={this.state.userId} func={this.logout}/>
              <Feed userId={this.state.userId} users={this.state.found} sinput={this.props.match.params.name}/>
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
