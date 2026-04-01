import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('roblox');
  const [robloxQuery, setRobloxQuery] = useState('');
  const [discordQuery, setDiscordQuery] = useState('');
  const [robloxResult, setRobloxResult] = useState(null);
  const [discordResult, setDiscordResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayedTitle, setDisplayedTitle] = useState('');
  
  const fullTitle = 'BloxyFlips Info';
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

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

      const params = isNumeric
        ? `id=${encodeURIComponent(input)}`
        : `username=${encodeURIComponent(input)}`;

      const response = await fetch(`/api/roblox-user?${params}`);
      const body = await response.json();

      if (!response.ok) {
        setError(`Roblox lookup failed: ${body.error ?? body.errors?.[0]?.message ?? response.statusText}`);
      } else if (!body.id && !body.data) {
        setError('User not found. Try a different username or ID.');
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

  const tabStyles = {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: '8px 8px 0 0',
    border: '2px solid #00ff88',
    borderBottom: '0',
    color: '#00ff88',
    cursor: 'pointer',
    marginRight: '8px',
    backgroundColor: 'rgba(0, 20, 40, 0.6)',
    fontWeight: 'bold',
    textShadow: '0 0 10px #00ff88',
    transition: 'all 0.3s ease'
  };

  const activeTabStyles = {
    ...tabStyles,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    boxShadow: '0 0 20px #00ff88, inset 0 0 10px rgba(0, 255, 136, 0.2)'
  };

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes neon {
          0%, 100% { text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88; }
          50% { text-shadow: 0 0 30px #00ff88, 0 0 60px #00ff88, 0 0 80px #ff00ff; }
        }
        body { margin: 0; padding: 0; }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #001f3f, #003d7a, #1a005e, #2a0845)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        color: '#fff',
        fontFamily: "'Arial', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '10%',
          left: '10%',
          animation: 'float 20s ease-in-out infinite',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '15%',
          right: '10%',
          animation: 'float 25s ease-in-out infinite reverse',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: 48, 
              marginBottom: 8,
              animation: 'neon 3s ease-in-out infinite',
              fontWeight: 'bold',
              letterSpacing: '3px'
            }}>
              {displayedTitle}
              {displayedTitle.length < fullTitle.length && <span style={{ animation: 'pulse 1s infinite' }}>|</span>}
            </h1>
            <p style={{ marginBottom: 24, color: '#00ff88', fontSize: 16, textShadow: '0 0 10px rgba(0, 255, 136, 0.5)', fontWeight: 'bold' }}>
              ⚡ Insane Roblox & Discord Lookup Tool ⚡
            </p>
          </div>

          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <button
              onClick={() => setActiveTab('roblox')}
              style={activeTab === 'roblox' ? activeTabStyles : tabStyles}
              onMouseEnter={(e) => {
                if (activeTab !== 'roblox') {
                  e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'roblox') {
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              🎮 ROBLOX
            </button>
            <button
              onClick={() => setActiveTab('discord')}
              style={activeTab === 'discord' ? activeTabStyles : tabStyles}
              onMouseEnter={(e) => {
                if (activeTab !== 'discord') {
                  e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'discord') {
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              💬 DISCORD
            </button>
          </div>

          <div style={{
            border: '3px solid #00ff88',
            borderRadius: 15,
            padding: 24,
            backgroundColor: 'rgba(10, 28, 52, 0.85)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.2), inset 0 0 20px rgba(0, 255, 136, 0.05)',
            backdropFilter: 'blur(10px)'
          }}>
            {activeTab === 'roblox' && (
              <form onSubmit={searchRoblox}>
                <label style={{ display: 'block', marginBottom: 12, fontSize: 16, fontWeight: 'bold', color: '#00ff88', textShadow: '0 0 10px rgba(0, 255, 136, 0.5)' }}>
                  🎮 Enter Roblox Username or ID
                </label>
                <input
                  value={robloxQuery}
                  onChange={(e) => setRobloxQuery(e.target.value)}
                  placeholder="e.g. builderman or 1"
                  style={{
                    width: '100%',
                    padding: 14,
                    marginBottom: 12,
                    borderRadius: 8,
                    border: '2px solid #00ff88',
                    backgroundColor: 'rgba(15, 27, 54, 0.8)',
                    color: '#00ff88',
                    fontSize: 14,
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.1)',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4), inset 0 0 10px rgba(0, 255, 136, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.1)';
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    border: '2px solid #00ff88',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                    boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    fontSize: 14
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';
                      e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.2)';
                      e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.2)';
                    }
                  }}
                >
                  ⚡ SEARCH
                </button>

                {robloxResult && (
                  <div style={{ marginTop: 20, backgroundColor: 'rgba(0, 255, 136, 0.05)', padding: 16, borderRadius: 10, border: '2px solid rgba(0, 255, 136, 0.3)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)' }}>
                    <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                      <div style={{ color: '#00ff88', fontWeight: 'bold', marginBottom: 8 }}>✅ User Found</div>
                      <div><strong style={{ color: '#00ff88' }}>ID:</strong> <span style={{ color: '#fff' }}>{robloxResult.id}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>Username:</strong> <span style={{ color: '#fff' }}>{robloxResult.name}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>Display Name:</strong> <span style={{ color: '#fff' }}>{robloxResult.displayName || '(none)'}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>Created:</strong> <span style={{ color: '#fff' }}>{new Date(robloxResult.created).toLocaleString()}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>Is Banned:</strong> <span style={{ color: robloxResult.isBanned ? '#ff6b6b' : '#00ff88', fontWeight: 'bold' }}>{robloxResult.isBanned ? 'Yes ❌' : 'No ✓'}</span></div>
                    </div>
                  </div>
                )}
              </form>
            )}

            {activeTab === 'discord' && (
              <form onSubmit={searchDiscord}>
                <label style={{ display: 'block', marginBottom: 12, fontSize: 16, fontWeight: 'bold', color: '#00ff88', textShadow: '0 0 10px rgba(0, 255, 136, 0.5)' }}>
                  💬 Enter Discord User ID
                </label>
                <input
                  value={discordQuery}
                  onChange={(e) => setDiscordQuery(e.target.value)}
                  placeholder="Ex. 80351110224678912"
                  style={{
                    width: '100%',
                    padding: 14,
                    marginBottom: 12,
                    borderRadius: 8,
                    border: '2px solid #00ff88',
                    backgroundColor: 'rgba(15, 27, 54, 0.8)',
                    color: '#00ff88',
                    fontSize: 14,
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.1)',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4), inset 0 0 10px rgba(0, 255, 136, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.1)';
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    border: '2px solid #00ff88',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                    boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)',
                    opacity: loading ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    fontSize: 14
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';
                      e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.2)';
                      e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.2)';
                    }
                  }}
                >
                  ⚡ SEARCH
                </button>

                {discordResult && (
                  <div style={{ marginTop: 20, backgroundColor: 'rgba(0, 255, 136, 0.05)', padding: 16, borderRadius: 10, border: '2px solid rgba(0, 255, 136, 0.3)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)' }}>
                    <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                      <div style={{ color: '#00ff88', fontWeight: 'bold', marginBottom: 12 }}>✅ User Found</div>
                      <div><strong style={{ color: '#00ff88' }}>ID:</strong> <span style={{ color: '#fff' }}>{discordResult.id}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>Username:</strong> <span style={{ color: '#fff' }}>{discordResult.username}#{discordResult.discriminator}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>Bot:</strong> <span style={{ color: discordResult.bot ? '#ff6b6b' : '#00ff88' }}>{discordResult.bot ? 'Yes 🤖' : 'No'}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>System:</strong> <span style={{ color: discordResult.system ? '#ff6b6b' : '#00ff88' }}>{discordResult.system ? 'Yes' : 'No'}</span></div>
                      <div><strong style={{ color: '#00ff88' }}>Created:</strong> <span style={{ color: '#fff' }}>{new Date((BigInt(discordResult.id) >> 22n) + 1420070400000n).toLocaleString()}</span></div>
                      {discordResult.avatar && (
                        <div style={{ marginTop: 14 }}>
                          <img
                            alt="Discord avatar"
                            src={`https://cdn.discordapp.com/avatars/${discordResult.id}/${discordResult.avatar}.png?size=256`}
                            width={100}
                            height={100}
                            style={{ borderRadius: 12, border: '3px solid #00ff88', boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            )}

            {loading && <p style={{ color: '#00ff88', marginTop: 12, fontSize: 16, fontWeight: 'bold', textShadow: '0 0 10px rgba(0, 255, 136, 0.5)', animation: 'pulse 1.5s infinite' }}>⚡ Loading...</p>}
            {error && <p style={{ color: '#ff6b6b', marginTop: 12, fontSize: 14, fontWeight: 'bold', textShadow: '0 0 10px rgba(255, 107, 107, 0.5)', padding: '10px', backgroundColor: 'rgba(255, 107, 107, 0.1)', borderRadius: 8, border: '2px solid #ff6b6b' }}>❌ {error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

