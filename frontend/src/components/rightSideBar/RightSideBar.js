import React, { Component }from 'react'
import Request from "../request/Request"
import "./RightSideBar.css"

export default class RightSideBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      requests:[]
    }
    this.getRequests = this.getRequests.bind(this);
  }

  componentDidMount(){
    this.getRequests();
  }

  // getRequests  - fetch user's friend requests
  getRequests(){
    const url = "http://localhost:3001/requests";
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
          this.setRequests(body.requests)
        } else {
          console.log("getting user requests failed")
        }
      });
  }

  setRequests = requests => {
    this.setState({requests : requests})
  }

  
  render() {
    const ReqList= this.state.requests
    return (
      <div className='rightbar'>
        <div className='rightbarWrapper'>
          <h4> Friend Requests </h4>
          <hr className="rightbarHr" />
          <div className="rightbarFriends">
            <ul className="rightbarFriendList">
              {ReqList.map(u => (
                    <Request className="test" key={u._id} user={u} userId={this.props.userId}/>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

