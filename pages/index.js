import { useState } from 'react';

const tabStyles = {
  display: 'inline-block',
  padding: '10px 18px',
  borderRadius: '8px 8px 0 0',
  border: '1px solid #333',
  borderBottom: '0',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '8px',
  backgroundColor: '#222'
};

const activeTabStyles = {
  ...tabStyles,
  backgroundColor: '#1d4ed8'
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('roblox');
  const [robloxQuery, setRobloxQuery] = useState('');
  const [discordQuery, setDiscordQuery] = useState('');
  const [robloxResult, setRobloxResult] = useState(null);
  const [discordResult, setDiscordResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function searchRoblox(e) {
    e.preventDefault();
    setError('');
    setRobloxResult(null);
    if (!robloxQuery.trim()) {
      setError('Roblox username or ID required.');
      return;
    }

    setLoading(true);
    try {
      const input = robloxQuery.trim();
      const isNumeric = /^\d+$/.test(input);

      // Use our API route instead of calling Roblox directly
      const params = isNumeric
        ? `id=${encodeURIComponent(input)}`
        : `username=${encodeURIComponent(input)}`;

      const response = await fetch(`/api/roblox-user?${params}`);
      const body = await response.json();

      if (!response.ok) {
        setError(`Roblox lookup failed: ${body.error ?? response.statusText}`);
      } else {
        setRobloxResult(body);
      }
    } catch (err) {
      setError('Roblox lookup error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function searchDiscord(e) {
    e.preventDefault();
    setError('');
    setDiscordResult(null);
    if (!discordQuery.trim()) {
      setError('Discord user ID required.');
      return;
    }

    setLoading(true);
    try {
      const id = discordQuery.trim();
      const response = await fetch(`/api/discord-user?userId=${encodeURIComponent(id)}`);
      const body = await response.json();

      if (!response.ok) {
        setError(`Discord lookup failed: ${body.error ?? response.statusText}`);
      } else {
        setDiscordResult(body);
      }
    } catch (err) {
      setError('Discord lookup error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b1220',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 34, marginBottom: 8 }}>Roblox + Discord Lookup</h1>
        <p style={{ marginBottom: 24, color: '#cfd8ea' }}>
          Search a Roblox username/ID or Discord user ID.
        </p>

        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setActiveTab('roblox')}
            style={activeTab === 'roblox' ? activeTabStyles : tabStyles}
          >
            Roblox
          </button>
          <button
            onClick={() => setActiveTab('discord')}
            style={activeTab === 'discord' ? activeTabStyles : tabStyles}
          >
            Discord
          </button>
        </div>

        <div style={{
          border: '1px solid #2d3a58',
          borderRadius: 10,
          padding: 20,
          backgroundColor: '#101c34'
        }}>
          {activeTab === 'roblox' && (
            <form onSubmit={searchRoblox}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                Roblox username or id
              </label>
              <input
                value={robloxQuery}
                onChange={(e) => setRobloxQuery(e.target.value)}
                placeholder="e.g. builderman or 1"
                style={{
                  width: '100%',
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 6,
                  border: '1px solid #3d4f76',
                  backgroundColor: '#0f1b36',
                  color: '#fff'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Look up Roblox user
              </button>

              {robloxResult && (
                <div style={{ marginTop: 18, backgroundColor: '#122343', padding: 14, borderRadius: 8 }}>
                  <strong>ID:</strong> {robloxResult.id} <br />
                  <strong>Username:</strong> {robloxResult.name} <br />
                  <strong>Display name:</strong> {robloxResult.displayName || '(none)'} <br />
                  <strong>Created:</strong> {new Date(robloxResult.created).toLocaleString()} <br />
                  <strong>Is banned:</strong> {robloxResult.isBanned ? 'Yes' : 'No'}
                </div>
              )}
            </form>
          )}

          {activeTab === 'discord' && (
            <form onSubmit={searchDiscord}>
              <label style={{ display: 'block', marginBottom: 8 }}>
                Discord user ID
              </label>
              <input
                value={discordQuery}
                onChange={(e) => setDiscordQuery(e.target.value)}
                placeholder="Ex. 80351110224678912"
                style={{
                  width: '100%',
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 6,
                  border: '1px solid #3d4f76',
                  backgroundColor: '#0f1b36',
                  color: '#fff'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Look up Discord user
              </button>

              {discordResult && (
                <div style={{ marginTop: 18, backgroundColor: '#122343', padding: 14, borderRadius: 8 }}>
                  <strong>ID:</strong> {discordResult.id} <br />
                  <strong>Username:</strong> {discordResult.username}#{discordResult.discriminator}<br />
                  <strong>Bot:</strong> {discordResult.bot ? 'Yes' : 'No'}<br />
                  <strong>System:</strong> {discordResult.system ? 'Yes' : 'No'}<br />
                  <strong>Created (approx):</strong> {new Date((BigInt(discordResult.id) >> 22n) + 1420070400000n).toLocaleString()} <br />
                  {discordResult.avatar && (
                    <div style={{ marginTop: 8 }}>
                      <img
                        alt="Discord avatar"
                        src={`https://cdn.discordapp.com/avatars/${discordResult.id}/${discordResult.avatar}.png?size=256`}
                        width={80}
                        height={80}
                        style={{ borderRadius: 999 }}
                      />
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {loading && <p style={{ color: '#91a7ff' }}>Loading...</p>}
          {error && <p style={{ color: '#f87171', marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

