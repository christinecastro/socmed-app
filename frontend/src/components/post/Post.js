import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { format } from "timeago.js"
import PostEdit from '../postEdit/postEdit'
import "./Post.css"

export default class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLiked: false,
      isOwnPost: false,
      isDeleted: false,
      isEditing: false,
      isEdited: false,
      likes: this.props.post.likes.length ? this.props.post.likes.length : 0
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this)
    this.setisEditing = this.setisEditing.bind(this)
    this.setLike = this.setLike.bind(this);
  }

  componentDidMount(){
    this.setisLiked();
    this.setisOwnPost();
    this.setisEdited();
  }
 
  // handleLike - handles user liking/unliking post
  handleLike(){
    const url = "http://localhost:3001/post/" + this.props.post._id + "/like";
    const temp = {
      userId : this.props.userId
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
          console.log("successfully liked/unliked");
          this.setLike(body.liked);

        } else {
          console.log("error");
        }
      });
  }

  // handleDelete - handles user deleting own post
  handleDelete(){
    if (!window.confirm("Delete this post?")) return 
    const url = "http://localhost:3001/post/" + this.props.post._id;
    const temp = {
      userId : this.props.userId
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
          console.log("successfully deleted post");
          this.setState({ isDeleted: true})
        } else {
          console.log("delete post unsuccesful");
        }
      });
  }

  // handleEdit - handles user entering to edit mode
  handleEdit(){
    if(window.confirm("Do you want to edit this post?")){
      this.setisEditing();
    }
  }

  setisEditing(){
    this.setState({ isEditing: !this.state.isEditing})
  }

  setisLiked(){
    if (this.props.post.likes.includes(this.props.userId)){
      this.setState({isLiked: true});
    }
  }

  setisEdited(){
    if (new Date(this.props.post.createdAt).getTime() !== new Date(this.props.post.updatedAt).getTime()){
      this.setState({isEdited: true});
    }
  }

  setisOwnPost(){
    if (this.props.post.userId === (this.props.userId)){
      this.setState({isOwnPost: true});
    }
  }

  setLike(like){
    this.setState({ isLiked : like})
    this.setState({ likes :  like ? this.state.likes+1 : this.state.likes-1 })
  }

  
  render() {
    const post = this.props.post;
    const PostIcons = () =>{
      return(
        <>
          <img
            className="postIcon"
            src="/edit.png"
            onClick={this.handleEdit}
            alt=""
          />
          <img
            className="postIcon"
            src="/delete.png"
            onClick={this.handleDelete}
            alt=""
          />
        </>
      )
    }

    if (this.state.isDeleted){
      return null
    }
    if (this.state.isEditing){
      return(
        <PostEdit post={this.props.post} setisEditing={this.setisEditing} userId={this.props.userId}/>
      )
    }
    else{
  
      return (
        <div className="post">
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              <Link to={`/profile/${post.userId}`}>
                <span className="postUsername">{post.username}</span>
              </Link>
              <span className="postDate">{format(post.createdAt)}</span>
              {
                this.state.isEdited? <span className="postEdited">Edited</span>: null
              }
            </div>
            <div className="postTopRight">
              { this.state.isOwnPost ? <PostIcons/>: null}
            </div>
          </div>
          <div className="postCenter">
            <p className="postText">{post.content.replace(/\\\\n/g, "\n")}</p>
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              <img
                className="likeIcon"
                id = {"like-icon"+ post._id}
                src={this.state.isLiked ? "/liked.png" : "/unliked.png"}
                onClick={this.handleLike}
                alt=""
              />
              <span id={"like-counter"+ post._id} className="postLikeCounter">{this.state.likes ? this.state.likes : ""}</span>
            </div>
          </div>
        </div>
      </div>
      )
            }
  }
}
