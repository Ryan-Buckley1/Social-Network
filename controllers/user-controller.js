const { User, Thought } = require("../models");

const userController = {
  //get all users
  getAllUser: async function (req, res) {
    try {
      const allUsers = await User.find({});
      res.json(allUsers);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //Get user by the id
  getUserById: async function ({ params }, res) {
    try {
      const singleUser = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
        })
        .populate({ path: "friends" });
      res.json(singleUser);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //Create a new User
  postNewUser: async function ({ body }, res) {
    try {
      const newUser = await User.create(body);
      res.json(newUser);
    } catch (err) {
      console.error(err);
      res.json(400).json(err);
    }
  },
  updateUser: async function ({ params, body }, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: params.id },
        body,
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  deleteUser: async function ({ params }, res) {
    try {
      const user = await User.findById({
        _id: params.id,
      });
      if (!user) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      const thoughts = await Thought.deleteMany({ username: user.username });
      if (!thoughts) {
        res.status(404).json({
          message: `${user.username} didn't have any thoughts or their username does not match any thoughts.`,
        });
        return;
      }
      const deletedUser = await User.deleteOne({ _id: user.id });
      res.json(deletedUser);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  postNewFriend: async function ({ params }, res) {
    try {
      const newFriend = await User.findByIdAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
      );
      if (!newFriend) {
        res.status(404).json({ message: " no user found with that id" });
      }
      res.json(newFriend);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  deleteFriend: async function ({ params }, res) {
    try {
      const deletedFriend = await User.findByIdAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!deletedFriend) {
        res.status(404).json({ message: " no user found with that id" });
      }
      res.json(deletedFriend);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
};

module.exports = userController;
