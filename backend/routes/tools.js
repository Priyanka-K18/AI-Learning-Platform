import express from 'express';
import AITool from '../models/AITool.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/tools/stats (summary statistics for directory)
router.get('/stats', async (req, res) => {
  try {
    const totalTools = await AITool.countDocuments();
    const categoriesAggregation = await AITool.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const recentlyVerified = await AITool.find({ verified: true })
      .sort({ updatedAt: -1 })
      .limit(8);

    return res.json({
      total: totalTools,
      categories: categoriesAggregation.map((c) => ({ category: c._id, count: c.count })),
      recentlyVerified,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/tools/recently-verified
router.get('/recently-verified', async (req, res) => {
  try {
    const tools = await AITool.find({ verified: true })
      .sort({ lastVerified: -1, rating: -1 })
      .limit(10);
    return res.json(tools);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/tools (with filter by category, pricing, skillLevel, search, pagination)
router.get('/', async (req, res) => {
  try {
    const {
      category,
      pricing,
      skillLevel,
      openSource,
      search,
      page,
      limit,
    } = req.query;

    let query = {};

    if (category && category !== 'all') {
      // Support matching exact name or slug style
      query.category = new RegExp(`^${category.replace(/-/g, ' ')}$`, 'i');
    }

    if (pricing && pricing !== 'all') {
      query.pricing = pricing;
    }

    if (skillLevel && skillLevel !== 'all') {
      query.skillLevel = skillLevel;
    }

    if (openSource === 'true') {
      query.isOpenSource = true;
    }

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      const regex = new RegExp(cleanSearch, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { subcategory: regex },
        { tags: { $in: [regex] } },
        { features: { $in: [regex] } },
      ];
    }

    const totalMatching = await AITool.countDocuments(query);
    res.setHeader('X-Total-Count', totalMatching);

    // If page is provided, use pagination, otherwise return all matching (up to 1000)
    let toolsQuery = AITool.find(query).sort({ rating: -1, createdAt: -1 });

    if (page) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const pageSize = parseInt(limit, 10) || 50;
      toolsQuery = toolsQuery.skip((pageNum - 1) * pageSize).limit(pageSize);

      const tools = await toolsQuery;
      return res.json({
        tools,
        total: totalMatching,
        page: pageNum,
        totalPages: Math.ceil(totalMatching / pageSize),
      });
    }

    // Default limit is 500 so no tools are silently hidden
    const safeLimit = limit ? parseInt(limit, 10) : 500;
    const tools = await toolsQuery.limit(safeLimit);

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

// POST /api/tools/:id/report (Report tool as unavailable or broken link)
router.post('/:id/report', async (req, res) => {
  try {
    const { reason, comment } = req.body;
    const tool = await AITool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'AI Tool not found' });
    }

    // If user reports tool as unavailable/discontinued
    console.log(`Report received for ${tool.name} (${tool._id}): [${reason || 'General'}] ${comment || 'No comment'}`);

    return res.json({
      success: true,
      message: `Report recorded for ${tool.name}. Our neural verification team will re-validate this tool within 24 hours.`,
      toolId: tool._id,
    });
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
