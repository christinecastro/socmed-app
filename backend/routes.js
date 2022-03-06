const authController = require("./controllers/auth-controller");
const userController = require("./controllers/user-controller");
const postController = require("./controllers/post-controller");

module.exports = (app) => {
  //auth
  app.post("/signup", authController.signUp);
  app.post("/login", authController.login);
  app.post("/checkifloggedin", authController.checkIfLoggedIn);

  //user
  app.post("/search", userController.searchUser);
  app.post("/friends", userController.userFriends);
  app.post("/requests", userController.userRequests);
  app.get("/profile/:id", userController.userProfile);
  app.put("/:id/friend", userController.addFriend);
  app.put("/:id/request", userController.friendRequest);
  app.delete("/:id/friend", userController.unfriendUser);

  //post
  app.post("/post", postController.newPost);
  app.put("/post/:id", postController.editPost);
  app.put("/post/:id/like", postController.likePost);
  app.delete("/post/:id", postController.deletePost);
  app.post("/timeline", postController.timelinePosts);
}