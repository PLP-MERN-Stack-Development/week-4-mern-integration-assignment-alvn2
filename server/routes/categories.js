const express = require('express');
const { getAllCategories, createCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllCategories);
router.post('/', authMiddleware, createCategory);

module.exports = router;