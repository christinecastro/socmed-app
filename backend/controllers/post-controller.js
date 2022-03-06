const mongoose = require("mongoose");

// get user model registered in Mongoose
const User = mongoose.model("User");

// get post model registered in Mongoose
const Post = mongoose.model("Post");

// newPost - adds new post from a user
exports.newPost = async (req, res) =>{
  const newPost = new Post(req.body);
  try{
    const savedPost = await newPost.save();
    console.log("New post successfully added!")
    return res.status(200).send({success: true, post: savedPost});
  }catch(err){
    console.log(err);
    return res.status(500).send({success: false});
  }
};

//  editPost - edits a user's post
exports.editPost = async (req, res) =>{
    try{
      const post = await Post.findById(req.params.id);
      // Must be the same userId
      if(post.userId===req.body.userId){
        await post.updateOne({$set: {content:req.body.content}});
        console.log("Post successfully edited!");
        return res.status(200).send({success: true });
      }
      console.log("You can only edit your own post")
      return res.status(400).send({success: false });
    }catch(err){
      console.log(err);
      res.status(500).send({success:false});
  }
};

//  deletePost - deletes a current user's post
exports.deletePost = async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    console.log(post.userId);
    //Must be the same user
    if(post.userId===req.body.userId){
      await post.deleteOne();
      console.log("Post successfully deleted!");
      return res.status(200).send({success: true });
    }
    console.log("You can only delete your own post")
    return res.status(400).send({success: false }); 
  }catch(err){
    console.log(err);
    return res.status(500).send({success:false});
  }
};

// likePost - manage likes on posts
exports.likePost = async (req, res) =>{
  try{
    const post = await Post.findById(req.params.id);
    //lf user likes the post
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId }}, {timestamps: false} );
      res.status(200).json( {success:true, liked: true, msg: "The post has been liked"});
    } else { //if user dislikes the post
      await post.updateOne({ $pull: { likes: req.body.userId }}, {timestamps: false});
      res.status(200).json({success:true, liked: false, msg:"The post has been disliked"});
    }
  }catch(err){
    console.log(err);
    res.status(500).send({success:false});
}
};


//  timelinePosts - gets a current user's timeline
exports.timelinePosts = async (req, res) =>{
  try{
    const currentUser = await User.findById(req.body.userId)
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.friends.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    )
    return res.status(200).send({success: true, timelineposts: userPosts.concat(...friendPosts) })
  }catch(err){
    console.log(err)
    return res.status(500).send({success:false})
  }
}