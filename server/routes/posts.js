const express = require('express');
const { register, login } = require('../controllers/authController');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment
} = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Post routes
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', authMiddleware, createPost);
router.put('/posts/:id', authMiddleware, updatePost);
router.delete('/posts/:id', authMiddleware, deletePost);
router.post('/posts/:id/comments', authMiddleware, addComment);

module.exports = router;
