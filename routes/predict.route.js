const router = require("express").Router();
const {
  Predict,
  getPredictionHistoryByUser,
  getPredictionHistoryById,
} = require("../controllers/predict.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/", verifyToken, Predict);
router.get("/", verifyToken, getPredictionHistoryByUser);
router.get("/:id", verifyToken, getPredictionHistoryById);

module.exports = router;
