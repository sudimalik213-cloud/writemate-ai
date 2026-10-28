import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Helper to get Gemini Client safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Category guidelines mapping
const categoryInstructions: Record<string, string> = {
  'Essay': 'Write a well-structured essay with an engaging introduction, structured body paragraphs with supporting arguments or evidence, and a thoughtful conclusion.',
  'Paragraph': 'Write a single, coherent, well-developed paragraph that addresses the subject clearly and directly.',
  'Social Media Caption': 'Write a catchy, modern social media caption. Include a strong opening hook, concise message, an engaging call-to-action (CTA), and 3-5 relevant hashtags.',
  'Instagram Post': 'Craft a visually evocative Instagram post with a scroll-stopping first line hook, readable spacing and short paragraphs, call-to-action, and 5-8 targeted hashtags.',
  'Facebook Post': 'Write a conversational, community-oriented Facebook post that invites engagement, shares a relatable perspective or story, and asks a friendly question.',
  'YouTube Video Description': 'Write an SEO-optimized YouTube video description with a compelling summary hook, key discussion points or timestamp placeholders, links placeholder, and relevant search tags.',
  'YouTube Video Script': 'Provide a high-energy video script with clear markers: [Hook/Intro], [Main Body Points/Visual Cues], and [Outro with Call to Subscribe and Like].',
  'Product Description': 'Write a high-converting product description with an eye-catching headline, benefit-driven narrative, bulleted key features/specifications, and a persuasive call to buy.',
  'Professional Email': 'Write a business email including a clear Subject Line, professional greeting, polite and direct body text, actionable next step, and professional sign-off.',
  'Personal Message': 'Write an authentic, warm, personal message suited for close friends, family, or colleagues.',
  'Birthday Wish': 'Write a warm, celebratory, heartfelt birthday greeting that feels personal, memorable, and uplifting.',
  'Story': 'Write an engaging narrative with vivid imagery, relatable characters, natural dialogue, a compelling conflict or dilemma, and a memorable resolution.',
  'Blog Article': 'Write a formatted blog post with a captivating title, introduction hook, formatted H2/H3 subheadings, actionable insights, and a concluding takeaway.',
  'Business Ideas': 'Provide innovative and feasible business concept proposals. Detail the problem solved, target customer, value proposition, revenue model, and key advantages.',
  'Advertisement Copy': 'Write persuasive ad copy utilizing direct-response copywriting principles (Attention, Interest, Desire, Action), highlighting pain points and clear benefits.',
  'Speech': 'Write an inspiring and rhetorical speech with an attention-grabbing opening, 2-3 memorable core points, evocative pacing, and an uplifting closing call to action.',
  'Summary': 'Provide a concise, high-impact summary capturing the core premise, critical takeaways, and bulleted highlights without filler words.',
  'Application or Formal Letter': 'Write a formal letter or application with standard formal structure: recipient block placeholder, date placeholder, clear Subject line, formal salutation, background & qualifications, polite request, and formal sign-off.',
};

// Language guidelines mapping
const languageInstructions: Record<string, string> = {
  'English': 'Write in fluent, natural, grammatically correct English.',
  'Urdu': 'Write completely in authentic, natural Urdu script (اردو). Use proper Urdu grammar, poetic and polite expressions where appropriate, and correct spelling. Do NOT write in English or transliterated Latin script.',
  'Roman Urdu': 'Write completely in Roman Urdu (Urdu language written using Latin/English alphabet phonetics, e.g., "Aap sab ko khushamdeed...", "Yeh bohot zaroori hai ke hum..."). Ensure natural Pakistani/South Asian phrasing, easy readability, and conversational or formal depth as requested.',
};

// Tone guidelines mapping
const toneInstructions: Record<string, string> = {
  'Professional': 'Tone must be polished, articulate, respectful, authoritative, and business-ready.',
  'Friendly': 'Tone must be warm, approachable, empathetic, encouraging, and welcoming.',
  'Casual': 'Tone must be relaxed, natural, conversational, and everyday authentic.',
  'Formal': 'Tone must be dignified, respectful, ceremonial, and thoroughly etiquette-conscious.',
  'Creative': 'Tone must be imaginative, expressive, poetic, vivid, and artistically engaging.',
  'Funny': 'Tone must be witty, playful, entertaining, and humorous while remaining tasteful.',
  'Persuasive': 'Tone must be compelling, influential, decisive, and focused on driving agreement or action.',
  'Inspirational': 'Tone must be uplifting, motivational, empowering, and deeply energizing.',
  'Simple': 'Tone must be crystal clear, straightforward, jargon-free, and easy for anyone to understand.',
};

