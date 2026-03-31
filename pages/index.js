import React, { useMemo, useState } from 'react';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export default function RobloxDiscordLookupSite() {
  const [robloxQuery, setRobloxQuery] = useState('');
  const [robloxLoading, setRobloxLoading] = useState(false);
  const [robloxError, setRobloxError] = useState('');
  const [robloxData, setRobloxData] = useState(null);

  const [discordQuery, setDiscordQuery] = useState('');
  const [discordLoading, setDiscordLoading] = useState(false);
  const [discordError, setDiscordError] = useState('');
  const [discordData, setDiscordData] = useState(null);
  const [activeTab, setActiveTab] = useState('roblox');

  const robloxProfileUrl = useMemo(() => {
    if (!robloxData?.id) return null;
    return `https://www.roblox.com/users/${robloxData.id}/profile`;
  }, [robloxData]);

  async function searchRoblox() {
    setRobloxLoading(true);
    setRobloxError('');
    setRobloxData(null);

    try {
      const username = robloxQuery.trim();
      if (!username) throw new Error('Enter a Roblox username.');

      const userLookup = await fetchJson('https://users.roblox.com/v1/usernames/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernames: [username],
          excludeBannedUsers: false,
        }),
      });

      const basic = userLookup?.data?.[0];
      if (!basic?.id) throw new Error('Roblox user not found.');

      const [details, avatar, friends, followers, following] = await Promise.all([
        fetchJson(`https://users.roblox.com/v1/users/${basic.id}`),
        fetchJson(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${basic.id}&size=420x420&format=Png&isCircular=false`),
        fetchJson(`https://friends.roblox.com/v1/users/${basic.id}/friends/count`),
        fetchJson(`https://friends.roblox.com/v1/users/${basic.id}/followers/count`),
        fetchJson(`https://friends.roblox.com/v1/users/${basic.id}/followings/count`),
      ]);

      setRobloxData({
        ...details,
        avatarUrl: avatar?.data?.[0]?.imageUrl || '',
        friendsCount: friends?.count ?? null,
        followersCount: followers?.count ?? null,
        followingCount: following?.count ?? null,
      });
    } catch (err) {
      setRobloxError(err.message || 'Failed to look up Roblox user.');
    } finally {
      setRobloxLoading(false);
    }
  }

  async function searchDiscord() {
    setDiscordLoading(true);
    setDiscordError('');
    setDiscordData(null);

    try {
      const value = discordQuery.trim();
      if (!value) throw new Error('Enter a Discord user ID or username.');

      // Demo-only frontend behavior.
      // A real Discord lookup must be done through YOUR backend using your bot token,
      // and practical lookups should prefer user IDs over arbitrary usernames.
      const isNumericId = /^\d{17,20}$/.test(value);

      if (!isNumericId) {
        throw new Error(
          'Public Discord username search is not reliably available from a browser-only site. Use a backend + bot and preferably search by user ID.'
        );
      }

      // Replace /api/discord-user with your own backend endpoint.
      const result = await fetchJson(`/api/discord-user?id=${encodeURIComponent(value)}`);
      setDiscordData(result);
    } catch (err) {
      setDiscordError(err.message || 'Failed to look up Discord user.');
    } finally {
      setDiscordLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#18181b', color: 'white' }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .card { border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; background: rgba(255,255,255,0.05); padding: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
        .input { flex: 1; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; background: rgba(0,0,0,0.2); color: white; font-size: 1rem; outline: none; font-family: inherit; }
        .input:focus { border-color: rgba(255,255,255,0.3); background: rgba(0,0,0,0.3); }
        .button { padding: 0.75rem 1.5rem; border: none; border-radius: 1rem; background: #3b82f6; color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 1rem; }
        .button:hover:not(:disabled) { background: #2563eb; }
        .button:disabled { opacity: 0.5; cursor: not-allowed; }
        .alert { padding: 1rem; border: 1px solid; border-radius: 0.75rem; margin-bottom: 1rem; }
        .alert-error { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: rgb(254,226,226); }
        .alert-warning { border-color: rgba(217,119,6,0.3); background: rgba(217,119,6,0.1); color: rgb(254,243,199); }
        .tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .tab-button { padding: 0.75rem 1.5rem; border: none; border-bottom: 2px solid transparent; background: transparent; color: white; cursor: pointer; font-weight: 500; transition: all 0.2s; font-family: inherit; font-size: 1rem; }
        .tab-button.active { border-bottom-color: #3b82f6; color: #3b82f6; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
        .info-card { border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; background: rgba(0,0,0,0.2); padding: 1.25rem; }
        .info-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgb(161,161,170); margin-bottom: 0.5rem; }
        .info-value { font-size: 1.125rem; font-weight: 600; color: rgb(228,228,231); word-break: break-word; }
        .flex-row { display: flex; flex-direction: column; gap: 0.75rem; }
        @media (min-width: 640px) { .flex-row { flex-direction: row; } }
        .avatar { width: 8rem; height: 8rem; border-radius: 0.75rem; margin-bottom: 1rem; object-fit: cover; }
        .avatar-circle { width: 8rem; height: 8rem; border-radius: 50%; margin-bottom: 1rem; object-fit: cover; }
        .profile-link { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1rem; color: #3b82f6; text-decoration: none; }
        .profile-link:hover { text-decoration: underline; }
        .code-block { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; margin-top: 1.5rem; }
        pre { margin: 0; padding: 1rem; color: rgb(190,190,190); font-size: 0.75rem; line-height: 1.4; overflow-x: auto; }
      `}</style>

      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ borderRadius: '1rem', background: 'rgba(255,255,255,0.1)', padding: '0.75rem' }}>
              <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', letterSpacing: '-0.025em', margin: 0 }}>User Lookup Hub</h1>
              <p style={{ fontSize: '0.875rem', color: 'rgb(212,212,216)', margin: '0.5rem 0 0 0' }}>
                Search Roblox users now, with a Discord lookup section ready for backend integration.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'roblox' ? 'active' : ''}`}
              onClick={() => setActiveTab('roblox')}
            >
              Roblox Search
            </button>
            <button 
              className={`tab-button ${activeTab === 'discord' ? 'active' : ''}`}
              onClick={() => setActiveTab('discord')}
            >
              Discord Search
            </button>
          </div>

          {activeTab === 'roblox' && (
            <div className="card">
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User style={{ width: '1.25rem', height: '1.25rem' }} /> Roblox Username Lookup
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex-row">
                  <input
                    className="input"
                    type="text"
                    placeholder="Enter a Roblox username"
                    value={robloxQuery}
                    onChange={(e) => setRobloxQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchRoblox()}
                  />
                  <button 
                    className="button" 
                    onClick={searchRoblox} 
                    disabled={robloxLoading}
                  >
                    {robloxLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {robloxError && (
                  <div className="alert alert-error">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m8-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{robloxError}</span>
                    </div>
                  </div>
                )}

                {robloxData && (
                  <div>
                    {robloxData.avatarUrl && (
                      <img 
                        src={robloxData.avatarUrl} 
                        alt={robloxData.name}
                        className="avatar"
                      />
                    )}
                    <div className="info-grid">
                      <div className="info-card">
                        <div className="info-label">Username</div>
                        <div className="info-value">{robloxData.name}</div>
                      </div>
                      <div className="info-card">
                        <div className="info-label">User ID</div>
                        <div className="info-value">{robloxData.id}</div>
                      </div>
                      <div className="info-card">
                        <div className="info-label">Created</div>
                        <div className="info-value">{new Date(robloxData.created).toLocaleDateString()}</div>
                      </div>
                      <div className="info-card">
                        <div className="info-label">Friends</div>
                        <div className="info-value">{safeCount(robloxData.friendsCount)}</div>
                      </div>
                      <div className="info-card">
                        <div className="info-label">Followers</div>
                        <div className="info-value">{safeCount(robloxData.followersCount)}</div>
                      </div>
                      <div className="info-card">
                        <div className="info-label">Following</div>
                        <div className="info-value">{safeCount(robloxData.followingCount)}</div>
                      </div>
                    </div>
                    {robloxProfileUrl && (
                      <a 
                        href={robloxProfileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="profile-link"
                      >
                        View Profile 
                        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'discord' && (
            <div className="card">
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Discord User Lookup
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="alert alert-warning">
                  <strong>Note:</strong> Discord user lookup requires a bot token configured on the backend. Public username search is not available from a browser. Use a user ID (17-20 digits) for best results.
                </div>

                <div className="flex-row">
                  <input
                    className="input"
                    type="text"
                    placeholder="Enter a Discord user ID"
                    value={discordQuery}
                    onChange={(e) => setDiscordQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchDiscord()}
                  />
                  <button 
                    className="button" 
                    onClick={searchDiscord} 
                    disabled={discordLoading}
                  >
                    {discordLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {discordError && (
                  <div className="alert alert-error">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m8-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{discordError}</span>
                    </div>
                  </div>
                )}

                {discordData && (
                  <div>
                    {discordData.avatar && (
                      <img 
                        src={`https://cdn.discordapp.com/avatars/${discordData.id}/${discordData.avatar}.png`}
                        alt={discordData.username}
                        className="avatar-circle"
                      />
                    )}
                    <div className="info-grid">
                      <div className="info-card">
                        <div className="info-label">Username</div>
                        <div className="info-value">{discordData.username}</div>
                      </div>
                      <div className="info-card">
                        <div className="info-label">User ID</div>
                        <div className="info-value">{discordData.id}</div>
                      </div>
                      <div className="info-card">
                        <div className="info-label">Created</div>
                        <div className="info-value">{new Date((discordData.id / 4194304) + 1420070400000).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="code-block">
                  <pre>{`// /pages/api/discord-user.js (Next.js example)
export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }

  const r = await fetch(\`https://discord.com/api/v10/users/\${id}\`, {
    headers: {
      Authorization: \`Bot \${process.env.DISCORD_BOT_TOKEN}\`,
    },
  });

  const data = await r.json();
  return res.status(r.status).json(data);
}`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function safeCount(value) {
  return value === null || value === undefined ? 'Unknown' : String(value);
}
