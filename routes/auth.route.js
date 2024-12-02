const router = require("express").Router();
const {signIn, signUp, logout} = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/signin", signIn)
router.post("/signup", signUp)
router.post('/logout', verifyToken, logout)

module.exports = router;