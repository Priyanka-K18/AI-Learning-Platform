import express from 'express';
import Category from '../models/Category.js';
import AITool from '../models/AITool.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ toolCount: -1 });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/categories/:id/tools (or by slug/name)
router.get('/:id/tools', async (req, res) => {
  try {
    const { id } = req.params;
    let category = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    }
    if (!category) {
      category = await Category.findOne({
        $or: [{ slug: id.toLowerCase() }, { name: new RegExp(`^${id}$`, 'i') }],
      });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const tools = await AITool.find({
      category: new RegExp(`^${category.name}$`, 'i'),
    }).sort({ rating: -1 });

    return res.json({ category, tools });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
