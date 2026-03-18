import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Heart, MessageCircle, Share2, Trophy, Sparkles } from 'lucide-react';
import { SocialPost } from '../types';

// Mock social feed data
const mockPosts: SocialPost[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'Sarah_Chen',
    avatar: 'SC',
    content: 'Just crushed my Chemistry exam prep! 🧪',
    taskCompleted: 'Complete Chemistry Revision',
    rewardEarned: 850,
    likes: 24,
    comments: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '2',
    userId: 'user2',
    username: 'Mike_Johnson',
    avatar: 'MJ',
    content: 'Team project done early! Our guild is on fire 🔥',
    taskCompleted: 'Group Presentation Prep',
    rewardEarned: 1200,
    likes: 42,
    comments: 8,
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '3',
    userId: 'user3',
    username: 'Emma_Lee',
    avatar: 'EL',
    content: 'Level 15 reached! My Omlom is evolving ✨',
    rewardEarned: 0,
    likes: 67,
    comments: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '4',
    userId: 'user4',
    username: 'Alex_Kim',
    avatar: 'AK',
    content: 'Finally finished that massive essay!',
    taskCompleted: 'Write History Essay',
    rewardEarned: 950,
    likes: 31,
    comments: 6,
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    id: '5',
    userId: 'user5',
    username: 'Olivia_Martinez',
    avatar: 'OM',
    content: '10-day streak! Productivity mode activated 💪',
    rewardEarned: 0,
    likes: 89,
    comments: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
  },
];

function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Social() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-3xl mb-1">Community Feed</h1>
        <p className="text-gray-600">See what students are achieving</p>
      </div>

      {/* Guild Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Your Guild</p>
            <p className="font-semibold text-lg">Study Warriors</p>
            <p className="text-sm text-purple-600">Rank #42 • 247 members</p>
          </div>
          <Trophy className="w-12 h-12 text-purple-500" />
        </div>
      </Card>

      {/* Active Challenge */}
      <Card className="p-4 bg-gradient-to-r from-orange-100 to-pink-100 border-orange-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-orange-500" />
          <div className="flex-1">
            <p className="font-semibold">Monthly Boss Raid</p>
            <p className="text-sm text-gray-600">Exam Season Challenge</p>
          </div>
          <Button size="sm" variant="outline">Join</Button>
        </div>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {mockPosts.map(post => (
          <Card key={post.id} className="p-4">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                  {post.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{post.username}</p>
                <p className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</p>
              </div>
            </div>

            {/* Post Content */}
            <p className="mb-3">{post.content}</p>

            {/* Quest Complete Card */}
            {post.taskCompleted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Quest Completed!</span>
                </div>
                <p className="text-sm text-gray-700">{post.taskCompleted}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{post.rewardEarned} XP earned
                </p>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-4 pt-2 border-t">
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-4">
        <Button variant="outline" size="lg">
          Load More Posts
        </Button>
      </div>
    </div>
  );
}
