const express = require('express');
const { getSolution } = require('../controllers/solutionController');

const router = express.Router();

router.post('/', getSolution);

module.exports = router;
