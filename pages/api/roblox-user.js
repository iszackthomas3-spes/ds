// /pages/api/roblox-user.js
export default async function handler(req, res) {
  const { username, id } = req.query;

  if (!username && !id) {
    return res.status(400).json({ error: 'Missing username or id' });
  }

  try {
    let response;
    let profile;

    if (username) {
      // Try to get user by username first
      response = await fetch(`https://users.roblox.com/v1/users/get-by-username?username=${encodeURIComponent(username)}`);
      if (response.ok) {
        profile = await response.json();
      } else if (response.status === 404 && /^\d+$/.test(username)) {
        // If username lookup fails and input looks like an ID, try ID lookup
        response = await fetch(`https://users.roblox.com/v1/users/${encodeURIComponent(username)}`);
        if (response.ok) {
          profile = await response.json();
        }
      }
    } else if (id) {
      // Direct ID lookup
      response = await fetch(`https://users.roblox.com/v1/users/${encodeURIComponent(id)}`);
      if (response.ok) {
        profile = await response.json();
      }
    }

    if (!response || !response.ok) {
      const errorData = response ? await response.json().catch(() => ({})) : {};
      return res.status(response?.status || 500).json({
        error: errorData.errors?.[0]?.message || `Roblox API error: ${response?.status || 'Unknown'}`
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Roblox API error:', error);
    return res.status(500).json({ error: 'Failed to fetch Roblox user' });
  }
}