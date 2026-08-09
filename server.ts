import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini initialization
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API & Crawler Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "RaphaAtlas Sovereign Journal Engine", timestamp: new Date().toISOString() });
});

// AI & Search Crawler Endpoints
app.get("/robots.txt", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
});

app.get(["/llms.txt", "/llm.txt"], (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.sendFile(path.join(process.cwd(), "public", "llms.txt"));
});

app.get("/sitemap.xml", (_req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Core Pages & Primary Pillars -->
  <url>
    <loc>https://www.raphaatlas.com/</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/calculators</loc>
    <lastmod>2026-08-09</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/body-type-calculator</loc>
    <lastmod>2026-08-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/macro-calculator</loc>
    <lastmod>2026-08-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/bac-calculator</loc>
    <lastmod>2026-08-09</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/ai-tools</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/lifestyle</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/fitness</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/medical</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- About & Contact Pages -->
  <url>
    <loc>https://www.raphaatlas.com/about</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/contact</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Interactive System & Architecture Views -->
  <url>
    <loc>https://www.raphaatlas.com/content-matrix</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/architecture</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/tech-integration</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/user-journeys</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- AI & Machine Readable Discovery Files -->
  <url>
    <loc>https://www.raphaatlas.com/sitemap.xml</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/robots.txt</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/llms.txt</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/llm.txt</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Clinical & Evidence-Based Publications -->
  <url>
    <loc>https://www.raphaatlas.com/article/apob-cholesterol-lipid-biomarkers-decoded</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/circadian-light-adenosine-deep-sleep-protocol</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/shoulder-extension-thoracic-mobility-ring-dips</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/symptom-triage-red-flags-doctor-questions-guide</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/continuous-glucose-monitoring-metabolic-flexibility</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/zone-2-aerobic-base-vo2max-mitochondrial-longevity</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Legacy Article Route Aliases -->
  <url>
    <loc>https://www.raphaatlas.com/article/apob-lipids-cardiovascular-prevention</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/circadian-light-sleep-hygiene-adenosine</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/ring-dips-shoulder-mobility-prehab</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.raphaatlas.com/article/opqrst-symptom-triage-doctor-visit-guide</loc>
    <lastmod>2026-08-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>`;
  res.send(xml);
});

// AI Content Categorization Route (for user's content strategy)
app.post("/api/ai/categorize-content", async (req, res) => {
  try {
    const { contentText, contentType } = req.body;
    if (!contentText || typeof contentText !== "string") {
      res.status(400).json({ error: "Missing or invalid contentText parameter." });
      return;
    }

    const ai = getAiClient();
    const prompt = `You are the lead Chief Content Officer and Architecture Strategist for "RaphaAtlas.com" (a top-tier all-in-one health platform).
Analyze the following draft content or topic and organize it into the RaphaAtlas website taxonomy.

Primary Taxonomy Categories:
1. LIFESTYLE (Sleep, Stress, Circadian Health, Biohacking, Mental Wellness, Daily Habits)
2. FITNESS (Strength, Calisthenics, Functional Training, Mobility/Rehab, Cardio, Custom Routines)
3. MEDICAL (Preventive Medicine, Lab Interpretation, Medical Jargon, Telehealth, Symptom Context)
4. AI HEALTH TOOLS (Interactive Calculators, Symptom Analyzers, AI Coaches, Diagnostics Assistants)

Draft Content / Topic to analyze:
"""
${contentText}
"""

Return a JSON object with this exact structure:
{
  "suggestedTitle": "Catchy, professional SEO title for RaphaAtlas.com",
  "primaryCategory": "LIFESTYLE | FITNESS | MEDICAL | AI HEALTH TOOLS",
  "subCategory": "e.g. Biohacking & Longevity or Mobility & Rehab",
  "targetPersona": "e.g. Busy Executive / Longevity Seeker / Athlete in Rehab",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "executiveSummary": "2-3 sentence overview of the content",
  "recommendedFormat": "In-Depth Article / Video Guide / Interactive Calculator / Infographic",
  "internalLinkingOpportunities": ["Related Tool name", "Related Section name"],
  "contentQualityScore": 88,
  "actionableTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error("Error in categorize-content:", err);
    res.status(500).json({ error: err.message || "Failed to analyze content." });
  }
});

