import express from 'express';
import Category from '../models/Category.js';
import AITool from '../models/AITool.js';

const router = express.Router();

// GET /api/categories (always syncs live toolCount from AITool)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Live aggregation from AITool collection
    const counts = await AITool.aggregate([
      { $group: { _id: { $toLower: '$category' }, count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const enriched = categories
      .map((cat) => ({
        ...cat.toObject(),
        toolCount: countMap[cat.name.toLowerCase()] ?? cat.toolCount ?? 0,
      }))
      .sort((a, b) => b.toolCount - a.toolCount);

    return res.json(enriched);
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
      const cleanName = id.replace(/-/g, ' ');
      category = await Category.findOne({
        $or: [
          { slug: id.toLowerCase() },
          { name: new RegExp(`^${id}$`, 'i') },
          { name: new RegExp(`^${cleanName}$`, 'i') },
        ],
      });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const tools = await AITool.find({
      category: new RegExp(`^${category.name}$`, 'i'),
    }).sort({ rating: -1 });

    return res.json({ category, tools, total: tools.length });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
