import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ProgressVisualization from '../../../components/ui/ProgressVisualization';

const GoalCard = ({ goal, onUpdate, onEdit }) => {
  const getGoalTypeIcon = (type) => {
    switch (type) {
      case 'weight_loss': return 'Scale';
      case 'muscle_gain': return 'Dumbbell';
      case 'endurance': return 'Activity';
      case 'strength': return 'Zap';
      case 'flexibility': return 'Stretch';
      default: return 'Target';
    }
  };

  const getGoalTypeColor = (type) => {
    switch (type) {
      case 'weight_loss': return 'warning';
      case 'muscle_gain': return 'success';
      case 'endurance': return 'primary';
      case 'strength': return 'error';
      case 'flexibility': return 'secondary';
      default: return 'primary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(goal?.targetDate);
  const isOverdue = daysRemaining < 0;
  const isUrgent = daysRemaining <= 7 && daysRemaining > 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover-lift transition-all duration-150">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            getGoalTypeColor(goal?.type) === 'primary' ? 'bg-primary/10' :
            getGoalTypeColor(goal?.type) === 'success' ? 'bg-success/10' :
            getGoalTypeColor(goal?.type) === 'warning' ? 'bg-warning/10' :
            getGoalTypeColor(goal?.type) === 'error'? 'bg-error/10' : 'bg-secondary/10'
          }`}>
            <Icon 
              name={getGoalTypeIcon(goal?.type)} 
              size={20} 
              className={
                getGoalTypeColor(goal?.type) === 'primary' ? 'text-primary' :
                getGoalTypeColor(goal?.type) === 'success' ? 'text-success' :
                getGoalTypeColor(goal?.type) === 'warning' ? 'text-warning' :
                getGoalTypeColor(goal?.type) === 'error'? 'text-error' : 'text-secondary'
              }
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{goal?.title}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {goal?.type?.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            iconName="Edit"
            onClick={() => onEdit(goal?.id)}
          />
        </div>
      </div>
      <div className="mb-4">
        <ProgressVisualization
          type="bar"
          value={goal?.currentValue}
          max={goal?.targetValue}
          label={`${goal?.currentValue} / ${goal?.targetValue} ${goal?.unit}`}
          color={getGoalTypeColor(goal?.type)}
          showPercentage={true}
          showDetails={true}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>Target: {formatDate(goal?.targetDate)}</span>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 ${
          isOverdue ? 'text-error' : isUrgent ? 'text-warning' : 'text-muted-foreground'
        }`}>
          <Icon name="Clock" size={14} />
          <span>
            {isOverdue 
              ? `${Math.abs(daysRemaining)} days overdue`
              : `${daysRemaining} days left`
            }
          </span>
        </div>
      </div>
      {goal?.description && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {goal?.description}
        </p>
      )}
      <div className="flex items-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => onUpdate(goal?.id)}
          className="flex-1"
        >
          Update Progress
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="BarChart3"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default GoalCard;