const { Schema, model } = require("mongoose");

//User Schema for DB
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please enter a username"],
      trim: true,
    },
    email: {
      type: String,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email address.",
      ],
      required: [true, "Please enter Email Address"],
      unique: true,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
//Gets friend count
UserSchema.virtual("friendCount").get(function () {
  return this.friends.reduce((total, friend) => total + friend.length + 1, 0);
});

const User = model("User", UserSchema);

module.exports = User;
