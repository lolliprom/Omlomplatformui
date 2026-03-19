import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  Award,
  Download,
  Flame,
  RefreshCcw,
  Share2,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { buildMomentum } from "../demo-data";
import { OmlomCharacter } from "../components/omlom-character";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { useGameStore } from "../store/game-store";

const itemMeta: Record<string, { icon: string; description: string }> = {
  "Moonstone Charm": {
    icon: "MC",
    description: "Awarded for shipping a high-stakes quest.",
  },
  "Focus Tonic": {
    icon: "FT",
    description: "Boost from a deep work block.",
  },
  "Aura Ticket": {
    icon: "AT",
    description: "A lightweight reward for steady execution.",
  },
};

const chartConfig = {
  focusMinutes: {
    label: "Focus minutes",
    color: "#0f766e",
  },
} as const;

export default function Profile() {
  const {
    profile,
    stats,
    omlom,
    inventory,
    tasks,
    loadDemoData,
  } = useGameStore();

  const completedTasks = tasks
    .filter((task) => task.completed)
    .sort(
      (left, right) =>
        (right.completedAt?.getTime() ?? 0) - (left.completedAt?.getTime() ?? 0),
    );
  const momentum = buildMomentum(tasks);
  const xpProgress = Math.min(100, (stats.xp / stats.nextLevelXp) * 100);
  const achievements = [
    {
      title: "First clear",
      description: "Finish a quest and convert it into visible progress.",
      unlocked: stats.tasksCompleted >= 1,
    },
    {
      title: "Streak builder",
      description: "Hit a 3 day focus streak.",
      unlocked: stats.currentStreak >= 3,
    },
    {
      title: "Guild ready",
      description: "Reach level 3 before pitch week.",
      unlocked: stats.level >= 3,
    },
    {
      title: "Collector",
      description: "Add three items to your inventory.",
      unlocked: inventory.length >= 3,
    },
    {
      title: "Closer",
      description: "Complete 5 quests in the product cycle.",
      unlocked: stats.tasksCompleted >= 5,
    },
  ];

  return (
    <div className="px-4 pb-24 pt-5 space-y-5">
      <section className="text-center">
        <p className="text-sm text-slate-500">Player profile</p>
        <h1 className="text-3xl text-slate-950">Demo Identity</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live player state, achievements, inventory, and reset controls for the demo run.
        </p>
      </section>

      <Card className="border-0 bg-[linear-gradient(135deg,#f8fafc_0%,#dbeafe_50%,#e0f2fe_100%)] p-5 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-white/70 p-3 shadow-sm">
            <OmlomCharacter size="large" state={omlom} />
          </div>

          <div>
            <h2 className="text-2xl text-slate-950">{profile.username}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {profile.role} - {profile.guild}
            </p>
            <p className="mt-2 max-w-xs text-sm text-slate-500">{profile.motto}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">Level {stats.level}</Badge>
            <Badge variant="outline">Joined {format(profile.joinedAt, "MMM d")}</Badge>
          </div>

          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Progress to next level</span>
              <span>
                {stats.xp} / {stats.nextLevelXp}
              </span>
            </div>
            <Progress className="h-2.5" value={xpProgress} />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => toast.success("Use this profile card as the closing screenshot in the demo.")}
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
              Share snapshot
            </Button>
            <Button
              onClick={() => {
                loadDemoData();
                toast.success("Demo data restored.");
              }}
              variant="outline"
            >
              <RefreshCcw className="h-4 w-4" />
              Reload demo
            </Button>
            <Button
              onClick={() => toast.success("Export is mocked for the live demo.")}
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-3">
        <Card className="gap-2 border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Trophy className="h-4 w-4 text-amber-500" />
            Quests done
          </div>
          <p className="text-2xl text-slate-950">{stats.tasksCompleted}</p>
        </Card>

        <Card className="gap-2 border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Flame className="h-4 w-4 text-rose-500" />
            Streak
          </div>
          <p className="text-2xl text-slate-950">{stats.currentStreak} days</p>
        </Card>

        <Card className="gap-2 border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Aura shards
          </div>
          <p className="text-2xl text-slate-950">{stats.auraShards}</p>
        </Card>

        <Card className="gap-2 border-slate-200 bg-white/95 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Zap className="h-4 w-4 text-sky-500" />
            Focus minutes
          </div>
          <p className="text-2xl text-slate-950">{stats.focusMinutes}</p>
        </Card>
      </section>

      <Tabs className="w-full" defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="overview">
          <Card className="border-slate-200 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Momentum snapshot</p>
                <h2 className="text-xl text-slate-950">Focus minutes</h2>
              </div>
              <Badge variant="secondary">{stats.weeklyFocusMinutes} this week</Badge>
            </div>

            <ChartContainer className="mt-4 h-44 w-full" config={chartConfig}>
              <AreaChart data={momentum}>
                <defs>
                  <linearGradient id="focusFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-focusMinutes)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-focusMinutes)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="label" tickLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent labelKey="focusMinutes" />}
                />
                <Area
                  dataKey="focusMinutes"
                  fill="url(#focusFill)"
                  fillOpacity={1}
                  stroke="var(--color-focusMinutes)"
                  strokeWidth={2.5}
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </Card>

          <Card className="border-slate-200 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Recent wins</p>
                <h2 className="text-xl text-slate-950">Last completions</h2>
              </div>
              <Badge variant="outline">{completedTasks.length} total</Badge>
            </div>

            <div className="mt-4 space-y-3">
              {completedTasks.slice(0, 3).map((task) => (
                <div
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  key={task.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-950">{task.title}</p>
                      <p className="text-xs text-slate-500">
                        Completed {task.completedAt ? format(task.completedAt, "EEE, MMM d - h:mm a") : "-"}
                      </p>
                    </div>
                    <Badge variant="secondary">{task.value} pts</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-3" value="achievements">
          {achievements.map((achievement) => (
            <Card
              className={`border p-4 shadow-sm ${
                achievement.unlocked
                  ? "border-amber-200 bg-amber-50/80"
                  : "border-slate-200 bg-slate-50/80"
              }`}
              key={achievement.title}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-full p-2 ${
                    achievement.unlocked ? "bg-amber-200 text-amber-700" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-950">{achievement.title}</p>
                    {achievement.unlocked && <Badge variant="secondary">Unlocked</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{achievement.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent className="space-y-3" value="inventory">
          {inventory.length > 0 ? (
            inventory.map((item, index) => (
              <Card className="border-slate-200 bg-white/95 p-4 shadow-sm" key={`${item}-${index}`}>
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                    {itemMeta[item]?.icon ?? "IT"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-950">{item}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {itemMeta[item]?.description ?? "Reward added during the demo journey."}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-slate-300 bg-white/75 p-8 text-center shadow-sm">
              <p className="text-base text-slate-950">No items yet.</p>
              <p className="mt-2 text-sm text-slate-500">
                Complete higher-value quests to drop rare inventory items.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
