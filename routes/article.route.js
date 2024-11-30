const router = require("express").Router();
const { getArticles, getArticleById, getLatestArticles, addArticle } = require("../controllers/article.controller");

router.get("/", getArticles);
router.get("/latest", getLatestArticles);
router.get("/:id", getArticleById);
router.post("/", addArticle);

module.exports = router;