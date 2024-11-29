const router = require("express").Router();
const { getDiseases, getDiseaseById, addDisease } = require("../controllers/disease.controller");

router.get("/", getDiseases);
router.get("/:id", getDiseaseById);
router.post("/", addDisease);

module.exports = router;