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
        setError(`Roblox lookup failed: ${body.error || body.errors?.[0]?.message || response.statusText}`);
      } else if (!body.id) {
        setError('User not found.');
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
        setError(`Discord lookup failed: ${body.error || response.statusText}`);
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
    <main style={styles.container}>
      <style>{styles.globalStyles}</style>

      {/* Animated background with natural elements */}
      <div style={styles.starsContainer}>
        {[...Array(80)].map((_, i) => (
          <div key={i} style={{
            ...styles.star,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 70}%`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      {/* Sun */}
      <div style={styles.sun} />

      {/* Moon */}
      <div style={styles.moon} />

      {/* Clouds */}
      <div style={{...styles.cloud, top: '15%', left: '5%', width: '180px'}} />
      <div style={{...styles.cloud, top: '25%', right: '8%', width: '220px', animationDirection: 'reverse'}} />
      <div style={{...styles.cloud, bottom: '20%', left: '10%', width: '200px', animationDelay: '3s'}} />

      {/* Lightning bolts (decorative) */}
      <div style={{...styles.lightning, top: '10%', right: '15%'}} />

      {/* Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>
          {displayedTitle}
          {displayedTitle.length < fullTitle.length && <span style={styles.cursor}>|</span>}
        </h1>

        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('roblox')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'roblox' ? styles.tabActive : styles.tabInactive)
            }}
          >
            🎮 Roblox
          </button>
          <button
            onClick={() => setActiveTab('discord')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'discord' ? styles.tabActive : styles.tabInactive)
            }}
          >
            💬 Discord
          </button>
        </div>

        <div style={styles.card}>
          {activeTab === 'roblox' && (
            <div style={styles.tabContent}>
              <form onSubmit={searchRoblox} style={styles.form}>
                <input
                  type="text"
                  placeholder="Enter Roblox username or ID..."
                  value={robloxQuery}
                  onChange={(e) => setRobloxQuery(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {error && <div style={styles.error}>{error}</div>}

              {robloxResult && (
                <div style={styles.result}>
                  <h2 style={styles.resultTitle}>{robloxResult.name}</h2>
                  <div style={styles.resultGrid}>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>ID:</span>
                      <span style={styles.value}>{robloxResult.id}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>Display Name:</span>
                      <span style={styles.value}>{robloxResult.displayName}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>Created:</span>
                      <span style={styles.value}>{new Date(robloxResult.created).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>Status:</span>
                      <span style={styles.value}>{robloxResult.isBanned ? '🚫 Banned' : '✅ Active'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'discord' && (
            <div style={styles.tabContent}>
              <form onSubmit={searchDiscord} style={styles.form}>
                <input
                  type="text"
                  placeholder="Enter Discord user ID..."
                  value={discordQuery}
                  onChange={(e) => setDiscordQuery(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {error && <div style={styles.error}>{error}</div>}

              {discordResult && (
                <div style={styles.result}>
                  <h2 style={styles.resultTitle}>{discordResult.username}</h2>
                  <div style={styles.resultGrid}>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>ID:</span>
                      <span style={styles.value}>{discordResult.id}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>Tag:</span>
                      <span style={styles.value}>{discordResult.username}#{discordResult.discriminator}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>Bot:</span>
                      <span style={styles.value}>{discordResult.bot ? '🤖 Yes' : '👤 No'}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.label}>Status:</span>
                      <span style={styles.value}>✅ User Found</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && <div style={styles.loading}>⏳ Searching...</div>}
        </div>
      </div>
    </main>
  );
}

const styles = {
  globalStyles: `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
    @keyframes slide {
      0% { transform: translateX(-30px); }
      100% { transform: translateX(100vw); }
    }
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  `,

  container: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #0a0e27 0%, #1a1a3e 20%, #2d1b4e 40%, #1e3c72 60%, #0a0e27 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    color: '#fff',
    padding: '20px',
  },

  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },

  star: {
    position: 'absolute',
    width: '2px',
    height: '2px',
    background: 'white',
    borderRadius: '50%',
    animation: 'twinkle 4s ease-in-out infinite',
    boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
  },

  sun: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    background: 'radial-gradient(circle, #ff9500, #ff6b35)',
    borderRadius: '50%',
    top: '8%',
    right: '8%',
    opacity: 0.2,
    boxShadow: '0 0 100px rgba(255, 107, 53, 0.3)',
  },

  moon: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle at 35% 35%, #ffffff, #e0f2fe)',
    borderRadius: '50%',
    top: '12%',
    left: '7%',
    opacity: 0.25,
    boxShadow: '0 0 60px rgba(255, 255, 255, 0.2) inset',
  },

  cloud: {
    position: 'absolute',
    height: '50px',
    background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.15), transparent 70%)',
    borderRadius: '50%',
    animation: 'float 25s linear infinite',
    opacity: 0.3,
  },

  lightning: {
    position: 'absolute',
    width: '4px',
    height: '80px',
    background: 'linear-gradient(180deg, #ff6b6b 0%, rgba(255, 107, 107, 0.3) 100%)',
    animation: 'slide 3s ease-in-out infinite',
    boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
    opacity: 0.6,
  },

  content: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '650px',
    width: '100%',
    textAlign: 'center',
  },

  title: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(120deg, #3b82f6, #8b5cf6, #ec4899, #f97316, #ffffff)',
    backgroundSize: '200% 200%',
    animation: 'gradient 6s ease infinite',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '20px',
    letterSpacing: '2px',
    textShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
  },

  cursor: {
    animation: 'twinkle 1s infinite',
    marginLeft: '5px',
  },

  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '25px',
  },

  tabButton: {
    padding: '12px 28px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#a8b3c1',
    backdropFilter: 'blur(10px)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: '2px',
  },

  tabActive: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },

  tabInactive: {
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.15)',
    },
  },

  card: {
    background: 'rgba(20, 28, 60, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '40px 35px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
  },

  tabContent: {
    width: '100%',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    marginBottom: '25px',
  },

  input: {
    padding: '14px 18px',
    fontSize: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    transition: 'all 0.3s ease',
    outline: 'none',
    backdropFilter: 'blur(10px)',
  },

  submitBtn: {
    padding: '14px 28px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
  },

  error: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '2px solid rgba(239, 68, 68, 0.5)',
    color: '#f87171',
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontWeight: '500',
  },

  loading: {
    color: '#6366f1',
    fontSize: '1.1rem',
    fontWeight: '600',
    padding: '20px',
    animation: 'twinkle 1.5s infinite',
  },

  result: {
    background: 'rgba(59, 130, 246, 0.12)',
    border: '2px solid rgba(59, 130, 246, 0.4)',
    borderRadius: '15px',
    padding: '25px',
    backdropFilter: 'blur(10px)',
  },

  resultTitle: {
    fontSize: '1.8rem',
    color: '#e0f2fe',
    marginBottom: '20px',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  resultGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },

  resultItem: {
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },

  label: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#cbd5e1',
    marginBottom: '5px',
    fontWeight: '500',
  },

  value: {
    display: 'block',
    color: '#e0f2fe',
    fontSize: '1rem',
    fontWeight: '600',
    wordBreak: 'break-all',
  },
};

