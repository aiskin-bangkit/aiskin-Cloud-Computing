const router = require("express").Router();
const { getArticles, getArticleById, getLatestArticles, addArticle } = require("../controllers/article.controller");
const { verifyToken } = require("../middleware/auth.middleware");


router.get("/", verifyToken, getArticles);
router.get("/latest",verifyToken, getLatestArticles);
router.get("/:id",verifyToken, getArticleById);
router.post("/", addArticle);

module.exports = router;