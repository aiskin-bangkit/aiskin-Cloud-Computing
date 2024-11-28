    const express = require('express');
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Welcome to the API AISKIN');
    });

    router.use('/auth', require('./auth.route'));
    router.use('/article', require('./article.route'));

    module.exports = router;