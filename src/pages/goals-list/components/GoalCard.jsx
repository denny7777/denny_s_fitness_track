import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ProgressVisualization from '../../../components/ui/ProgressVisualization';

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress, isSelected, onSelect }) => {
  const [showActions, setShowActions] = useState(false);

  const getGoalTypeColor = (type) => {
    const colors = {
      'weight-loss': 'bg-red-100 text-red-800 border-red-200',
      'muscle-gain': 'bg-blue-100 text-blue-800 border-blue-200',
      'endurance': 'bg-green-100 text-green-800 border-green-200',
      'strength': 'bg-purple-100 text-purple-800 border-purple-200',
      'flexibility': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'general': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors?.[type] || colors?.general;
  };

  const getStatusInfo = () => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    const progressPercentage = (goal?.currentValue / goal?.targetValue) * 100;

    if (progressPercentage >= 100) {
      return { status: 'completed', color: 'text-success', icon: 'CheckCircle' };
    } else if (daysRemaining < 0) {
      return { status: 'overdue', color: 'text-error', icon: 'AlertCircle' };
    } else if (progressPercentage < 50 && daysRemaining < 30) {
      return { status: 'behind', color: 'text-warning', icon: 'Clock' };
    } else {
      return { status: 'on-track', color: 'text-success', icon: 'TrendingUp' };
    }
  };

  const statusInfo = getStatusInfo();
  const progressPercentage = Math.min((goal?.currentValue / goal?.targetValue) * 100, 100);

  return (
    <div 
      className={`bg-card border rounded-lg p-6 hover-lift transition-all duration-200 cursor-pointer ${
        isSelected ? 'border-primary shadow-elevated' : 'border-border hover:border-primary/50'
      }`}
      onClick={() => onSelect && onSelect(goal?.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {onSelect && (
            <div className="mt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e?.stopPropagation();
                  onSelect(goal?.id);
                }}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
              {goal?.title}
            </h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getGoalTypeColor(goal?.type)}`}>
                {goal?.type?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
              </span>
              <div className={`flex items-center space-x-1 ${statusInfo?.color}`}>
                <Icon name={statusInfo?.icon} size={14} />
                <span className="text-xs font-medium capitalize">
                  {statusInfo?.status?.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`flex items-center space-x-1 transition-opacity duration-200 ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(goal);
            }}
          >
            <Icon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onUpdateProgress(goal);
            }}
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete(goal?.id);
            }}
            className="text-error hover:text-error"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      {/* Progress Section */}
      <div className="mb-4">
        <ProgressVisualization
          type="bar"
          value={goal?.currentValue}
          max={goal?.targetValue}
          label="Progress"
          showPercentage={true}
          color={progressPercentage >= 100 ? 'success' : progressPercentage >= 75 ? 'primary' : progressPercentage >= 50 ? 'warning' : 'error'}
          animated={true}
        />
      </div>
      {/* Goal Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current</p>
          <p className="text-sm font-semibold text-foreground">
            {goal?.currentValue} {goal?.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Target</p>
          <p className="text-sm font-semibold text-foreground">
            {goal?.targetValue} {goal?.unit}
          </p>
        </div>
      </div>
      {/* Target Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Target: {new Date(goal.targetDate)?.toLocaleDateString()}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">
            {Math.round(progressPercentage)}%
          </p>
        </div>
      </div>
      {/* Description Preview */}
      {goal?.description && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {goal?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;