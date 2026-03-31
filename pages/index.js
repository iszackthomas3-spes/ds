import React, { useMemo, useState } from 'react';
import { Search, User, Shield, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Lookup Hub</h1>
              <p className="text-sm text-zinc-300">
                Search Roblox users now, with a Discord lookup section ready for backend integration.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="roblox" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/5">
            <TabsTrigger value="roblox" className="rounded-2xl">Roblox Search</TabsTrigger>
            <TabsTrigger value="discord" className="rounded-2xl">Discord Search</TabsTrigger>
          </TabsList>

          <TabsContent value="roblox">
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5" /> Roblox Username Lookup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={robloxQuery}
                    onChange={(e) => setRobloxQuery(e.target.value)}
                    placeholder="Enter Roblox username"
                    className="border-white/10 bg-black/30 text-white placeholder:text-zinc-400"
                    onKeyDown={(e) => e.key === 'Enter' && searchRoblox()}
                  />
                  <Button onClick={searchRoblox} disabled={robloxLoading} className="rounded-2xl">
                    {robloxLoading ? 'Searching...' : 'Search Roblox'}
                  </Button>
                </div>

                {robloxError && (
                  <Alert className="border-red-500/30 bg-red-500/10 text-red-100">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{robloxError}</AlertDescription>
                  </Alert>
                )}

                {robloxData && (
                  <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <Card className="rounded-3xl border-white/10 bg-black/20 text-white">
                      <CardContent className="flex flex-col items-center gap-4 p-6">
                        {robloxData.avatarUrl ? (
                          <img
                            src={robloxData.avatarUrl}
                            alt={robloxData.displayName || robloxData.name}
                            className="h-44 w-44 rounded-3xl object-cover"
                          />
                        ) : (
                          <div className="flex h-44 w-44 items-center justify-center rounded-3xl bg-white/10">
                            <User className="h-12 w-12 text-zinc-300" />
                          </div>
                        )}
                        <div className="text-center">
                          <h2 className="text-2xl font-bold">{robloxData.displayName || robloxData.name}</h2>
                          <p className="text-zinc-300">@{robloxData.name}</p>
                        </div>
                        {robloxProfileUrl && (
                          <a
                            href={robloxProfileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-zinc-200 underline"
                          >
                            Open Roblox profile <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <InfoCard label="User ID" value={String(robloxData.id)} />
                      <InfoCard label="Account Status" value={robloxData.isBanned ? 'Banned' : 'Active'} />
                      <InfoCard label="Friends" value={safeCount(robloxData.friendsCount)} />
                      <InfoCard label="Followers" value={safeCount(robloxData.followersCount)} />
                      <InfoCard label="Following" value={safeCount(robloxData.followingCount)} />
                      <InfoCard label="Has Premium" value={robloxData.hasVerifiedBadge ? 'Verified badge' : 'No verified badge'} />
                      <InfoCard label="Description" value={robloxData.description || 'No public description'} wide />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discord">
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-5 w-5" /> Discord User Lookup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-100">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Discord lookup by arbitrary username is not something a browser-only public site can do reliably. The practical setup is: enter a Discord user ID, then query your own backend route using your bot token.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={discordQuery}
                    onChange={(e) => setDiscordQuery(e.target.value)}
                    placeholder="Enter Discord user ID"
                    className="border-white/10 bg-black/30 text-white placeholder:text-zinc-400"
                    onKeyDown={(e) => e.key === 'Enter' && searchDiscord()}
                  />
                  <Button onClick={searchDiscord} disabled={discordLoading} className="rounded-2xl">
                    {discordLoading ? 'Searching...' : 'Search Discord'}
                  </Button>
                </div>

                {discordError && (
                  <Alert className="border-red-500/30 bg-red-500/10 text-red-100">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{discordError}</AlertDescription>
                  </Alert>
                )}

                {discordData && (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <InfoCard label="User ID" value={discordData.id || 'Unknown'} />
                    <InfoCard label="Username" value={discordData.username || 'Unknown'} />
                    <InfoCard label="Global Name" value={discordData.global_name || 'None'} />
                    <InfoCard label="Bot" value={discordData.bot ? 'Yes' : 'No'} />
                  </div>
                )}

                <Card className="rounded-3xl border-white/10 bg-black/20 text-white">
                  <CardContent className="p-6">
                    <p className="mb-3 text-sm font-semibold text-zinc-200">Setup Instructions</p>
                    <ol className="space-y-2 text-sm text-zinc-300">
                      <li>1. Create a Discord application at <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-blue-400 underline">discord.com/developers</a></li>
                      <li>2. Create a bot and copy the bot token</li>
                      <li>3. Add to your Vercel environment variables: <code className="bg-black/50 px-2 py-1 rounded">DISCORD_BOT_TOKEN</code></li>
                      <li>4. Redeploy your Vercel project</li>
                    </ol>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InfoCard({ label, value, wide = false }) {
  return (
    <Card className={`rounded-3xl border-white/10 bg-black/20 text-white ${wide ? 'md:col-span-2 xl:col-span-4' : ''}`}>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{label}</p>
        <p className="mt-2 break-words text-lg font-semibold text-zinc-100">{value}</p>
      </CardContent>
    </Card>
  );
}

function safeCount(value) {
  return value === null || value === undefined ? 'Unknown' : String(value);
}
