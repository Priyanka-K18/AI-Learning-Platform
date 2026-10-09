import express from 'express';
import mongoose from 'mongoose';
import LearningResource from '../models/LearningResource.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper to optionally get user from JWT without hard failing
const optionalUser = async (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ai_nexus_super_secret_jwt_key_2026_future_secure'
      );
      return await User.findById(decoded.id);
    } catch {
      return null;
    }
  }
  return null;
};

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

// GET /api/learning/tracks
router.get('/tracks', async (req, res) => {
  try {
    const resources = await LearningResource.find().sort({ rating: -1 });
    return res.json({ tracks: resources, total: resources.length });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/learning/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Resource not found or invalid ID format' });
    }
    const resource = await LearningResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Learning resource not found' });
    }
    return res.json(resource);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/learning/:id/progress (get user completed module indices)
router.get('/:id/progress', async (req, res) => {
  try {
    const user = await optionalUser(req);
    if (!user) {
      return res.json({ completedModules: [] });
    }

    const courseId = req.params.id;
    const completedIndices = (user.completedLessons || [])
      .filter((lesson) => lesson.courseId?.toString() === courseId)
      .map((lesson) => lesson.moduleIndex);

    return res.json({ completedModules: completedIndices });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/learning/:id/toggle-module (toggle module completion for user)
router.post('/:id/toggle-module', async (req, res) => {
  try {
    const { moduleIndex } = req.body;
    if (moduleIndex === undefined) {
      return res.status(400).json({ message: 'moduleIndex is required' });
    }

    const user = await optionalUser(req);
    if (!user) {
      return res.json({
        success: true,
        completed: true,
        message: 'Guest progress acknowledged',
      });
    }

    const courseId = req.params.id;
    if (!user.completedLessons) {
      user.completedLessons = [];
    }

    const existingIndex = user.completedLessons.findIndex(
      (l) => l.courseId?.toString() === courseId && l.moduleIndex === Number(moduleIndex)
    );

    let isCompletedNow = false;
    if (existingIndex > -1) {
      // Unmark
      user.completedLessons.splice(existingIndex, 1);
      isCompletedNow = false;
    } else {
      // Mark as completed
      user.completedLessons.push({
        courseId,
        moduleIndex: Number(moduleIndex),
        completedAt: new Date(),
      });
      isCompletedNow = true;
    }

    await user.save();

    const updatedCompleted = user.completedLessons
      .filter((l) => l.courseId?.toString() === courseId)
      .map((l) => l.moduleIndex);

    return res.json({
      success: true,
      completed: isCompletedNow,
      completedModules: updatedCompleted,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
