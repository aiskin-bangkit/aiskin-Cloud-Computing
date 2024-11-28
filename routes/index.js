    const express = require('express');
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Welcome to the API AISKIN');
    });

    router.use('/auth', require('./auth.route'));

    module.exports = router;