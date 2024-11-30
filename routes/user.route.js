const router = require("express").Router();
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/profile", verifyToken, getUserProfile);
router.patch("/profile", verifyToken, updateUserProfile);

module.exports = router;
