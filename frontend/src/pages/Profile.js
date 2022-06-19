import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import Cookies from "universal-cookie"
import LeftSideBar from "../components/leftSideBar/LeftSideBar"
import Navbar from "../components/navbar/Navbar"
import "./Profile.css"

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedIfLoggedIn: false,
      isLoggedIn: null,
      isOwn: false,
      isFriend: false,
      isRequested: false,
      userId: localStorage.getItem("username"),
      user :[],
      userProfile:[],
      name:null
    };
    this.logout = this.logout.bind(this);
    this.setUser = this.setUser.bind(this)
    this.setisFriend = this.setisFriend.bind(this)
    this.getUserProfile = this.getUserProfile.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.unFriend = this.unFriend.bind(this)
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
     this.getUserProfile();
  }

  componentDidUpdate(prevProps){
    if (prevProps.match.params.id !== this.props.match.params.id){
      this.getUserProfile()
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

  // getUserProfile - fetch user's profile data
  getUserProfile(){
    const user = this.state.user;
    const userId = this.props.match.params.id
    if( user._id === userId){
      this.setuserProfile(user)
      return
    }
    const url = "http://localhost:3001/profile/" + userId;
    fetch(url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          console.log("successfully fetched user's profile");
          this.setuserProfile(body.user)
        } else {
          console.log("Failed to fetch user's profile");
        }
      });
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

  // addFriend - handle unfriend button
  unFriend(){
    if (window.confirm(`Do you want to unfriend ${this.state.name}?`))
      this.handleUnfriend()
  }

  // handleFriendReq - handle user friend request
  handleFriendReq(){
    const url = "http://localhost:3001/" + this.props.match.params.id + "/request";
    const temp = {
      id : this.state.userId
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

  // handleUnfriend - handle user unfriend
  handleUnfriend(){
    const url = "http://localhost:3001/" + this.props.match.params.id + "/friend";
    const temp = {
      id : this.state.userId
    };
    fetch(url,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(temp)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          console.log("successfully unfriended user");
          this.setState({ isFriend : false})
        } else {
          console.log("Failed to ufriend user");
        }
      });
  }

  setUser(user){
    this.setState({user:user});
  }

  setuserProfile(profile){
    this.setState({userProfile : profile});
    this.setState({name:`${this.state.userProfile.fname} ${this.state.userProfile.lname}`}) // set full name
    this.setisFriend();
  }

  setisFriend(){
    if(this.state.userProfile._id === this.state.userId ){ // if user's own profile
      this.setState({isOwn: true});
      this.setState({isFriend: false});
    }else if (this.state.userProfile.friends!==[] && this.state.userProfile.friends.includes(this.state.userId)){ // if user's friends' profile
        this.setState({isFriend: true});
    }else{
      if (this.state.userProfile!==[] && this.state.userProfile.requests.includes(this.state.userId)){ // if not user's  friends' profile
        this.setState({ isRequested: true})
      }
    }
  }

  setRequested(req){
    this.setState({ isRequested : req})
  }


  render() {

    if (!this.state.checkedIfLoggedIn) {
      // delay redirect/render
      return <div></div>
    }

    else {
      if (localStorage.getItem("username")) {
        
        const AddIcon = () =>{
          if(this.state.isOwn){
            return <div></div>
          }
          return(
            <>
              <img
                  className="profileIcon"
                  id = {"add-icon"+ this.state.userProfile._id}
                  src={this.state.isRequested ? "/req_btn.png" : "/add_btn.png"}
                  onClick={this.addFriend}
                  alt=""
              />
            </>
          )
        }
        
        const UnfriendIcon = () =>{
          return(
            <img
                className="profileIcon"
                id = {"add-icon"+ this.state.userProfile._id}
                src="/unfriend_btn.png"
                onClick={this.unFriend}
                alt=""
              />
          )
        }

        // render the page
        return (
          <div className="search-container">
            <Navbar userId={this.state.userId}/>
            <div className="search-main">
              <LeftSideBar userId={this.state.userId} func={this.logout} />
              <div className='profile'>
              <div className="profileWrapper">
                  <div className="profileRight">
                      <div className="profileRightTop">
                        <div className="profileCover">
                          <img
                            className="profileCoverImg"
                            alt="cover.png"
                            src="/cover.png"
                          />
                          </div>
                          <img
                            className="profileUserImg"
                            alt=""
                            src='/pfp.png'
                          />
                        <div>
                        <div className="profileBottom"> 
                          <div className="profileInfo">
                            <h1 className="profileInfoName">{this.state.name}</h1>
                            <span className="profileInfoDesc">{this.state.userProfile.email}</span>
                          </div>
                          { (!this.isOwn && this.state.isFriend)? <UnfriendIcon/> : <AddIcon/>}
                        </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>   
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
