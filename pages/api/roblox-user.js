// /pages/api/roblox-user.js
export default async function handler(req, res) {
  const { username, id } = req.query;

  if (!username && !id) {
    return res.status(400).json({ error: 'Missing username or id' });
  }

  try {
    let profile;

    if (username) {
      // Try to get user by username
      let response = await fetch(`https://users.roblox.com/v1/users/get-by-username?username=${encodeURIComponent(username)}`);
      
      if (response.ok) {
        const data = await response.json();
        // The response has a 'user' property
        profile = data.user || data;
      } else if (/^\d+$/.test(username)) {
        // If username lookup fails and input is numeric, try ID lookup
        response = await fetch(`https://users.roblox.com/v1/users/${encodeURIComponent(username)}`);
        if (response.ok) {
          profile = await response.json();
        } else {
          return res.status(404).json({ error: 'User not found' });
        }
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } else if (id) {
      // Direct ID lookup
      const response = await fetch(`https://users.roblox.com/v1/users/${encodeURIComponent(id)}`);
      if (response.ok) {
        profile = await response.json();
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Roblox API error:', error);
    return res.status(500).json({ error: 'Failed to fetch Roblox user' });
  }
}