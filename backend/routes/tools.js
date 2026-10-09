import express from 'express';
import AITool from '../models/AITool.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/tools (with optional filter by category, pricing, search)
router.get('/', async (req, res) => {
  try {
    const { category, pricing, search, limit = 50 } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (pricing && pricing !== 'all') {
      query.pricing = pricing;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const tools = await AITool.find(query).limit(Number(limit)).sort({ rating: -1 });
    return res.json(tools);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/tools/:id
router.get('/:id', async (req, res) => {
  try {
    const tool = await AITool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    return res.json(tool);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/tools (add new tool)
router.post('/', protect, async (req, res) => {
  try {
    const tool = await AITool.create(req.body);
    return res.status(201).json(tool);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// PUT /api/tools/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const tool = await AITool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    return res.json(tool);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE /api/tools/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const tool = await AITool.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }
    return res.json({ message: 'AI Tool deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/tools/:id/bookmark (toggle save tool)
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toolId = req.params.id;

    const isBookmarked = user.savedTools.includes(toolId);
    if (isBookmarked) {
      user.savedTools = user.savedTools.filter((id) => id.toString() !== toolId);
    } else {
      user.savedTools.push(toolId);
    }

    await user.save();
    return res.json({
      bookmarked: !isBookmarked,
      savedTools: user.savedTools,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
