export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { bullet, prof, tone, jd } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "API key missing" });

  try {
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey, // ← ici, X-API-Key obligatoire
      },
      body: JSON.stringify({
        model: "claude-2",
        prompt: `Ton prompt ici avec bullet: ${bullet}, prof: ${prof}, tone: ${tone}, jd: ${jd}`,
        max_tokens_to_sample: 300 // Anthropic utilise max_tokens_to_sample, pas max_tokens
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}