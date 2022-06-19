import React, { Component } from 'react'
import "./Share.css"

export default class Share extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isDisabled : true,
      user:[]
    };
    
    this.inputChange = this.inputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  // jsonEscape - handles multilines in input for storage
  jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
  }

  // handleSubmit - posts user's post
  handleSubmit(e){
    e.preventDefault()
    const postContent = document.getElementById("share-input").value.trim();
    if (postContent===""||null) return 0;
    console.log(postContent);
    const url = "http://localhost:3001/post";
    const temp = {
      userId : this.props.userId,
      username: this.props.user.fname + " " + this.props.user.lname,
      content: this.jsonEscape(postContent)
    }
    fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(temp)
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          window.location.reload();
        } else {
          alert("post failed");
        }
      });
  }

  // inputChange - handles input change
  inputChange(e){
    this.setState({[e.target.name]: e.target.value});
    const maxLength = 280;
    const shareInput = document.getElementById("share-input").value.trim();
    //--adjust height according to input (reference : https://stackoverflow.com/questions/2803880/is-there-a-way-to-get-a-textarea-to-stretch-to-fit-its-content-without-using-php)
    document.getElementById("share-input").style.height = "1px";
    document.getElementById("share-input").style.height = document.getElementById("share-input").scrollHeight+'px';
    //enable the button if input is not empty and does not exceed limit
    if (shareInput !== "" && shareInput.length <= maxLength){
      document.getElementById("share-input").style.color = "black";
      this.setState({ isDisabled : false })
    }else{
      if (shareInput.length > maxLength){
        document.getElementById("share-input").style.color = "red";
      }
      this.setState({ isDisabled : true })
    }
  }

  
  render() {
    return (
      <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src="/pfp.png" alt="" />
          <textarea
            placeholder={`What's on your mind ${this.props.user? this.props.user.fname : ""} ?`}
            id="share-input"
            className="shareInput"
            onChange={this.inputChange}
          />
        </div>
        <hr className="shareHr"/>
        <div className="shareBottom">
            <button
              onClick={this.handleSubmit}
              id = "share-button"
              className="shareButton"
              disabled = {this.state.isDisabled}
            >
              Share
            </button>
        </div>
      </div>
    </div>
    )
  }
}
