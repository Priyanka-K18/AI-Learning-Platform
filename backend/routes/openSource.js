import express from 'express';
import OpenSourceRepo from '../models/OpenSourceRepo.js';
import { openSourceReposData } from '../opensource_data.js';

const router = express.Router();

// GET /api/open-source/stats
router.get('/stats', async (req, res) => {
  try {
    const repos = await OpenSourceRepo.find({});
    // If database is empty, fallback to local dataset stats
    const dataset = repos.length > 0 ? repos : openSourceReposData;

    const categoryCounts = {};
    const languageCounts = {};
    const difficultyCounts = {};

    dataset.forEach((repo) => {
      categoryCounts[repo.category] = (categoryCounts[repo.category] || 0) + 1;
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
      if (repo.difficulty) {
        difficultyCounts[repo.difficulty] = (difficultyCounts[repo.difficulty] || 0) + 1;
      }
    });

    res.json({
      total: dataset.length,
      categoryCounts,
      languageCounts,
      difficultyCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/open-source
router.get('/', async (req, res) => {
  try {
    const {
      category,
      language,
      difficulty,
      isBeginnerFriendly,
      q,
      sort = 'stars',
      page = 1,
      limit = 50,
    } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (language && language !== 'All') {
      query.language = new RegExp(`^${language}$`, 'i');
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (isBeginnerFriendly === 'true') {
      query.isBeginnerFriendly = true;
    }

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { repoOwner: regex },
        { repoName: regex },
        { techStack: regex },
      ];
    }

    let sortOption = { stars: -1 };
    if (sort === 'alpha') {
      sortOption = { name: 1 };
    } else if (sort === 'recent') {
      sortOption = { updatedAt: -1, createdAt: -1 };
    } else if (sort === 'difficulty') {
      sortOption = { difficulty: 1 };
    }

    let repos = await OpenSourceRepo.find(query).sort(sortOption);

    // Fallback to memory dataset if database hasn't finished seeding
    if (repos.length === 0 && (await OpenSourceRepo.countDocuments()) === 0) {
      let filtered = [...openSourceReposData];
      if (category && category !== 'All') {
        filtered = filtered.filter((r) => r.category === category);
      }
      if (language && language !== 'All') {
        filtered = filtered.filter((r) => r.language.toLowerCase() === language.toLowerCase());
      }
      if (difficulty && difficulty !== 'All') {
        filtered = filtered.filter((r) => r.difficulty === difficulty);
      }
      if (isBeginnerFriendly === 'true') {
        filtered = filtered.filter((r) => r.isBeginnerFriendly);
      }
      if (q && q.trim()) {
        const queryTerm = q.trim().toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(queryTerm) ||
            r.description.toLowerCase().includes(queryTerm) ||
            r.repoOwner.toLowerCase().includes(queryTerm) ||
            r.techStack.some((t) => t.toLowerCase().includes(queryTerm))
        );
      }
      if (sort === 'alpha') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
      }
      repos = filtered;
    }

    const total = repos.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedRepos = repos.slice(startIndex, startIndex + Number(limit));

    res.json({
      repos: paginatedRepos,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/open-source/:id
router.get('/:id', async (req, res) => {
  try {
    let repo = null;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      repo = await OpenSourceRepo.findById(req.params.id);
    }
    if (!repo) {
      repo = await OpenSourceRepo.findOne({
        $or: [
          { repoName: req.params.id },
          { name: new RegExp(`^${req.params.id}$`, 'i') },
        ],
      });
    }

    // Memory fallback
    if (!repo) {
      repo = openSourceReposData.find(
        (r) =>
          r.repoName === req.params.id ||
          r.name.toLowerCase() === req.params.id.toLowerCase() ||
          r._id === req.params.id
      );
    }

    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    res.json(repo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
