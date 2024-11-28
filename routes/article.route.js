const router = require("express").Router();
const { getArticles, getArticleById, getLatestArticles, addArticle } = require("../controllers/article.controller");

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.get("/latest-articles", getLatestArticles);
router.post("/", addArticle);

module.exports = router;