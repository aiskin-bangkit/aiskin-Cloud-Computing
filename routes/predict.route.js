const router = require("express").Router();
const {
  predict,
  getPredictHistory,
  upload,
} = require("../controllers/predict.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/", verifyToken, getPredictHistory);
router.post("/", verifyToken, upload.single("image_predict"), predict);

module.exports = router;