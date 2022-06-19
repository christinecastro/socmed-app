import React, { Component } from 'react'
import Post from "../post/Post"
import Share from "../share/Share"
import Users from "../users/Users"
import "./Feed.css"

export default class Feed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeline:[],
      users: [],
      sinput: this.props.sinput
    }
    this.getTimeline = this.getTimeline.bind(this);
  }

  componentDidMount(){
    if (!this.props.sinput){// if not search page(no search input)
      this.getTimeline();
    }
  }
  
  
  // getTimeline- get timeline posts of user
  getTimeline(){
    const url = "http://localhost:3001/timeline";
    const temp = {
      userId : this.props.userId
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
          console.log("timeline");
          this.setTimeline(body.timelineposts.sort(function(x, y){
            return new Date(y.updatedAt) - new Date(x.updatedAt);
        }));
        } else {
          console.log("no posts");
        }
      });
  }

  setTimeline = posts => {
    this.setState({ timeline: posts});
  }

  
  render() {
    const Timeline = this.state.timeline;

    const Dashboard = () => {
      return (
      <>
      <Share user={this.props.user} userId={this.props.userId}/>
      {Timeline.map(p => (
        <Post key={p._id} post={p} userId={this.props.userId} />
      ))}
    </>)
    }

    const Search = () => {
      const UsersList = this.props.users;
      if (this.props.users !== 1){ // no users found
        return (
          <>
          <hr/>
          <span> Found users for "{this.props.sinput}" </span>
          <hr/>
          { UsersList.map(u => (
            <Users key={u._id} user={u} userId={this.props.userId}/>     
          ))}
          </>
        )

      }else{
        return( // found users
          <div className="errMsgWrapper">
            <span> No users found for "{this.props.sinput}" </span>
          </div>
        )
      }
    }

    return (
      <div className='feed'>
        <hr/>
         { this.props.users ? <Search/> : <Dashboard/>}
      </div>     
    )
  }
}
