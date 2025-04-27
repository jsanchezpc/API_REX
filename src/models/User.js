const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email required"],
    //   match: [/\S+@\S+\.\S+/, 'Email is not valid']
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free',
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: [true, "Password required"],
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  // friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  language: {
    type: String,
    required: false,
    default: 'en-US',
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  // avatar: {
  //   type: String,
  //   required: false,
  //   default: 'sheep'
  // },
  lockUntil: {
    type: Date,
  }
});

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

module.exports = mongoose.model("User", userSchema);
