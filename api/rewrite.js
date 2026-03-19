export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bullet, prof, tone, jd, lang } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key missing on server" });
  }

  if (!bullet) {
    return res.status(400).json({ error: "No bullet provided" });
  }

  // Contextes selon la profession
  const profCtx = {
    general:    "general professional context",
    tech:       "tech / software development",
    marketing:  "marketing and growth",
    finance:    "finance and accounting",
    healthcare: "healthcare and medical",
    hr:         "human resources and talent",
  };

  // Contextes selon le ton
  const toneCtx = {
    professional: "clear and professional",
    bold:         "bold and direct with strong action verbs",
    executive:    "senior executive with strategic and business impact focus",
    creative:     "dynamic and vivid for creative industries",
  };

  const profText = profCtx[prof] || profCtx.general;
  const toneText = toneCtx[tone] || toneCtx.professional;

  // Prompt complet — demande du JSON structuré
  const prompt = `You are a world-class resume writer. Your task is to rewrite the following resume bullet point so it is dramatically stronger, more impactful, and results-focused.

CRITICAL RULES — you MUST follow all of these:
1. The rewritten versions MUST be measurably better than the original — if the original scores 3/10, the rewrite must score at least 7/10.
2. ALWAYS start with a strong action verb (Led, Generated, Reduced, Built, Launched, Increased, etc.).
3. ALWAYS include a specific result or impact — if the original has no numbers, estimate realistic ones (e.g. "saving ~4 hours/week", "serving 200+ customers daily").
4. NEVER use passive voice or weak phrases like "Responsible for", "Helped with", "Worked on", "Assisted in".
5. Each version must have a DIFFERENT style and length — short is punchy, standard is balanced, executive is strategic.
6. The explanation must name the SPECIFIC changes made and WHY they improve the bullet (not generic advice).

Field: ${profText}
Tone: ${toneText}
${jd ? "Target job description: " + jd.substring(0, 500) : ""}

Original bullet: "${bullet}"

Reply ONLY with valid JSON (no markdown, no backticks, no explanation outside the JSON):
{
  "score_avant": <integer 1-10 honestly scoring the original>,
  "score_apres": <integer 1-10 for the rewritten versions — must be at least 3 points higher>,
  "version_courte": "<punchy, max 12 words, one explosive action verb + one concrete result>",
  "version_standard": "<balanced, 15-22 words, strong verb + measurable impact + context>",
  "version_dirigeant": "<executive, 20-28 words, strategic language + business value + scope>",
  "explication": "<3 specific sentences: (1) what the main weakness of the original was, (2) what specific changes were made, (3) why these changes make it more compelling to a recruiter>"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 900,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Anthropic API error" });
    }

    // On renvoie directement le texte brut — index.html le parse en JSON
    return res.status(200).json(data);

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
