const { Thought, User } = require("../models");

const thoughtControllers = {
  //gets all the thoughts
  getAllThoughts: async function (req, res) {
    try {
      const allThoughts = await Thought.find({});
      res.json(allThoughts);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //gets single thought by id
  getThoughtById: async function ({ params }, res) {
    try {
      const oneThought = await Thought.findById({ _id: params.id });
      if (!oneThought) {
        res.status(404).json({ message: "No thoughts found with that id!" });
        return;
      }
      res.json(oneThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //posts a new thought and adds the id to the user's thought array
  postNewThought: async function ({ body }, res) {
    try {
      const newThought = await Thought.create(body);

      const userThought = await User.findOneAndUpdate(
        { username: body.username },
        { $push: { thoughts: newThought._id } }
      );
      if (!userThought) {
        res.status(404).json({ message: "No user found with that username!" });
      }
      res.json(newThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //updates the thought
  updateThought: async function ({ params, body }, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        { _id: params.id },
        body,
        { new: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: "No thought found with that id!" });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //deletes the thought
  deleteThought: async function ({ params }, res) {
    try {
      const deletedThought = await Thought.findByIdAndDelete({
        _id: params.id,
      });
      if (!deletedThought) {
        res.status(404).json({ message: "No thought found with that id" });
        return;
      }
      res.json(deletedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //posts reaction and adds the id to the appropriate thought
  postReaction: async function ({ params, body }, res) {
    try {
      const newReaction = await Thought.findByIdAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );
      if (!newReaction) {
        res.status(404).json({ message: "No thought found with that id!" });
        return;
      }
      res.json(newReaction);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
  //deletes reaction and removes the id from the according thought
  deleteReaction: async function ({ params }, res) {
    try {
      const deletedReaction = await Thought.findByIdAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );
      if (!deletedReaction) {
        res.status(404).json({ message: "No thought found with that id!" });
        return;
      }
      res.json(deletedReaction);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
};

module.exports = thoughtControllers;
