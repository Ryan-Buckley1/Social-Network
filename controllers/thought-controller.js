const { Thought } = require("../models");

const thoughtControllers = {
  getAllThoughts: async function (req, res) {
    try {
      const allThoughts = await Thought.find({});
      res.json(allThoughts);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
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
  postNewThought: async function ({ body }, res) {
    try {
      const newThought = await Thought.create({ body });

      const userThought = await User.find(
        { username: body.username },
        { $push: { thoughts: { thoughtId: newThought._id } } }
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
