const router = require("express").Router();
const {
  history,
  getHistoryByUser,
  getHistoryById,
} = require("../controllers/history.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/", verifyToken, history);
router.get("/", verifyToken, getHistoryByUser);
//router.get("/:id", verifyToken, getHistoryById);

module.exports = router;
