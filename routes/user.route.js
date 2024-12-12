const router = require("express").Router();
const {
  getUserProfile,
  updateUserProfile,
  upload,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/profile", verifyToken, getUserProfile);
router.patch(
  "/profile",
  verifyToken,
  upload.single("image_profile"),
  updateUserProfile
);

module.exports = router;