import express from 'express';
import AITool from '../models/AITool.js';
import Category from '../models/Category.js';
import LearningResource from '../models/LearningResource.js';

const router = express.Router();

// GET /api/search?q=...
router.get('/', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();

    if (!query) {
      // Return suggestions or popular tools
      const popularTools = await AITool.find().limit(6).sort({ rating: -1 });
      const suggestions = [
        'AI video generator',
        'AI code completion',
        'Image upscaler',
        'Voice cloning',
        'Autonomous agent',
        'Workflow automation',
      ];
      return res.json({
        query: '',
        results: popularTools,
        suggestions,
        categories: [],
        total: popularTools.length,
      });
    }

    const regex = new RegExp(query, 'i');

    const [tools, categories, learning] = await Promise.all([
      AITool.find({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { tags: { $in: [regex] } },
          { features: { $in: [regex] } },
        ],
      }).limit(20),
      Category.find({
        $or: [{ name: regex }, { description: regex }],
      }).limit(5),
      LearningResource.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }],
      }).limit(5),
    ]);

    const suggestions = [
      'Cursor AI',
      'Midjourney v7',
      'Runway Gen-3',
      'Claude 3.7 Sonnet',
      'ElevenLabs Voice',
      'v0 by Vercel',
      'Make Automation',
    ].filter((s) => s.toLowerCase().includes(query.toLowerCase()));

    return res.json({
      query,
      results: tools,
      categories,
      learning,
      suggestions,
      total: tools.length + categories.length + learning.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
