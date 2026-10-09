import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { difficulty } = req.query;
    let query = {};
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;

    const projects = await Project.find(query).sort({ stars: -1 });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/projects
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      author: req.user.name,
    });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
