import dotenv from 'dotenv';
dotenv.config();

// API key must be set in .env — never hardcode secrets in source code
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Fallback order — use reliable models only
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
];

/**
 * Call Google Gemini API with automatic model fallback
 */
export async function callGemini(prompt, systemInstruction = '', responseFormat = 'json') {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      if (responseFormat === 'json') {
        payload.generationConfig.responseMimeType = 'application/json';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`[Gemini] ${model} returned ${response.status}: ${errorBody.slice(0, 180)}`);
        // If 503 (high demand) or 404/429, try next model in candidate list
        if ([503, 404, 429].includes(response.status)) {
          lastError = new Error(`Model ${model} status ${response.status}`);
          continue;
        }
        throw new Error(`Gemini API error [${response.status}]: ${errorBody}`);
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textOutput) {
        throw new Error('Empty content received from Gemini');
      }

      if (responseFormat === 'json') {
        try {
          return { data: JSON.parse(textOutput), modelUsed: model };
        } catch (parseErr) {
          const cleaned = textOutput.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          return { data: JSON.parse(cleaned), modelUsed: model };
        }
      }

      return { data: textOutput, modelUsed: model };
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] Attempt with ${model} failed: ${err.message}. Trying next candidate...`);
    }
  }

  throw lastError || new Error('All Gemini candidate models failed.');
}

/**
 * Intelligent semantic tool search with Gemini
 */
export async function searchToolsWithGeminiAI(userQuery, existingToolsSnippet = []) {
  const systemInstruction = `You are the Neural AI Discovery Engine for "AI Nexus", the frontier AI tools and workflows platform.
Your task is to analyze the user's natural language search query and recommend the most effective, cutting-edge AI tools.

Format output as strictly valid JSON matching this schema:
{
  "summary": "1-2 sentence direct neural insight answering the user's workflow needs and introducing top picks",
  "tools": [
    {
      "name": "Exact or standard tool name (e.g. Cursor, Runway Gen-3, Claude 3.7 Sonnet, ElevenLabs, v0, Midjourney v7)",
      "category": "AI Coding | AI Video | AI Audio & Voice | AI Image | AI Reasoning | AI Agent | AI 3D | AI Productivity | AI Marketing",
      "whyRecommended": "Concise 1-2 sentence explanation of why this specific tool excels for the user's prompt",
      "pricing": "Free | Freemium | Paid | Open Source",
      "tags": ["tag1", "tag2"],
      "website": "https://..."
    }
  ],
  "suggestedCategories": ["Category 1", "Category 2"],
  "relatedQueries": ["Related query 1", "Related query 2", "Related query 3"]
}

Rules:
- Recommend 3 to 8 tools.
- Include frontier, state-of-the-art tools (Cursor, Claude, OpenAI, Runway, Midjourney, ElevenLabs, DeepSeek, Suno, FLUX, v0, Bolt.new, Perplexity, n8n, etc.).
- Be crisp, practical, and accurate.`;

  const prompt = `User search query: "${userQuery}"

Available tools in database for reference:
${existingToolsSnippet
  .map((t) => `- ${t.name} (${t.category}): ${t.description.slice(0, 90)}`)
  .slice(0, 40)
  .join('\n')}

Analyze user query, identify the best matching AI tools with explanations, and output JSON.`;

  const result = await callGemini(prompt, systemInstruction, 'json');
  return { ...result.data, modelUsed: result.modelUsed };
}

/**
 * Verify Gemini API key status
 */
export async function testGeminiConnection() {
  try {
    const res = await callGemini('Return JSON: {"status":"connected"}', 'Health check', 'json');
    return { connected: true, model: res.modelUsed, details: res.data };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
