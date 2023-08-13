const fs = require('fs').promises;
const path = require('path');
const Post = require('../models/post');
const Comment = require('../models/comment');

//createPost
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    let image = req.body.image || null;

    if (req.body) {
      image = req.file.filename;
    }
    const post = new Post({ title, content, image, author: req.user.id });
    await post.save();
    res.json(post);
  } catch (error) {}
};

// get all the posts

const getAllPosts = async (req, res) => {
  try {
    console.log('fdewqaf');
    const posts = await Post.find().sort({ createPost: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error getting posts' });
  }
};

// get post by ID

const getPostsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// updatePost
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    let image = req.body.image || null;
    if (req.file) {
      image = req.file.filename;
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Function to delete the old post image
    const deleteOldImage = async (imagePath) => {
      try {
        await fs.unlink(imagePath);
        console.log('Old post image deleted successfully.');
      } catch (error) {
        console.error('Error deleting old post image:', error);
      }
    };

    if (image !== null && post.image) {
      const imagePath = path.join(__dirname, `../public/uploads/${post.image}`);
      await deleteOldImage(imagePath);
    }

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.image = image ?? post.image;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.image) {
      await fs.unlink(path.join(__dirname, `../public/uploads/${post.image}`));
    }

    await Comment.deleteMany({ _id: { $in: post.comments } });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

// comment add

const commentPost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = new Comment({ content, author: req.user.id });
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error while commenting' });
  }
};

// like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isLiked = post.likes.some((userId) => userId.equals(req.user.id));
    if (isLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();

    res.json(post);
  } catch (error) {}
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByID,
  updatePost,
  deletePost,
  commentPost,
  likePost,
};
