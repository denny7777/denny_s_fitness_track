import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimelineEntry = ({ entry, isLast = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMoodIcon = (mood) => {
    const moodIcons = {
      1: 'Frown',
      2: 'Meh', 
      3: 'Smile',
      4: 'Laugh',
      5: 'Heart'
    };
    return moodIcons?.[mood] || 'Meh';
  };

  const getMoodColor = (mood) => {
    const colors = {
      1: 'text-error',
      2: 'text-warning',
      3: 'text-primary',
      4: 'text-success',
      5: 'text-success'
    };
    return colors?.[mood] || 'text-muted-foreground';
  };

  const getEnergyColor = (energy) => {
    if (energy >= 8) return 'bg-success';
    if (energy >= 6) return 'bg-primary';
    if (energy >= 4) return 'bg-warning';
    return 'bg-error';
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-16 w-0.5 h-full bg-border"></div>
      )}
      <div className="flex items-start space-x-4 pb-6">
        {/* Timeline dot */}
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-soft">
          <Icon name="Calendar" size={20} color="white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-border rounded-lg p-4 shadow-soft hover-lift">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  {formatDate(entry?.date)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {entry?.workoutType}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Mood indicator */}
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getMoodIcon(entry?.mood)} 
                    size={18} 
                    className={getMoodColor(entry?.mood)} 
                  />
                  <span className="text-sm font-medium text-foreground">
                    {entry?.mood}/5
                  </span>
                </div>

                {/* Energy level */}
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[...Array(10)]?.map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-4 rounded-full ${
                          i < entry?.energyLevel 
                            ? getEnergyColor(entry?.energyLevel)
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground ml-1">
                    {entry?.energyLevel}/10
                  </span>
                </div>
              </div>
            </div>

            {/* Workout summary */}
            <div className="mb-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {entry?.workoutSummary}
              </p>
            </div>

            {/* Goal progress updates */}
            {entry?.goalUpdates && entry?.goalUpdates?.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {entry?.goalUpdates?.map((update, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-1"
                    >
                      <Icon name="Target" size={14} className="text-primary" />
                      <span className="text-xs font-medium text-foreground">
                        {update?.goalTitle}
                      </span>
                      <span className="text-xs text-success">
                        +{update?.progress}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>{entry?.duration} minutes</span>
                {entry?.aiRecommendations && (
                  <>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <Icon name="Bot" size={12} className="text-primary" />
                    <span>AI insights available</span>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Less' : 'Details'}
              </Button>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {/* Full workout description */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Workout Details
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {entry?.fullDescription}
                  </p>
                </div>

                {/* Goal progress details */}
                {entry?.goalUpdates && entry?.goalUpdates?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">
                      Goal Progress
                    </h4>
                    <div className="space-y-2">
                      {entry?.goalUpdates?.map((update, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {update?.goalTitle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {update?.previousValue} → {update?.newValue} {update?.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-success">
                              +{update?.progress}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round((update?.newValue / update?.targetValue) * 100)}% complete
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI recommendations */}
                {entry?.aiRecommendations && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                      <Icon name="Bot" size={16} className="text-primary" />
                      <span>AI Coach Insights</span>
                    </h4>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-sm text-foreground leading-relaxed">
                        {entry?.aiRecommendations}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEntry;