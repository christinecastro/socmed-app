import React, { Component } from 'react'
import Friends from '../friends/Friends';
import "./LeftSideBar.css"

export default class LeftSideBar extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      friends:[]
    }
    this.getFriends = this.getFriends.bind(this);
  }

  componentDidMount(){
    this.getFriends();
  }

  // getFriends - fetch user's friends
  getFriends(){
    const url = "http://localhost:3001/friends";
    const temp = {
      id : this.props.userId
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
          console.log("user friends fetched")
          this.setFriends(body.FriendList)
        } else {
          console.log("user friends not fetched")
        }
      });
  }

  setFriends = friends => {
    this.setState({friends:friends})
  }

  
  render() {
    const FriendsList = this.state.friends;
    return (
      <div className='sidebar'>
        <div className='sidebarWrapper'>
          <div className='sidebarFriends'>
            <h4>Friends</h4>
            <hr className="sidebarHr" />
            <ul className="sidebarFriendList">
              {FriendsList.map(u => (
                <Friends key={u._id} user={u}/>
              ))}
            </ul>
          </div>
          <div className='sidebarLogout'> 
            <button id="logout" className="logoutBtn" onClick={this.props.func}>Log Out</button> 
          </div>
        </div>
      </div>
    )
  }
}
