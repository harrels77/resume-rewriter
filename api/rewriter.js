import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { bullet, prof, tone, jd } = req.body;

  if (!bullet) return res.status(400).json({ error: "Bullet is required" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.ANTHROPIC_API_KEY, // ta clé côté serveur
      },
      body: JSON.stringify({
        model: "claude-2",
        prompt: bullet, // tu peux utiliser ton promptTemplate ici
        max_tokens_to_sample: 500,
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}