import { Link } from "react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  ArrowRight,
  CalendarClock,
  Coins,
  Flame,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  isPast,
  isToday,
  isTomorrow,
} from "date-fns";

import { buildLeaderboards, buildMomentum, calculateReward } from "../demo-data";
import { OmlomCharacter } from "../components/omlom-character";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { useGameStore } from "../store/game-store";

const priorityClasses = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-slate-200 bg-slate-50 text-slate-700",
} as const;

const chartConfig = {
  xp: {
    label: "XP",
    color: "#2563eb",
  },
} as const;

const formatDueLabel = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, "h:mm a")}`;
  }

  return format(date, "EEE, MMM d - h:mm a");
};

export default function Dashboard() {
  const { profile, stats, omlom, tasks, socialPosts } = useGameStore();

  const activeTasks = tasks
    .filter((task) => !task.completed)
    .sort((left, right) => left.dueDate.getTime() - right.dueDate.getTime());
  const dueTodayCount = activeTasks.filter((task) => isToday(task.dueDate)).length;
  const overdueCount = activeTasks.filter(
    (task) => isPast(task.dueDate) && !isToday(task.dueDate),
  ).length;
  const upcomingTasks = activeTasks.slice(0, 3);
  const momentum = buildMomentum(tasks);
  const leaderboards = buildLeaderboards(profile, stats);
  const playerRank =
    leaderboards.global.find((entry) => entry.isPlayer)?.rank ??
    leaderboards.global.length;
  const xpProgress = Math.min(100, (stats.xp / stats.nextLevelXp) * 100);
  const weeklyFocusProgress = Math.min(
    100,
    (stats.weeklyFocusMinutes / stats.weeklyGoalMinutes) * 100,
  );
  const latestPost = socialPosts[0];
  const xpToNextLevel = Math.max(0, stats.nextLevelXp - stats.xp);

  return (
    <div className="px-4 pb-24 pt-5 space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Demo workspace</p>
          <h1 className="text-3xl text-slate-950">Omlom Command Center</h1>
          <p className="mt-1 max-w-xs text-sm text-slate-600">
            {profile.username} is running a live quest board for the next pitch sprint.
          </p>
        </div>
        <Badge className="rounded-full px-3 py-1 text-xs" variant="secondary">
          {profile.guild}
        </Badge>
      </section>

      <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] text-white shadow-xl">
        <div className="relative p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_38%)]" />
          <div className="relative grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-100">
                  Omlom status
                </p>
                <h2 className="text-2xl">{omlom.mood}</h2>
                <p className="max-w-xs text-sm text-blue-100/90">
                  {dueTodayCount} quests due today, {overdueCount} overdue, and{" "}
                  {activeTasks.length} active on the board.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-blue-50">
                  <span>Level progress</span>
                  <span>
                    {stats.xp} / {stats.nextLevelXp} XP
                  </span>
                </div>
                <Progress className="h-2.5 bg-white/20" value={xpProgress} />
                <p className="text-xs text-blue-100/80">
                  {xpToNextLevel} XP to level {stats.level + 1}
                </p>
              </div>

              <div className="flex gap-2">
                <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link to="/tasks">Open quest board</Link>
                </Button>
                <Button
                  asChild
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  variant="outline"
                >
                  <Link to="/calendar">Open planner</Link>
                </Button>
              </div>
            </div>

            <div className="hidden min-[360px]:block">
              <OmlomCharacter size="medium" state={omlom} />
            </div>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-3">
        <Card className="gap-2 border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Zap className="h-4 w-4 text-amber-500" />
            Level
          </div>
          <p className="text-2xl text-slate-950">{stats.level}</p>
          <p className="text-xs text-slate-500">Global rank #{playerRank}</p>
        </Card>

        <Card className="gap-2 border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Coins className="h-4 w-4 text-yellow-600" />
            Gold
          </div>
          <p className="text-2xl text-slate-950">{stats.gold.toLocaleString()}</p>
          <p className="text-xs text-slate-500">{stats.auraShards} aura shards banked</p>
        </Card>

        <Card className="gap-2 border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Flame className="h-4 w-4 text-rose-500" />
            Streak
          </div>
          <p className="text-2xl text-slate-950">{stats.currentStreak} days</p>
          <p className="text-xs text-slate-500">Best streak: {stats.bestStreak} days</p>
        </Card>

        <Card className="gap-2 border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Trophy className="h-4 w-4 text-indigo-500" />
            Completed
          </div>
          <p className="text-2xl text-slate-950">{stats.tasksCompleted}</p>
          <p className="text-xs text-slate-500">{stats.completionRate}% completion rate</p>
        </Card>
      </section>

      <Card className="gap-4 border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Weekly focus target</p>
            <h2 className="text-xl text-slate-950">
              {stats.weeklyFocusMinutes} / {stats.weeklyGoalMinutes} minutes
            </h2>
          </div>
          <Badge variant="outline">{stats.weeklyXp} XP this week</Badge>
        </div>

        <Progress className="h-2.5" value={weeklyFocusProgress} />

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Due today</p>
            <p className="mt-1 text-lg text-slate-950">{dueTodayCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Active quests</p>
            <p className="mt-1 text-lg text-slate-950">{activeTasks.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-slate-500">Inventory</p>
            <p className="mt-1 text-lg text-slate-950">{stats.auraShards}</p>
          </div>
        </div>
      </Card>

      <Card className="gap-4 border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Momentum</p>
            <h2 className="text-xl text-slate-950">Last 7 days</h2>
          </div>
          <Badge variant="secondary">{stats.weeklyXp} weekly XP</Badge>
        </div>

        <ChartContainer className="h-48 w-full" config={chartConfig}>
          <AreaChart data={momentum}>
            <defs>
              <linearGradient id="xpFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-xp)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-xp)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis axisLine={false} dataKey="label" tickLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelKey="xp" />}
            />
            <Area
              dataKey="xp"
              fill="url(#xpFill)"
              fillOpacity={1}
              stroke="var(--color-xp)"
              strokeWidth={2.5}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </Card>

      <Card className="gap-4 border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Next quests</p>
            <h2 className="text-xl text-slate-950">Upcoming deadlines</h2>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link to="/tasks">
              See all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {upcomingTasks.map((task) => {
            const reward = calculateReward(task.value);

            return (
              <div
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                key={task.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base text-slate-950">{task.title}</h3>
                      <Badge className={priorityClasses[task.priority]} variant="outline">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                  </div>
                  <Badge variant="secondary">{task.category}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {formatDueLabel(task.dueDate)}
                  </span>
                  <span>{task.estimatedMinutes} min</span>
                  <span>{reward.xp} XP</span>
                  <span>{reward.gold} gold</span>
                </div>
              </div>
            );
          })}

          {upcomingTasks.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
              No active quests. Load the demo data or create a new one.
            </div>
          )}
        </div>
      </Card>

      {latestPost && (
        <Card className="gap-3 border-slate-200 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Community pulse</p>
              <h2 className="text-xl text-slate-950">Latest activity</h2>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/social">Open feed</Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-950">{latestPost.username}</p>
                <p className="text-xs text-slate-500">
                  {formatDistanceToNow(latestPost.timestamp, { addSuffix: true })}
                </p>
              </div>
              {latestPost.highlight && <Badge variant="secondary">{latestPost.highlight}</Badge>}
            </div>
            <p className="mt-3 text-sm text-slate-700">{latestPost.content}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <span>{latestPost.likes} likes</span>
              <span>{latestPost.comments} comments</span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {latestPost.kind}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
