import express from 'express';
import AITool from '../models/AITool.js';
import Category from '../models/Category.js';
import LearningResource from '../models/LearningResource.js';
import { searchToolsWithGeminiAI, testGeminiConnection } from '../services/geminiService.js';

const router = express.Router();

/**
 * GET /api/search/gemini/status
 * Check Gemini API connectivity and active model
 */
router.get('/gemini/status', async (req, res) => {
  try {
    const status = await testGeminiConnection();
    return res.json(status);
  } catch (error) {
    return res.status(500).json({ connected: false, error: error.message });
  }
});

/**
 * Handle Gemini-powered intelligent search
 */
async function handleGeminiSearch(query, res) {
  if (!query || !query.trim()) {
    const popularTools = await AITool.find().limit(8).sort({ rating: -1 });
    return res.json({
      query: '',
      aiPowered: true,
      summary: 'Explore cutting-edge frontier AI tools across coding, video, audio, agents, and design.',
      results: popularTools,
      categories: [],
      relatedQueries: [
        'Best coding copilots in 2026',
        'Top AI video synthesis engines',
        'Open source voice cloning models',
        'Autonomous AI agents for research',
      ],
      total: popularTools.length,
    });
  }

  const cleanQuery = query.trim();

  try {
    // 1. Fetch relevant existing tools from DB to feed as context
    const sampleTools = await AITool.find(
      {},
      { name: 1, category: 1, description: 1, pricing: 1, rating: 1, website: 1, tags: 1, logo: 1 }
    )
      .limit(80)
      .sort({ rating: -1 });

    // 2. Query Gemini for semantic tool recommendations & insights
    const geminiResponse = await searchToolsWithGeminiAI(cleanQuery, sampleTools);

    // 3. Match Gemini's recommended tools with database documents
    const recommendedNames = (geminiResponse.tools || []).map((t) => t.name.trim());
    const matchedFromDb = [];

    for (const recTool of geminiResponse.tools || []) {
      const escapedName = recTool.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const dbDoc = await AITool.findOne({
        $or: [
          { name: new RegExp(`^${escapedName}$`, 'i') },
          { name: new RegExp(escapedName, 'i') },
        ],
      });

      if (dbDoc) {
        const enriched = dbDoc.toObject();
        enriched.geminiRationale = recTool.whyRecommended;
        enriched.isGeminiRecommended = true;
        matchedFromDb.push(enriched);
      } else {
        // Construct tool card for recommended frontier tool not yet in DB
        matchedFromDb.push({
          _id: `gemini-${recTool.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: recTool.name,
          category: recTool.category || 'AI Frontier',
          description: recTool.whyRecommended,
          geminiRationale: recTool.whyRecommended,
          pricing: recTool.pricing || 'Freemium',
          website: recTool.website || `https://www.google.com/search?q=${encodeURIComponent(recTool.name + ' AI tool')}`,
          rating: 4.8,
          tags: recTool.tags || ['AI', 'Recommended'],
          verified: true,
          isGeminiRecommended: true,
        });
      }
    }

    // 4. Also fetch keyword-matching tools from DB to ensure high recall
    const regex = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const keywordMatches = await AITool.find({
      $or: [
        { name: regex },
        { description: regex },
        { tags: { $in: [regex] } },
      ],
      name: { $nin: matchedFromDb.map((m) => m.name) },
    })
      .limit(6)
      .sort({ rating: -1 });

    const finalResults = [...matchedFromDb, ...keywordMatches];

    return res.json({
      query: cleanQuery,
      aiPowered: true,
      modelUsed: geminiResponse.modelUsed || 'Gemini 3.5 Flash',
      summary: geminiResponse.summary,
      results: finalResults,
      categories: geminiResponse.suggestedCategories || [],
      relatedQueries: geminiResponse.relatedQueries || [],
      total: finalResults.length,
    });
  } catch (geminiError) {
    console.error('Gemini Search fallback due to:', geminiError.message);

    // Fallback to keyword regex search if Gemini has issues
    const regex = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const fallbackTools = await AITool.find({
      $or: [{ name: regex }, { description: regex }, { category: regex }],
    })
      .limit(20)
      .sort({ rating: -1 });

    return res.json({
      query: cleanQuery,
      aiPowered: false,
      fallback: true,
      summary: `Found ${fallbackTools.length} matching AI tools for "${cleanQuery}".`,
      results: fallbackTools,
      categories: [],
      relatedQueries: [],
      total: fallbackTools.length,
    });
  }
}

/**
 * POST /api/search/gemini
 * Dedicated Gemini search route (JSON body: { query: "..." })
 */
router.post('/gemini', async (req, res) => {
  const query = req.body?.query || req.body?.q || '';
  return handleGeminiSearch(query, res);
});

/**
 * GET /api/search/gemini?q=...
 */
router.get('/gemini', async (req, res) => {
  const query = req.query.q || req.query.query || '';
  return handleGeminiSearch(query, res);
});

// GET /api/search?q=...
router.get('/', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    const useAI = req.query.ai === 'true' || req.query.gemini === 'true';

    if (useAI) {
      return handleGeminiSearch(query, res);
    }

    if (!query) {
      const popularTools = await AITool.find().limit(8).sort({ rating: -1 });
      const suggestions = [
        'Cursor AI code editor',
        'Midjourney image generator',
        'Runway Gen-3 video synthesis',
        'ElevenLabs voice cloning',
        'NotebookLM research assistant',
        'n8n autonomous workflows',
        'DeepSeek reasoning models',
        'Suno music synthesis',
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
          { subcategory: regex },
          { tags: { $in: [regex] } },
          { features: { $in: [regex] } },
          { useCases: { $in: [regex] } },
          { platforms: { $in: [regex] } },
        ],
      })
        .limit(60)
        .sort({ rating: -1 }),
      Category.find({
        $or: [{ name: regex }, { description: regex }],
      }).limit(8),
      LearningResource.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }],
      }).limit(6),
    ]);

    const suggestions = [
      'Cursor',
      'Midjourney',
      'Runway',
      'Claude',
      'ElevenLabs',
      'v0',
      'NotebookLM',
      'DeepSeek',
      'Perplexity',
      'Suno',
      'Make',
      'Figma AI',
      'Whimsical',
      'OpenEvidence',
      'Harvey AI',
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
