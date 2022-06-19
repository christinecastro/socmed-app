import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./Users.css"

export default class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFriend: false,
      isRequested: false
    };
    this.addFriend = this.addFriend.bind(this)
  }

  componentDidMount(){
    this.setisFriend();
  }

  // addFriend - handle friend request button
  addFriend(){
    if (!this.state.isRequested){
      if (window.confirm("Send friend request?"))
        this.handleFriendReq()
      return
    }
    if (window.confirm("Cancel friend request?"))
      this.handleFriendReq()
  }

  // handleFriendReq - handle user friend request
  handleFriendReq(){
    const url = "http://localhost:3001/" + this.props.user._id + "/request";
    const temp = {
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
          console.log("successfully sent friend request");
          this.setRequested(body.friendreq)
        } else {
          console.log("Failed to send friend request");
        }
      });
  }

  setisFriend(){
    if (this.props.user.friends.includes(this.props.userId)){
      return this.setState({isFriend: true});
    }else{
      if (this.props.user.requests.includes(this.props.userId)){
        this.setState({ isRequested: true})
      }
    }
  }

  setRequested(req){
    this.setState({ isRequested : req})
  }

  
  render() {
    const user = this.props.user
    const Friend = () =>{
      return(
        <span className='friendLabel'> Friend</span>
      )
    }
    return (
      <div className="users">
        <div className="usersWrapper">
        <Link to={`/profile/${user._id}`}>
          <span className="userName">{user.fname} {user.lname}</span>
        </Link>
          { this.state.isFriend? <Friend/>: <img
                className="addIcon"
                id = {"add-icon"+ user._id}
                src={this.state.isRequested ? "/req.png" : "/add.png"}
                onClick={this.addFriend}
                alt=""
             />
          }
        </div>
      </div>
    )
  }
}
