const express = require('express');
const { signMessage } = require('../controllers/signController');

const router = express.Router();

router.post('/', signMessage);

module.exports = router;

