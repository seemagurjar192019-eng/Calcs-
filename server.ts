import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Gemini AI Math Tutor & Query Solver
// Supports both low-latency gemini-3.1-flash-lite and high-thinking gemini-3.1-pro-preview
app.post("/api/gemini/solve", async (req, res) => {
  try {
    const { prompt, mode = "standard", context } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid prompt" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured in the environment.",
        fallback: true,
      });
    }

    // Determine model and configuration based on requested mode
    // "fast" -> gemini-3.1-flash-lite for instant low-latency responses
    // "thinking" -> gemini-3.1-pro-preview with ThinkingLevel.HIGH for deep mathematical reasoning
    const isThinkingMode = mode === "thinking";
    const model = isThinkingMode ? "gemini-3.1-pro-preview" : "gemini-3.1-flash-lite";

    const systemInstruction = `You are the built-in precision mathematical engine and AI math tutor for Precision Calculator.
Provide concise, rigorous, mathematically accurate step-by-step explanations, derivations, and solutions.
Use LaTeX-style notation where appropriate (e.g. $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$).
${context ? `Current user workspace state: ${JSON.stringify(context)}` : ""}
Keep answers structured:
1. Direct Answer
2. Core Formula / Concept
3. Step-by-Step Derivation
4. Verification / Alternative View`;

    const config: any = {
      systemInstruction,
      temperature: 0.2,
    };

    if (isThinkingMode) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
      // Note: Do NOT set maxOutputTokens for thinking mode
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const outputText = response.text || "No solution generated.";
    return res.json({
      result: outputText,
      model,
      isThinkingMode,
    });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return res.status(500).json({
      error: err.message || "Failed to process calculation with Gemini AI",
    });
  }
});

// Natural Language to Math Expression parser (low latency using gemini-3.1-flash-lite)
app.post("/api/gemini/parse-voice", async (req, res) => {
  try {
    const { speechText } = req.body;
    if (!speechText) {
      return res.status(400).json({ error: "Missing speechText" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY not configured" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `Convert this spoken or natural language math query into a valid mathematical expression string suitable for a scientific calculator. Return ONLY raw JSON with format: {"expression": "...", "description": "..."}.
Examples:
- "twenty five percent of eight hundred forty" -> {"expression": "840 * 0.25", "description": "25% of 840"}
- "square root of 144 plus 5 squared" -> {"expression": "sqrt(144) + 5^2", "description": "√144 + 5²"}
- "derivative of x cubed plus 2x" -> {"expression": "diff(x^3 + 2*x, x)", "description": "d/dx(x³ + 2x)"}

User voice query: "${speechText}"`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Voice parse error:", err);
    return res.status(500).json({ error: err.message || "Failed to parse speech" });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Precision Calculator server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
