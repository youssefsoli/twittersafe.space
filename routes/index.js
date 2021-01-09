const express = require('express');

const router = express.Router();

router.use('/tweets', require('./tweets'))

router.get('/', (req, res) => {
    res.json(req.query);
});

module.exports = router;