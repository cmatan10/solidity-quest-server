const express = require('express');
const { getHint } = require('../controllers/hintController');

const router = express.Router();

router.post('/', getHint);

module.exports = router;
