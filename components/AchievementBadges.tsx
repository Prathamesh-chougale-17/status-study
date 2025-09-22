'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Target, Zap, Award, Crown } from 'lucide-react';

interface AchievementBadgesProps {
  totalTopics: number;
  totalResources: number;
  completedTasks?: number;
}

export default function AchievementBadges({ totalTopics, totalResources, completedTasks = 0 }: AchievementBadgesProps) {
  const achievements = [
    {
      id: 'first-topic',
      name: 'Getting Started',
      description: 'Created your first topic',
      icon: Star,
      unlocked: totalTopics >= 1,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400',
    },
    {
      id: 'topic-master',
      name: 'Topic Master',
      description: 'Created 5 topics',
      icon: Target,
      unlocked: totalTopics >= 5,
      color: 'from-blue-400 to-purple-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      id: 'resource-collector',
      name: 'Resource Collector',
      description: 'Added 10 resources',
      icon: Trophy,
      unlocked: totalResources >= 10,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
    },
    {
      id: 'task-crusher',
      name: 'Task Crusher',
      description: 'Completed 5 tasks',
      icon: Zap,
      unlocked: completedTasks >= 5,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
    },
    {
      id: 'study-champion',
      name: 'Study Champion',
      description: 'Reached 20 resources',
      icon: Award,
      unlocked: totalResources >= 20,
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400',
    },
    {
      id: 'master-learner',
      name: 'Master Learner',
      description: 'Created 10 topics',
      icon: Crown,
      unlocked: totalTopics >= 10,
      color: 'from-amber-400 to-yellow-500',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  if (unlockedAchievements.length === 0 && !nextAchievement) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Trophy className="h-5 w-5 text-amber-400" />
          Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Unlocked ({unlockedAchievements.length})</h4>
              <div className="flex flex-wrap gap-2">
                {unlockedAchievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <Badge
                      key={achievement.id}
                      className={`${achievement.bgColor} ${achievement.textColor} border-0 px-3 py-1.5 flex items-center gap-2 hover:scale-105 transition-transform cursor-default`}
                      title={achievement.description}
                    >
                      <IconComponent className="h-3 w-3" />
                      {achievement.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next Achievement */}
          {nextAchievement && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Next Goal</h4>
              <div className={`${nextAchievement.bgColor} border border-dashed border-current rounded-lg p-3 opacity-60`}>
                <div className="flex items-center gap-2">
                  <nextAchievement.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{nextAchievement.name}</p>
                    <p className="text-xs text-muted-foreground/80">{nextAchievement.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground italic">
              {unlockedAchievements.length === 0 
                ? "Start your journey to unlock achievements! 🚀"
                : unlockedAchievements.length < 3
                ? "Great progress! Keep going! 💪"
                : unlockedAchievements.length < 5
                ? "You're on fire! Amazing work! 🔥"
                : "Incredible dedication! You're a true learner! ⭐"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