// Length guidelines mapping
const lengthInstructions: Record<string, string> = {
  'Short': 'Length: Short and concise. Deliver the core message punchily in 50-120 words (or 1-2 tight paragraphs / bullet points) without fluff.',
  'Medium': 'Length: Moderate and balanced. Provide standard depth in 150-300 words with thorough elaboration.',
  'Long': 'Length: In-depth and detailed. Deliver an expansive, well-developed piece of 400-700 words with rich detail, supporting points, or thorough sections.',
};

// Text generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      topic,
      category = 'Paragraph',
      language = 'English',
      tone = 'Professional',
      length = 'Medium',
    } = req.body || {};

    // Input Validation
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({
        error: 'Please enter a topic or instructions before generating text.',
      });
    }

    const trimmedTopic = topic.trim();
    if (trimmedTopic.length > 2500) {
      return res.status(400).json({
        error: 'Topic instructions are too long. Please keep under 2,500 characters.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please check your environment variables.',
      });
    }

    const ai = getGeminiClient();

    const catGuidance = categoryInstructions[category] || `Create content formatted as a ${category}.`;
    const langGuidance = languageInstructions[language] || 'Write in English.';
    const toneGuidance = toneInstructions[tone] || 'Maintain a balanced, helpful tone.';
    const lengthGuidance = lengthInstructions[length] || 'Provide moderate length.';

    const systemInstruction = `You are WriteMate AI, a professional, world-class writing assistant and text generator.
Your mission is to produce high-quality, engaging, and ready-to-use content based on user instructions.

CRITICAL INSTRUCTIONS:
1. Language: ${langGuidance}
2. Format & Category: ${catGuidance}
3. Tone: ${toneGuidance}
4. Length: ${lengthGuidance}
5. Direct Output Only: Provide ONLY the requested content directly. Do NOT prepend conversational filler (e.g., "Sure, here is your...", "Here is an essay on...", "I would be happy to help..."). Do NOT append sign-offs (e.g., "Hope you found this helpful!").
6. Formatting: Use neat, clean Markdown spacing, paragraphs, bullet points, or section headings where appropriate for the category.
7. Originality & Quality: Ensure fresh, insightful, and natural writing that fulfills the user's specific topic and parameters thoroughly.`;

    const userPrompt = `Topic / Request:
"${trimmedTopic}"

Settings:
- Category: ${category}
- Language: ${language}
- Tone: ${tone}
- Desired Length: ${length}

Generate the final content now:`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];
    let lastError: any = null;
    let generatedText = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.75,
          },
        });

        const textResult = response.text?.trim();
        if (textResult) {
          generatedText = textResult;
          break;
        }
      } catch (modelErr: any) {
        lastError = modelErr;
        const errMsg = modelErr?.message || '';
        // If it's a 503 high demand spike or 429, try the next model
        if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE') || errMsg.includes('429')) {
          console.warn(`Model ${modelName} unavailable due to demand, trying fallback...`);
          continue;
        }
        // If it's another fatal error (e.g., auth, bad request), break early
        break;
      }
    }

    if (!generatedText) {
      if (lastError) {
        throw lastError;
      }
      return res.status(502).json({
        error: 'The AI model completed the request but returned an empty response. Please try modifying your prompt.',
      });
    }

    return res.json({
      text: generatedText,
      category,
      language,
      tone,
      length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Text generation error:', error);

    let clientMessage = 'Failed to generate text. Please try again.';
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid API key')) {
      clientMessage = 'Invalid Gemini API key. Please check your configuration.';
    } else if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('rate limit')) {
      clientMessage = 'Gemini rate limit exceeded. Please wait a few moments and try again.';
    } else if (error.message) {
      // General error message without leaking sensitive internal credentials
      clientMessage = `Generation failed: ${error.message}`;
    }

    return res.status(500).json({ error: clientMessage });
  }
});

// Configure Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WriteMate AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
