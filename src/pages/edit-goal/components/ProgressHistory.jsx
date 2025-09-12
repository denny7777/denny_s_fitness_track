import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressHistory = ({ goalId, className = '' }) => {
  const [showAll, setShowAll] = useState(false);

  // Mock progress history data
  const progressHistory = [
    {
      id: 1,
      date: '2025-01-10',
      previousValue: 45,
      newValue: 50,
      change: +5,
      changeType: 'progress_update',
      note: 'Weekly progress update',
      timestamp: '2025-01-10T14:30:00Z'
    },
    {
      id: 2,
      date: '2025-01-08',
      previousValue: 100,
      newValue: 95,
      change: -5,
      changeType: 'target_adjustment',
      note: 'Adjusted target based on realistic timeline',
      timestamp: '2025-01-08T09:15:00Z'
    },
    {
      id: 3,
      date: '2025-01-05',
      previousValue: 40,
      newValue: 45,
      change: +5,
      changeType: 'progress_update',
      note: 'Great workout session',
      timestamp: '2025-01-05T18:45:00Z'
    },
    {
      id: 4,
      date: '2025-01-03',
      previousValue: 35,
      newValue: 40,
      change: +5,
      changeType: 'progress_update',
      note: 'Consistent daily progress',
      timestamp: '2025-01-03T16:20:00Z'
    },
    {
      id: 5,
      date: '2025-01-01',
      previousValue: 0,
      newValue: 35,
      change: +35,
      changeType: 'initial_setup',
      note: 'Goal created with initial progress',
      timestamp: '2025-01-01T12:00:00Z'
    }
  ];

  const displayedHistory = showAll ? progressHistory : progressHistory?.slice(0, 3);

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'progress_update':
        return 'TrendingUp';
      case 'target_adjustment':
        return 'Settings';
      case 'initial_setup':
        return 'Plus';
      default:
        return 'Activity';
    }
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-warning';
    return 'text-muted-foreground';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Progress History
          </h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {progressHistory?.length} updates
        </div>
      </div>
      {progressHistory?.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="History" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No progress history yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Updates will appear here as you modify your goal
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedHistory?.map((entry, index) => (
            <div
              key={entry?.id}
              className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-150"
            >
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon 
                  name={getChangeIcon(entry?.changeType)} 
                  size={16} 
                  className="text-primary" 
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">
                      {entry?.changeType === 'initial_setup' ? 'Goal Created' :
                       entry?.changeType === 'target_adjustment'? 'Target Adjusted' : 'Progress Updated'}
                    </span>
                    <span className={`text-sm font-mono ${getChangeColor(entry?.change)}`}>
                      {entry?.change > 0 ? '+' : ''}{entry?.change}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(entry?.date)}
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-muted-foreground">
                    {entry?.previousValue} → {entry?.newValue}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    at {formatTime(entry?.timestamp)}
                  </span>
                </div>

                {entry?.note && (
                  <p className="text-sm text-muted-foreground">
                    {entry?.note}
                  </p>
                )}
              </div>
            </div>
          ))}

          {progressHistory?.length > 3 && (
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                iconName={showAll ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
              >
                {showAll ? 'Show Less' : `Show ${progressHistory?.length - 3} More`}
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              +{progressHistory?.filter(h => h?.change > 0)?.reduce((sum, h) => sum + h?.change, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {progressHistory?.filter(h => h?.changeType === 'progress_update')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Updates</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {Math.round((progressHistory?.filter(h => h?.change > 0)?.length / progressHistory?.length) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHistory;