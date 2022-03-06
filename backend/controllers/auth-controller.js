const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


// get user model registered in Mongoose
const User = mongoose.model("User");

// signUp - add new user
exports.signUp = (req, res) => {
  const newuser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    name: [req.body.fname.toUpperCase(),
      req.body.lname.toUpperCase(),
      req.body.fname.concat(" ", req.body.lname).toUpperCase()],
    email: req.body.email.toLowerCase(),
    password: req.body.password
  });

  const email = req.body.email.trim();

  User.findOne({ email }, (err, user) => {
    // check if email exists
    if (err||user) {
      //  Scenario 1: FAIL -Email already exists
      if(err){ console.log(err)}
      else{console.log("email already in use");}
      return res.send({ success: false });
    }
    console.log("New user: ");
    console.log(newuser);

    newuser.save((err) => {
      if (err) { return res.send({ success: false }); }
      else { return res.send({ success: true }); }
    });
    
  });
}

// login - logins user
exports.login = (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    // check if email exists
    if (err || !user) {
      //  Scenario 1: FAIL - User doesn't exist
      console.log("user doesn't exist");
      return res.send({ success: false });
    }

    // check if password is correct
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        // Scenario 2: FAIL - Wrong password
        console.log("wrong password");
        return res.send({ success: false });
      }
      console.log("Successfully logged in");
      
      // Scenario 3: SUCCESS - time to create a token
      const tokenPayload = {
        _id: user._id
      };
      const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");
      // return the token to the client
      console.log(user._id)
      return res.send({ success: true, token, username: user.id});

    })
  })
}

// checkedIfLoggedIn- chedk if user is logged in
exports.checkIfLoggedIn = (req, res) => {
  if (!req.cookies || !req.cookies.authToken) {
    // Scenario 1: FAIL - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  // Token is present. Validate it
  return jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING",
    (err, tokenPayload) => {
      if (err) {
        // Scenario 2: FAIL - Error validating token
        return res.send({ isLoggedIn: false });
      }
      const userId = tokenPayload._id;

      // check if user exists
      return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
       // Scenario 3: FAIL - Failed to find user based on id inside token payload
        return res.send({ isLoggedIn: false });
      }

        // Scenario 4: SUCCESS - token and user id are valid
        console.log("user is currently logged in");
        return res.send({ isLoggedIn: true, user: user });
      });
  });
}