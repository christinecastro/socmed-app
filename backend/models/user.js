const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String,required: true },
  name: { type: Array, required: true },
  email: { type: String, unique: true, required: true},
  password: { type: String, required: true },
  profilePicture: { type: String, default:"" },
  friends: { type: Array, unique: true,  default: [] },
  requests: { type: Array, unique: true, default: [] },
  requested: { type: Array, unique: true, default: []}
});

UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model("User", UserSchema);