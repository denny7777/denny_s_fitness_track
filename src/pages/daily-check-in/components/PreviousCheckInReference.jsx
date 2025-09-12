import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviousCheckInReference = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock previous check-in data
  const previousCheckIns = [
    {
      id: 1,
      date: '2025-01-10',
      workoutSummary: 'Upper body strength training - 45 minutes. Focused on bench press, rows, and shoulder exercises.',
      mood: 4,
      energy: 4,
      goalsUpdated: ['Lose 15 lbs', 'Workout 5 days per week'],
      trends: {
        moodChange: 1,
        energyChange: 0,
        consistencyStreak: 6
      }
    },
    {
      id: 2,
      date: '2025-01-09',
      workoutSummary: 'Cardio session - 30 minutes running on treadmill. Maintained steady pace throughout.',
      mood: 3,
      energy: 4,
      goalsUpdated: ['Run 5K in under 25 minutes'],
      trends: {
        moodChange: 0,
        energyChange: 1,
        consistencyStreak: 5
      }
    },
    {
      id: 3,
      date: '2025-01-08',
      workoutSummary: 'Rest day - Light stretching and yoga for 20 minutes. Focused on recovery.',
      mood: 3,
      energy: 3,
      goalsUpdated: [],
      trends: {
        moodChange: -1,
        energyChange: -1,
        consistencyStreak: 4
      }
    }
  ];

  const getMoodEmoji = (mood) => {
    const emojis = { 1: '😢', 2: '😕', 3: '😐', 4: '😊', 5: '😄' };
    return emojis?.[mood] || '😐';
  };

  const getEnergyIcon = (energy) => {
    if (energy <= 2) return 'BatteryLow';
    if (energy <= 3) return 'Battery';
    if (energy <= 4) return 'Battery';
    return 'Zap';
  };

  const getTrendIcon = (change) => {
    if (change > 0) return { icon: 'TrendingUp', color: 'text-success' };
    if (change < 0) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const recentCheckIn = previousCheckIns?.[0];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Previous Check-Ins</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </div>
      {/* Most Recent Check-In Summary */}
      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span className="font-medium text-foreground">
              {formatDate(recentCheckIn?.date)}
            </span>
            <span className="text-xs text-muted-foreground">
              (Yesterday)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="text-lg">{getMoodEmoji(recentCheckIn?.mood)}</span>
              <Icon 
                name={getEnergyIcon(recentCheckIn?.energy)} 
                size={16} 
                className="text-primary" 
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground mb-3">
          {recentCheckIn?.workoutSummary}
        </p>

        {/* Trends */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(recentCheckIn?.trends?.moodChange)?.icon} 
                size={14} 
                className={getTrendIcon(recentCheckIn?.trends?.moodChange)?.color}
              />
              <span className="text-xs text-muted-foreground">Mood</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(recentCheckIn?.trends?.energyChange)?.icon} 
                size={14} 
                className={getTrendIcon(recentCheckIn?.trends?.energyChange)?.color}
              />
              <span className="text-xs text-muted-foreground">Energy</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Flame" size={14} className="text-success" />
            <span className="text-xs font-medium text-foreground">
              {recentCheckIn?.trends?.consistencyStreak} day streak
            </span>
          </div>
        </div>
      </div>
      {/* Expanded History */}
      {isExpanded && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground mb-3">Recent History</h4>
          {previousCheckIns?.slice(1)?.map((checkIn) => (
            <div key={checkIn?.id} className="border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(checkIn?.date)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{getMoodEmoji(checkIn?.mood)}</span>
                    <Icon 
                      name={getEnergyIcon(checkIn?.energy)} 
                      size={12} 
                      className="text-primary" 
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Flame" size={12} className="text-success" />
                  <span className="text-xs text-muted-foreground">
                    {checkIn?.trends?.consistencyStreak}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {checkIn?.workoutSummary?.length > 80 
                  ? `${checkIn?.workoutSummary?.substring(0, 80)}...` 
                  : checkIn?.workoutSummary
                }
              </p>
              {checkIn?.goalsUpdated?.length > 0 && (
                <div className="mt-2 flex items-center space-x-1">
                  <Icon name="Target" size={12} className="text-success" />
                  <span className="text-xs text-muted-foreground">
                    Updated: {checkIn?.goalsUpdated?.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconPosition="left"
            onClick={() => window.location.href = '/check-in-history'}
            className="w-full"
          >
            View Complete History
          </Button>
        </div>
      )}
      {/* Quick Insights */}
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Insights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">
              Mood trending upward this week
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">
              Best energy: Tuesday mornings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousCheckInReference;