import React from 'react';
import { Trophy, Star, Award, Crown } from 'lucide-react';

const ACHIEVEMENT_MILESTONES = [
  { trees: 1, title: "First Tree", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
  { trees: 10, title: "Seedling Planter", icon: Star, color: "text-green-600", bg: "bg-green-50" },
  { trees: 50, title: "Grove Creator", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
  { trees: 100, title: "Forest Guardian", icon: Trophy, color: "text-purple-600", bg: "bg-purple-50" },
  { trees: 500, title: "Eco Warrior", icon: Crown, color: "text-orange-600", bg: "bg-orange-50" },
  { trees: 1000, title: "Tree Master", icon: Crown, color: "text-red-600", bg: "bg-red-50" },
  { trees: 5000, title: "Earth Protector", icon: Crown, color: "text-indigo-600", bg: "bg-indigo-50" },
  { trees: 10000, title: "Planet Saver", icon: Crown, color: "text-pink-600", bg: "bg-pink-50" }
];

export default function AchievementBadge({ treesPlanted }) {
  const getAchievements = () => {
    return ACHIEVEMENT_MILESTONES.filter(milestone => treesPlanted >= milestone.trees);
  };

  const getNextMilestone = () => {
    return ACHIEVEMENT_MILESTONES.find(milestone => treesPlanted < milestone.trees);
  };

  const achievements = getAchievements();
  const nextMilestone = getNextMilestone();

  return (
    <div className="neumorphic p-6 rounded-3xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Achievements</h3>
      
      {achievements.length > 0 ? (
        <div className="space-y-3 mb-6">
          {achievements.slice(-3).map((achievement, index) => (
            <div key={achievement.trees} className={`neumorphic-inset p-3 rounded-2xl ${achievement.bg} bg-opacity-30`}>
              <div className="flex items-center gap-3">
                <div className="neumorphic-small p-2 rounded-xl">
                  <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{achievement.title}</p>
                  <p className="text-xs text-gray-600">{achievement.trees} trees milestone</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 mb-6">
          <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Plant your first tree to unlock achievements!</p>
        </div>
      )}

      {nextMilestone && (
        <div className="neumorphic-inset p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Next Milestone</span>
            <span className="text-sm text-gray-600">{nextMilestone.trees - treesPlanted} trees to go</span>
          </div>
          <div className="flex items-center gap-2">
            <nextMilestone.icon className={`w-4 h-4 ${nextMilestone.color}`} />
            <span className="font-medium text-gray-800">{nextMilestone.title}</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((treesPlanted / nextMilestone.trees) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}