import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import toolRoutes from './routes/tools.js';
import categoryRoutes from './routes/categories.js';
import searchRoutes from './routes/search.js';
import learningRoutes from './routes/learning.js';
import projectRoutes from './routes/projects.js';
import roadmapRoutes from './routes/roadmaps.js';
import communityRoutes from './routes/community.js';
import openSourceRoutes from './routes/openSource.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_nexus';

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/open-source', openSourceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AI Nexus Core Engine',
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Root API test
app.get('/api', (req, res) => {
  res.json({
    name: 'AI Nexus API',
    version: '1.0.0',
    description: 'Neural Discovery & Learning Gateway API',
    endpoints: [
      '/api/auth',
      '/api/tools',
      '/api/categories',
      '/api/search',
      '/api/learning',
      '/api/projects',
      '/api/roadmaps',
      '/api/community',
    ],
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

let server;

function startServer(mode = 'standard') {
  if (server) return;
  server = app.listen(PORT, () => {
    if (mode === 'fallback') {
      console.log(`⚠️ AI Nexus Server listening on http://localhost:${PORT} (offline DB fallback mode)`);
    } else {
      console.log(`🚀 AI Nexus Backend Server listening on http://localhost:${PORT}`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} in use, waiting to retry...`);
      setTimeout(() => {
        if (server) server.close();
        server = null;
        startServer(mode);
      }, 1000);
    } else {
      console.error('Server error:', err);
    }
  });
}

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('⚡ Connected to MongoDB (ai_nexus)');
    await seedDatabase();
    startServer('standard');
  })
  .catch((err) => {
    console.error('⚠️ MongoDB Connection Error:', err.message);
    startServer('fallback');
  });

process.once('SIGUSR2', () => {
  if (server) server.close(() => process.kill(process.pid, 'SIGUSR2'));
});
process.on('SIGINT', () => {
  if (server) server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  if (server) server.close(() => process.exit(0));
});
