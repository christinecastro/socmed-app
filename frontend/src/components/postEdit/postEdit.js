import React, { Component } from 'react'
import { format } from "timeago.js"
import "./postEdit.css"

export default class PostEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isDisabled : true
    };
    this.inputChange = this.inputChange.bind(this)
    this.handleCancelEdit = this.handleCancelEdit.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }
   // jsonEscape - handles multilines in input for storage
  jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
  }

  // inputChange - handles input change
  inputChange(e){
    this.setState({[e.target.name]: e.target.value});
    const maxLength = 280;
    const editInput = document.getElementById("edit-input").value.trim();
    //--adjust height according to input (reference : https://stackoverflow.com/questions/2803880/is-there-a-way-to-get-a-textarea-to-stretch-to-fit-its-content-without-using-php)
    document.getElementById("edit-input").style.height = "1px";
    document.getElementById("edit-input").style.height = document.getElementById("edit-input").scrollHeight+'px';
    //enable the button if input is not empty and does not exceed limit
    if (editInput !== "" && editInput.length <= maxLength){
      document.getElementById("edit-input").style.color = "black";
      this.setState({ isDisabled : false })
    }else{
      if (editInput.length > maxLength){
        document.getElementById("edit-input").style.color = "red";
      }
      this.setState({ isDisabled : true })
    }
  }

  // handleCancelEdit - exit edit mode
  handleCancelEdit(){
    if(window.confirm("Cancel editing this post?")){
      this.props.setisEditing();
    }
  }

  // handleUpdate - updates user's post
  handleUpdate(e){
    e.preventDefault()
    if (!window.confirm("Update this post?")) return 
    const postContent = document.getElementById("edit-input").value.trim();
    if (postContent===""||null) return 0;
    console.log(postContent);
    const url = "http://localhost:3001/post/" + this.props.post._id ;
    const temp = {
      userId : this.props.userId,
      content: this.jsonEscape(postContent)
    }
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
          alert("updated");
          window.location.reload();
        } else {
          alert("post update failed");
        }
      });
  }

  
  render() {
    const post = this.props.post
    return (
      <div className="postedit">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <span className="postUsername">{post.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
           <i id="close-btn" class="material-icons" onClick={this.handleCancelEdit} >
              clear
            </i>
          </div>
        </div>
        <div className="postCenter">
          <textarea
            placeholder={post.content.replace(/\\\\n/g, "\n")}
            id="edit-input"
            className="editInput"
            defaultValue={post.content.replace(/\\\\n/g, "\n")}
            onChange={this.inputChange}
          />
        </div>
        <div className="postBottom">
          <div className="postBottomRight">
            <button
              onClick={this.handleUpdate}
              id = "edit-button"
              className="editButton"
              disabled = {this.state.isDisabled}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
