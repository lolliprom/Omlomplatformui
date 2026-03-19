import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import { GuildActivityFeed } from "../components/guild-activity-feed";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useGameStore } from "../store/game-store";

export default function Social() {
  const { profile, socialPosts, guildActivities, stats, togglePostLike } = useGameStore();
  const [tab, setTab] = useState("feed");

  const guildGoalCurrent = Math.min(1280, stats.weeklyFocusMinutes + 560);
  const guildGoal = {
    current: guildGoalCurrent,
    target: 1200,
    description: "Bank 1,200 focused minutes before the pitch rehearsal window closes.",
  };

  return (
    <div className="px-4 pb-24 pt-5 space-y-5">
      <section className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Community layer</p>
          <h1 className="text-3xl text-slate-950">Guild Feed</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track public wins, guild momentum, and the social proof around the sprint.
          </p>
        </div>
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          {profile.guild}
        </Badge>
      </section>

      <Card className="border-0 bg-[linear-gradient(135deg,#1e293b_0%,#0f172a_100%)] p-5 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
              Live guild challenge
            </p>
            <h2 className="text-2xl">Pitch Week raid</h2>
            <p className="max-w-sm text-sm text-slate-300">
              The guild is pooling focused minutes and shipped deliverables to hold top rank this week.
            </p>
          </div>
          <Users className="h-9 w-9 text-cyan-300" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge className="border-white/20 bg-white/10 text-white" variant="outline">
            {guildGoal.current} / {guildGoal.target} min
          </Badge>
          <Badge className="border-white/20 bg-white/10 text-white" variant="outline">
            {socialPosts.length} social updates
          </Badge>
        </div>
      </Card>

      <Tabs className="w-full" onValueChange={setTab} value={tab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="guild">Guild</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="feed">
          {socialPosts.map((post) => (
            <Card className="border-slate-200 bg-white/95 p-4 shadow-sm" key={post.id}>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-slate-900 text-white">
                    {post.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-slate-950">{post.username}</p>
                        {post.userId === profile.userId && (
                          <Badge variant="secondary">You</Badge>
                        )}
                        {post.highlight && <Badge variant="outline">{post.highlight}</Badge>}
                      </div>
                      <p className="text-xs text-slate-500">
                        {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                      </p>
                    </div>

                    <Badge variant="outline">{post.guild ?? "Community"}</Badge>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">{post.content}</p>

                  {post.taskCompleted && (
                    <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <Trophy className="h-4 w-4" />
                        Quest cleared
                      </div>
                      <p className="mt-1 text-sm text-slate-700">{post.taskCompleted}</p>
                      {post.rewardEarned && (
                        <p className="mt-1 text-xs text-emerald-700">
                          {post.rewardEarned} XP earned
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
                    <button
                      className={`inline-flex items-center gap-2 transition-colors ${
                        post.likedByViewer ? "text-rose-600" : "hover:text-rose-600"
                      }`}
                      onClick={() => togglePostLike(post.id)}
                      type="button"
                    >
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </button>
                    <button className="inline-flex items-center gap-2 hover:text-blue-600" type="button">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </button>
                    <button
                      className="ml-auto inline-flex items-center gap-2 hover:text-emerald-600"
                      onClick={() => toast.success("Use this card as the social screenshot for the demo.")}
                      type="button"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent className="space-y-4" value="guild">
          <GuildActivityFeed
            activities={guildActivities.map((activity) => ({
              id: activity.id,
              name: activity.name,
              activity: activity.activity,
              timestamp: formatDistanceToNow(activity.timestamp, { addSuffix: true }),
              type: activity.type,
            }))}
            guildGoal={guildGoal}
            guildName={profile.guild}
          />

          <Card className="border-slate-200 bg-white/95 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Your signal</p>
                <h2 className="text-xl text-slate-950">Public momentum</h2>
              </div>
              <Sparkles className="h-5 w-5 text-indigo-500" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Weekly XP</p>
                <p className="mt-1 text-lg text-slate-950">{stats.weeklyXp}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Focus minutes</p>
                <p className="mt-1 text-lg text-slate-950">{stats.weeklyFocusMinutes}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Posts</p>
                <p className="mt-1 text-lg text-slate-950">
                  {socialPosts.filter((post) => post.userId === profile.userId).length}
                </p>
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              onClick={() => toast.success("Challenge joined. Use the guild tab during the demo walkthrough.")}
              variant="outline"
            >
              Join challenge highlight
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
