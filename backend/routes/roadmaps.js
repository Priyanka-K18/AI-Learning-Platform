import express from 'express';
import Roadmap from '../models/Roadmap.js';

const router = express.Router();

// GET /api/roadmaps
router.get('/', async (req, res) => {
  try {
    const { level } = req.query;
    let query = {};
    if (level && level !== 'all') query.level = level;

    const roadmaps = await Roadmap.find(query).sort({ totalEnrollments: -1 });
    return res.json(roadmaps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/roadmaps/:id
router.get('/:id', async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    return res.json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
