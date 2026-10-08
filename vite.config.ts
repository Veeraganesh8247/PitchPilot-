import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

function geminiCoachApiPlugin(): Plugin {
  return {
    name: 'gemini-coach-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/coach/')) {
          return next();
        }

        // Helper to parse JSON body
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = body ? JSON.parse(body) : {};
            const apiKey = process.env.GEMINI_API_KEY;
            
            if (req.url === '/api/coach/analyze') {
              if (!apiKey) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ fallback: true }));
              }

              const ai = new GoogleGenAI();
              const prompt = `You are Vocalis Coach, an elite executive speech coach and venture pitch advisor for founders and C-suite leaders.
Analyze this rehearsal presentation:
- Presentation Title: "${data.deckTitle || 'Untitled Presentation'}"
- Duration: ${data.durationSec || 180} seconds
- Average Cadence: ${data.averageWpm || 140} WPM (Target: 130-150 WPM)
- Filler Word Count: ${data.fillerCount || 0}
- Spoken Transcript:
"""${data.transcript || 'No transcript available.'}"""

Provide a rigorous, actionable coaching diagnostic in JSON format with exactly the following keys:
{
  "executiveHeadline": "A single compelling executive diagnostic sentence",
  "summary": "2-3 paragraphs assessing vocal delivery, pacing rhythm, presence, and investor resonance",
  "strengths": ["3 specific delivery strengths observed"],
  "priorityFixes": ["3 high-leverage fixes with tangible physical/vocal cues"],
  "recommendedDrills": [
    {
      "id": "drill-ai-1",
      "title": "Title of custom vocal drill",
      "targetSkill": "Pacing Control",
      "durationMinutes": 3,
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "sampleSentence": "A high-impact drill sentence"
    }
  ]
}
Return only valid JSON.`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json'
                }
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(response.text || '{}');
            }

            if (req.url === '/api/coach/ask') {
              if (!apiKey) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ fallback: true }));
              }

              const ai = new GoogleGenAI();
              const prompt = `You are Vocalis Coach, an elite public speaking and executive communication coach.
The speaker asks: "${data.question}"
Context: Presentation "${data.context?.deckTitle || 'General'}", Avg WPM: ${data.context?.averageWpm || 'N/A'}, Fillers: ${data.context?.fillerCount || 'N/A'}.

Provide a tactical, empathetic, and actionable answer (under 160 words). Include a micro-drill if applicable. Return in JSON:
{
  "answer": "Clear, direct coaching advice",
  "drillRecommendation": "A 1-minute actionable vocal drill"
}`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json'
                }
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(response.text || '{}');
            }

            if (req.url === '/api/coach/polish') {
              if (!apiKey) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ fallback: true }));
              }

              const ai = new GoogleGenAI();
              const prompt = `You are an executive speechwriter. Polish the following speaker notes to be punchy, rhythmic, and stage-ready with clear cadence cues:
Original: "${data.rawScript}"
Tone: ${data.targetTone || 'punchy'}

Return JSON:
{
  "polishedScript": "The polished executive version with vocal emphasis cues"
}`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json'
                }
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(response.text || '{}');
            }

            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (error) {
            console.error('Gemini API endpoint error:', error);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ fallback: true, error: (error as Error).message }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiCoachApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

