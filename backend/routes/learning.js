import express from 'express';
import LearningResource from '../models/LearningResource.js';

const router = express.Router();

// GET /api/learning
router.get('/', async (req, res) => {
  try {
    const { level, category } = req.query;
    let query = {};
    if (level && level !== 'all') query.level = level;
    if (category && category !== 'all') query.category = new RegExp(`^${category}$`, 'i');

    const resources = await LearningResource.find(query).sort({ rating: -1 });
    return res.json(resources);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/learning/:id
router.get('/:id', async (req, res) => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Learning resource not found' });
    }
    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
