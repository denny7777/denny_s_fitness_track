import React from 'react';
import Icon from '../../../components/AppIcon';

const StreakTracker = ({ currentStreak, longestStreak, recentDays }) => {
  const getStreakIcon = (streak) => {
    if (streak >= 30) return 'Trophy';
    if (streak >= 14) return 'Award';
    if (streak >= 7) return 'Star';
    return 'Flame';
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-warning';
    if (streak >= 14) return 'text-success';
    if (streak >= 7) return 'text-primary';
    return 'text-secondary';
  };

  const getStreakMessage = (streak) => {
    if (streak >= 30) return 'Legendary streak! 🏆';
    if (streak >= 14) return 'Amazing consistency! 🌟';
    if (streak >= 7) return 'Great momentum! 🔥';
    if (streak >= 3) return 'Building habits! 💪';
    return 'Keep going! 🚀';
  };

  const achievements = [
    { days: 3, title: 'Getting Started', icon: 'Play', unlocked: currentStreak >= 3 },
    { days: 7, title: 'Week Warrior', icon: 'Star', unlocked: currentStreak >= 7 },
    { days: 14, title: 'Fortnight Fighter', icon: 'Award', unlocked: currentStreak >= 14 },
    { days: 30, title: 'Monthly Master', icon: 'Trophy', unlocked: currentStreak >= 30 },
    { days: 60, title: 'Consistency Champion', icon: 'Crown', unlocked: currentStreak >= 60 },
    { days: 100, title: 'Century Crusher', icon: 'Zap', unlocked: currentStreak >= 100 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft mb-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Flame" size={24} className="text-success" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Streak Tracking
          </h3>
          <p className="text-sm text-muted-foreground">
            Consistency is key to success
          </p>
        </div>
      </div>
      {/* Main streak display */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-success/20 to-primary/20 rounded-full mb-4 celebration-glow">
          <Icon 
            name={getStreakIcon(currentStreak)} 
            size={40} 
            className={getStreakColor(currentStreak)}
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-foreground font-mono">
            {currentStreak}
          </h2>
          <p className="text-lg font-medium text-foreground">
            Day Streak
          </p>
          <p className="text-sm text-muted-foreground">
            {getStreakMessage(currentStreak)}
          </p>
        </div>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Award" size={20} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">
            {longestStreak}
          </p>
          <p className="text-sm text-muted-foreground">
            Longest Streak
          </p>
        </div>
        
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Calendar" size={20} className="text-secondary" />
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">
            {recentDays?.filter(day => day?.hasCheckIn)?.length}
          </p>
          <p className="text-sm text-muted-foreground">
            Last 7 Days
          </p>
        </div>
      </div>
      {/* Recent days visualization */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
        <div className="flex justify-between space-x-2">
          {recentDays?.map((day, index) => (
            <div key={index} className="flex-1 text-center">
              <div
                className={`w-full h-12 rounded-lg flex items-center justify-center mb-2 transition-all duration-150 ${
                  day?.hasCheckIn 
                    ? 'bg-success text-success-foreground celebration-glow' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day?.hasCheckIn ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name="X" size={16} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {day?.dayName}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Achievements */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Achievements</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {achievements?.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all duration-150 ${
                achievement?.unlocked
                  ? 'border-success bg-success/10 text-success' :'border-border bg-muted/30 text-muted-foreground'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon 
                  name={achievement?.icon} 
                  size={16} 
                  className={achievement?.unlocked ? 'text-success' : 'text-muted-foreground'}
                />
                <span className="text-xs font-medium">
                  {achievement?.days} Days
                </span>
              </div>
              <p className="text-xs">
                {achievement?.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Motivation message */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <Icon name="Target" size={20} className="text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">
            Next Milestone
          </p>
          <p className="text-xs text-muted-foreground">
            {currentStreak < 7 
              ? `${7 - currentStreak} more days to reach Week Warrior!`
              : currentStreak < 14
              ? `${14 - currentStreak} more days to reach Fortnight Fighter!`
              : currentStreak < 30
              ? `${30 - currentStreak} more days to reach Monthly Master!`
              : 'You\'re crushing it! Keep the momentum going! 🚀'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;