// AI Health Tool Sandbox Route
app.post("/api/ai/tool-demo", async (req, res) => {
  try {
    const { toolType, query, userContext } = req.body;
    if (!toolType || !query) {
      res.status(400).json({ error: "Missing toolType or query." });
      return;
    }

    const ai = getAiClient();
    let systemInstruction = "You are RaphaAtlas AI, an expert health, fitness, and medical information assistant. Always provide clear, evidence-informed, compassionate guidance. Include appropriate medical safety disclaimers when medical context is involved.";

    let prompt = "";

    if (toolType === "jargon_simplifier") {
      prompt = `Simplify and explain the following medical jargon, lab value, or diagnosis in clear plain English for a non-expert patient.
Jargon/Lab Input: "${query}"
Include:
1. Simple Definition (layman's terms)
2. Normal Range or Context (if applicable)
3. Why it matters for health
4. Key questions to ask your doctor`;
    } else if (toolType === "symptom_contextualizer") {
      prompt = `Provide an educational contextual analysis for these symptoms: "${query}".
User context: ${userContext || "General Adult"}

Provide:
1. Potential Educational Causes (non-diagnostic)
2. Triage Urgency Level (Self-Care / Schedule Doctor Visit / Urgent Care / Immediate ER)
3. Comfort measures / Home Care tips if safe
4. Red Flag Warnings that require urgent evaluation`;
    } else if (toolType === "lifestyle_habit_planner") {
      prompt = `Design a personalized daily routine & lifestyle optimization protocol for: "${query}".
User context: ${userContext || "Standard Lifestyle"}

Provide:
1. Morning Circadian Protocol
2. Nutrition & Energy Strategy
3. Stress Reduction & Work Focus Routine
4. Evening Sleep Preparation Stack`;
    } else if (toolType === "workout_mobility_coach") {
      prompt = `Design an evidence-based fitness or mobility routine for: "${query}".
User context: ${userContext || "Intermediate Fitness"}

Provide:
1. Warm-up & Joint Prep
2. Main Movement Progression (with sets/reps)
3. Form Cues & Common Mistakes
4. Recovery & Mobility Cool-down`;
    } else {
      prompt = `Respond to this RaphaAtlas health platform query: "${query}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    res.json({ success: true, answer: response.text, toolType });
  } catch (err: any) {
    console.error("Error in tool-demo:", err);
    res.status(500).json({ error: err.message || "Failed to execute AI tool demo." });
  }
});

// RaphaAtlas Platform AI Assistant Route
app.post("/api/ai/assistant", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const ai = getAiClient();
    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction: `You are the RaphaAtlas Intelligence Suite — the official AI representative and health navigation assistant for RaphaAtlas.com.
RaphaAtlas.com is an all-in-one health platform spanning 4 primary pillars:
1. LIFESTYLE: Circadian rhythms, sleep, stress management, biohacking, nutrition.
2. FITNESS: Calisthenics, functional strength, hypertrophy, mobility, injury rehabilitation.
3. MEDICAL: Medical term simplification, lab result explanations, preventive screening guides, telehealth navigation.
4. AI HEALTH TOOLS: On-demand AI utilities for symptoms, workouts, nutrition, and medical clarity.

When users ask questions about architecture, health topics, or site strategy, respond directly, structurally, and professionally. Always mention RaphaAtlas pillars when relevant and maintain an encouraging, authoritative tone. Include a brief medical disclaimer for clinical topics.`,
      },
    });

    const response = await chat.sendMessage({ message });
    res.json({ success: true, reply: response.text });
  } catch (err: any) {
    console.error("Error in AI assistant:", err);
    res.status(500).json({ error: err.message || "Failed to process chat message." });
  }
});

// Start Express Server with Vite Middleware in Dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // SPA Fallback Route for Development Mode
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RaphaAtlas server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
