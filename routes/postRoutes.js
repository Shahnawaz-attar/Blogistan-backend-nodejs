const express = require('express');
const {
  createPost,
  getAllPosts,
  getPostsByID,
  updatePost,
  deletePost,
  commentPost,
  likePost,
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/imageUpload');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostsByID);
router.post('/', authMiddleware, upload.single('image'), createPost);
router.put('/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/comment', authMiddleware, commentPost);
router.post('/:id/like', authMiddleware, likePost);

module.exports = router;
