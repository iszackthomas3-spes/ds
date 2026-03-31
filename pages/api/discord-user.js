// /pages/api/discord-user.js
export default async function handler(req, res) {
  const { id, userId } = req.query;
  const queryId = id || userId;

  if (!queryId) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  // Check if bot token is configured
  if (!process.env.DISCORD_BOT_TOKEN) {
    return res.status(500).json({ error: 'Discord bot token not configured' });
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${queryId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch Discord user' });
  }
}
