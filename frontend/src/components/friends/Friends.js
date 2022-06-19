import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./Friends.css"

export default class Friends extends Component {
  
  render() {
    const user = this.props.user
    return (
      <li className="sidebarFriend">
          <img className="sidebarFriendImg" src="" alt="" />
          <span className="sidebarFriendName">
            <Link to={`/profile/${user._id}`}>
                {user.fname +" " + user.lname}
            </Link> 
          </span>
      </li>
    )
  }
}


