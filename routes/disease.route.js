const router = require("express").Router();
const { getDiseases, getDiseaseById, addDisease } = require("../controllers/disease.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/", verifyToken, getDiseases);
router.get("/:id", verifyToken, getDiseaseById);
router.post("/", verifyToken, addDisease);

module.exports = router;