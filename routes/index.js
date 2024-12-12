const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the API AISKIN");
});

router.use("/auth", require("./auth.route"));
router.use("/article", require("./article.route"));
router.use("/disease", require("./disease.route"));
router.use("/user", require("./user.route"));
router.use("/history", require("./history.route"));
router.use("/predict", require("./predict.route"));
module.exports = router;
