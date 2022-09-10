const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  postNewUser,
  updateUser,
  deleteUser,
  postNewFriend,
  deleteFriend,
} = require("../../controllers/user-controller");

router.route("/").get(getAllUser).post(postNewUser);

router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)

router.route('/:userId/friends/:friendId').post(postNewFriend).delete(deleteFriend)

module.exports = router
