const express = require('express');
const router = express.Router();
const { getMyList, addOrUpdateItem, removeItem } = require('../controllers/listController');

router.get('/', getMyList);
router.post('/', addOrUpdateItem);
router.delete('/:key', removeItem);

module.exports = router;