import express from 'express';
import CommunityPost from '../models/CommunityPost.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/community
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;

    const posts = await CommunityPost.find(query).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/community
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await CommunityPost.create({
      title,
      content,
      category: category || 'Discussion',
      tags: tags || [],
      author: req.user.name,
      authorAvatar: req.user.avatar || '',
    });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// POST /api/community/:id/reply
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.replies.push({
      author: req.user.name,
      content,
    });
    await post.save();
    return res.json(post);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
