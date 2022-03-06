const mongoose = require("mongoose");

// get user model registered in Mongoose
const User = mongoose.model("User");

// searchUser - search for a user by name
exports.searchUser = (req, res) => {
  // const currentUser = req.body.id;
  User.find({ $and:[
    {name: req.query.name.toUpperCase()},
    {_id:{$ne: req.body.id} }]},
    {password:false}, (err, user) => {

    // Error || No users found
    if (err||user.length===0) {
      if(err){ console.log(err)}
      else{ console.log("no users found");}
      return res.status(400).send({ success: false});
    }
    // Users are found
    console.log("users found");
    return res.status(200).send({ success: true , users: user});
  });
}

// userProfile -  get's a user's profile
exports.userProfile = (req, res) =>{ 
  const userId = req.params.id;
  User.findById(userId, {password:false}, (err, user) =>{
    // Error || user not found
    if(err||!user){
      if(err) { console.log(err); }
      else { console.log("No user with given id"); }
      return res.status(400).send({ success: false});
    }
    // User is found
    console.log("User profile available!")
    return res.status(200).send({ success: true, user: user})
  });
}

// userFriends - search for a user's friends
exports.userFriends = async (req, res) =>{
  try{
    const currentUser = await User.findById(req.body.id)
    const friendList = [];
    //get the user's friends' information
    const friends = await Promise.all(
      currentUser.friends.map((friendId) => {
        return User.find({ _id: friendId},{ password:0, requests:0, requested:0 });
      })
    )
    return res.status(200).send({success: true, FriendList: friendList.concat(...friends) })
  }catch(err){
    console.log(err)
    return res.status(500).send({success:false})
  }
}

// userRequests - gets the friend requests fir user
exports.userRequests= async (req, res) =>{
  try{
    const currentUser = await User.findById(req.body.id)
    const requestList = [];
    // get the user's requests
    const requests= await Promise.all(
      currentUser.requests.map((userId) => {
        return User.find({ _id: userId},{ name:0, password:0, friends:0, requested:0, email:0 });
      })
    )
    return res.status(200).send({success: true, requests: requestList.concat(...requests) })
  }catch(err){
    console.log(err)
    return res.status(500).send({success:false})
  }
}

// addFriend - add user as friend from requests
exports.addFriend = async (req, res) =>{
  const currentUserId = req.body.id
  const userId = req.params.id
  const isAccept = req.body.isAccept
  // Must not be the same user
  if(currentUserId!==userId){
    try{
      const currentUser =  await User.findById(currentUserId);
      const user =  await User.findById(userId);
      // currentUser must have sent a request to user
      if (currentUser.requests.includes(userId)) {
        // if user chose to accept
        if (isAccept){
          // both users are added to each others friends array
          await currentUser.updateOne({$push:{friends:userId}});
          await user.updateOne({$push:{friends:currentUserId}});
        }
        // remove requests and requested array
        await currentUser.updateOne({$pull:{requests: userId}});
        await user.updateOne({$pull: {requested: currentUserId}});
        // remove possible requests from currentUser
        if(currentUser.requested.includes(userId)){
          await currentUser.updateOne({$pull:{requested: userId}});
          await user.updateOne({$pull: {requests: currentUserId}});
        }

        console.log("User successfully added!");
        return res.status(200).send({success:true});
      }
      console.log("No friend request");
      return res.status(400).send({success:false});
    }catch(err){
      console.log(err);
      return res.status(500).json(err);
    } 
  }
  console.log("Cannot add yourself as a friend");
  return res.status(400).send({sucess: false });
}

// friendRequest - send/cancel a friend requests to a user
exports.friendRequest = async (req, res) =>{
  const currentUserId = req.body.id
  const userId = req.params.id

  if ((currentUserId == (null||"") )|| (userId === (null||""))  )
    return res.status(400).send({success:false});
  // Must not be the same user
  if(currentUserId!==userId){
    try{
      const currentUser =  await User.findById(currentUserId);
      const user =  await User.findById(userId);

      //Current user and the user are friends already
      if (user.friends.includes(currentUserId)) {
        console.log("Cannot send request to friends");
        return res.status(400).send({success:false});
      }
      // Current user haven't sent a request yet (Send request)
      if (!user.requests.includes(currentUserId)) {
        await user.updateOne({$push:{requests: currentUserId}});
        await currentUser.updateOne({$push:{requested: userId}});
        console.log("Friend request sent!");
        return res.status(200).send({success:true, friendreq: true})
      }
      // CurrentUser already sent a request (Cancel request)
      await user.updateOne({$pull:{requests:currentUserId}});
      await currentUser.updateOne({$pull:{requested: userId}});
      console.log("Friend request cancelled");
      return res.status(200).send({success:true, friendreq: false})
    }catch(err){
      console.log(err);
      return res.status(500).send({success: false });
    }
  }
  console.log("Cannot send request to yourself");
  return res.status(400).send({success:false});
}

// unfriendUser - delete both users from their friends array
exports.unfriendUser = async (req, res) =>{
  const currentUserId = req.body.id
  const userId = req.params.id
  // Must not be the same user
  if(currentUserId!==userId){
    const currentUser =  await User.findById(currentUserId);
    const user =  await User.findById(userId);
    // User must be in CurrentUser's friends array
    if(currentUser.friends.includes(userId)){
      await currentUser.updateOne({$pull:{friends:userId}});
      await user.updateOne({$pull:{friends:currentUserId}});
      console.log("Successfully unfriended user!")
      return res.status(200).send({success: true})
    }
    console.log("Already not friends with user")
    return res.status(400).send({success: false})
  }
  console.log("Cannot unfriend yourself")
  return res.status(400).send({success: false})
}