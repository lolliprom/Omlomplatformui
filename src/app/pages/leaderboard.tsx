import { useMemo, useState } from "react";
import { Crown, Medal, Trophy, Zap } from "lucide-react";

import { buildLeaderboards } from "../demo-data";
import { useGameStore } from "../store/game-store";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

type LeaderboardTab = "global" | "guild" | "weekly";

const medalForRank = (rank: number) => {
  if (rank === 1) {
    return <Crown className="h-5 w-5 text-amber-500" />;
  }

  if (rank === 2) {
    return <Medal className="h-5 w-5 text-slate-400" />;
  }

  if (rank === 3) {
    return <Medal className="h-5 w-5 text-orange-500" />;
  }

  return <span className="text-sm font-medium text-slate-500">#{rank}</span>;
};

export default function Leaderboard() {
  const { profile, stats } = useGameStore();
  const [tab, setTab] = useState<LeaderboardTab>("global");
  const boards = buildLeaderboards(profile, stats);

  const selectedBoard = useMemo(() => boards[tab], [boards, tab]);
  const playerEntry = selectedBoard.find((entry) => entry.isPlayer);
  const rivalEntry =
    playerEntry && playerEntry.rank > 1
      ? selectedBoard[playerEntry.rank - 2]
      : undefined;
  const gapToNext =
    tab === "weekly"
      ? Math.max(0, (rivalEntry?.weeklyXp ?? 0) - (playerEntry?.weeklyXp ?? 0))
      : Math.max(0, (rivalEntry?.xp ?? 0) - (playerEntry?.xp ?? 0));

  return (
    <div className="px-4 pb-24 pt-5 space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Competitive loop</p>
          <h1 className="text-3xl text-slate-950">Leaderboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Compare XP, weekly lift, and guild standing during the product sprint.
          </p>
        </div>
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          {profile.guild}
        </Badge>
      </section>

      <Card className="border-0 bg-[linear-gradient(135deg,#1d4ed8_0%,#0f172a_100%)] p-5 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-blue-100">
              Current position
            </p>
            <h2 className="text-3xl">#{playerEntry?.rank ?? "-"}</h2>
            <p className="max-w-xs text-sm text-blue-100/90">
              {tab === "weekly"
                ? `${stats.weeklyXp} weekly XP on the board.`
                : `${stats.xp} total XP and ${stats.tasksCompleted} cleared quests.`}
            </p>
          </div>
          <Trophy className="h-12 w-12 text-amber-300" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs uppercase tracking-wide text-blue-100">Level</p>
            <p className="mt-1 text-2xl">{stats.level}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs uppercase tracking-wide text-blue-100">Gap to next</p>
            <p className="mt-1 text-2xl">{gapToNext || 0}</p>
          </div>
        </div>
      </Card>

      <Tabs className="w-full" onValueChange={(value) => setTab(value as LeaderboardTab)} value={tab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="guild">Guild</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-3" value="global">
          {boards.global.map((entry) => (
            <Card
              className={`border p-4 shadow-sm ${
                entry.isPlayer
                  ? "border-indigo-200 bg-indigo-50/80"
                  : "border-slate-200 bg-white/95"
              }`}
              key={entry.userId}
            >
              <div className="flex items-center gap-3">
                <div className="flex w-9 items-center justify-center">
                  {medalForRank(entry.rank)}
                </div>

                <Avatar>
                  <AvatarFallback
                    className={`${
                      entry.isPlayer ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"
                    }`}
                  >
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-950">{entry.username}</p>
                    {entry.isPlayer && <Badge variant="secondary">You</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">
                    {entry.guild} - {entry.tasksCompleted} quests - {entry.streak} day streak
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">XP</p>
                  <p className="text-sm font-medium text-slate-950">{entry.xp}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent className="space-y-3" value="guild">
          {boards.guild.map((entry) => (
            <Card
              className={`border p-4 shadow-sm ${
                entry.isPlayer
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-slate-200 bg-white/95"
              }`}
              key={entry.userId}
            >
              <div className="flex items-center gap-3">
                <div className="flex w-9 items-center justify-center">
                  {medalForRank(entry.rank)}
                </div>

                <Avatar>
                  <AvatarFallback
                    className={`${
                      entry.isPlayer ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
                    }`}
                  >
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-950">{entry.username}</p>
                    {entry.isPlayer && <Badge variant="secondary">You</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">
                    Level {entry.level} - {entry.tasksCompleted} quests - {entry.focusMinutes} focused min
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">XP</p>
                  <p className="text-sm font-medium text-slate-950">{entry.xp}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent className="space-y-3" value="weekly">
          {boards.weekly.map((entry) => (
            <Card
              className={`border p-4 shadow-sm ${
                entry.isPlayer
                  ? "border-amber-200 bg-amber-50/80"
                  : "border-slate-200 bg-white/95"
              }`}
              key={entry.userId}
            >
              <div className="flex items-center gap-3">
                <div className="flex w-9 items-center justify-center">
                  {medalForRank(entry.rank)}
                </div>

                <Avatar>
                  <AvatarFallback
                    className={`${
                      entry.isPlayer ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-white"
                    }`}
                  >
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-950">{entry.username}</p>
                    {entry.isPlayer && <Badge variant="secondary">You</Badge>}
                  </div>
                  <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Zap className="h-3.5 w-3.5" />
                    {entry.weeklyXp} weekly XP - {entry.focusMinutes} focused min
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Streak</p>
                  <p className="text-sm font-medium text-slate-950">{entry.streak}d</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
