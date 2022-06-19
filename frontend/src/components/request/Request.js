import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./Request.css"

export default class Request extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRequested: true
    };
    this.handleRequest = this.handleRequest.bind(this)
  }

  // handleRequest - handle user's response to friend request
  handleRequest(e){
    const url = "http://localhost:3001/" + this.props.user._id + "/friend";
    const btn = e.target.id
    const temp = {
      isAccept: (btn ==="accept-btn")? 1: 0,
      id : this.props.userId
    };

    fetch(url,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(temp)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          console.log("successful");
          this.setState({isRequested: false})
          window.location.reload()
        } else {
          console.log("Failed to send friend request");
        }
      });
  }

  
  render() {
    const user = this.props.user

    const ReqBlock = () =>{
      return(
        <li className="sidebarRequest">
        <div className="sidebarRequestWrapper">
          <div className="sidebarRequestNameWrapper">
            <span className="sidebarRequestName">
              <Link to={`/profile/${user._id}`}>
                <span className="postUsername">{user.fname +" " + user.lname}</span>
              </Link>
            </span>
          </div>
          <div className="sidebarRequestBtn">
            <button id="accept-btn" className="acceptBtn" onClick={this.handleRequest}>Accept</button>
            <button id="reject-btn" className="rejectBtn" onClick={this.handleRequest}>Reject</button>
          </div>
        </div>
      </li>
      )
    }
    return (
      <>
      { this.state.isRequested? <ReqBlock/> : null }
      </>
    )
  }
}
