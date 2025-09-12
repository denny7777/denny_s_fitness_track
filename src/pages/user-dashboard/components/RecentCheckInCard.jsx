import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentCheckInCard = ({ checkIn }) => {
  const getMoodIcon = (mood) => {
    switch (mood) {
      case 5: return 'Smile';
      case 4: return 'Meh';
      case 3: return 'Frown';
      case 2: return 'Angry';
      case 1: return 'Sad';
      default: return 'Meh';
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 5: return 'text-success';
      case 4: return 'text-primary';
      case 3: return 'text-warning';
      case 2: return 'text-error';
      case 1: return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getEnergyBars = (energy) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-4 rounded-full ${
          i < energy ? 'bg-success' : 'bg-muted'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover-lift transition-all duration-150">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">
              {formatDate(checkIn?.date)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTime(checkIn?.date)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Mood Indicator */}
          <div className="flex items-center space-x-1">
            <Icon 
              name={getMoodIcon(checkIn?.mood)} 
              size={16} 
              className={getMoodColor(checkIn?.mood)}
            />
            <span className="text-xs text-muted-foreground">Mood</span>
          </div>
          
          {/* Energy Level */}
          <div className="flex items-center space-x-1">
            <div className="flex space-x-0.5">
              {getEnergyBars(checkIn?.energyLevel)}
            </div>
            <span className="text-xs text-muted-foreground">Energy</span>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <h4 className="font-medium text-foreground text-sm mb-1">
          {checkIn?.workoutType}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {checkIn?.summary}
        </p>
      </div>
      {checkIn?.duration && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{checkIn?.duration} minutes</span>
          </div>
          
          {checkIn?.caloriesBurned && (
            <div className="flex items-center space-x-1">
              <Icon name="Flame" size={12} />
              <span>{checkIn?.caloriesBurned} cal</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentCheckInCard;