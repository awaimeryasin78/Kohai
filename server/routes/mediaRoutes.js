const express = require('express');
const router = express.Router();
const { getAnime, getDrama } = require('../controllers/mediaController');

router.get('/anime', getAnime);
router.get('/drama', getDrama);

module.exports = router;