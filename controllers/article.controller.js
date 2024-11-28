const { db } = require("../config/db");
const { collection, getDocs, doc, getDoc, query, orderBy, limit, Timestamp, addDoc } = require("firebase/firestore");
const Article = require("../models/article.model");

const getArticles = async (req, res) => {
    try {
        const articlesSnapshot = await getDocs(collection(db, "articles"));
        const articles = [];
        articlesSnapshot.forEach((doc) => {
            const data = doc.data();
            articles.push({
                id: doc.id,
                ...data,
                created_at: data.created_at.toMillis(),
                updated_at: data.updated_at.toMillis()
            });
        });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to get articles",
            error: error.message,
        });
    }
};

const getArticleById = async (req, res) => {
    try {
        const articleId = req.params.id;
        const articleDoc = await getDoc(doc(db, "articles", articleId));
        if (!articleDoc.exists()) {
            return res.status(404).json({
                status: "failed",
                message: "Article not found",
            });
        }
        res.status(200).json(articleDoc.data());
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to get article",
            error: error.message,
        });
    }
};

const getLatestArticles = async (req, res) => {
    try {
        const latestArticlesQuery = query(collection(db, "articles"), orderBy("publishedDate", "desc"), limit(5));
        const articlesSnapshot = await getDocs(latestArticlesQuery);
        const articles = [];
        articlesSnapshot.forEach((doc) => {
            articles.push(doc.data());
        });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to get latest articles",
            error: error.message,
        });
    }
};

const addArticle = async (req, res) => {
    try {
        const {name, description, resource, image, content} = req.body;

        if (!name || !description || !resource || !image || !content) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all required fields",
                data: null
            });
        }

        const created_at = Timestamp.now();
        const updated_at = Timestamp.now();

        // const newArticle = new Article(name, description, resource, image, content, created_at, updated_at);
        const newArticle = {
            name,
            description,
            resource,
            image,
            content,
            created_at,
            updated_at
        };

        const docRef = await addDoc(collection(db, "articles"), newArticle);

        res.status(201).json({
            status: "success",
            message: "Article added successfully, article written with ID: " + docRef.id,
        });

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Failed to add article",
            error: error.message,
          });
          console.log(error);
    }
};

module.exports = {
    getArticles,
    getArticleById,
    getLatestArticles,
    addArticle
};