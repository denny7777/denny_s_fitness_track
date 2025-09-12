import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ProgressVisualization from '../../../components/ui/ProgressVisualization';

const GoalProgressUpdater = ({ onUpdate }) => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Lose 15 lbs',
      currentValue: 8,
      targetValue: 15,
      unit: 'lbs',
      type: 'weight_loss',
      targetDate: '2025-12-31',
      description: 'Reach my target weight for better health'
    },
    {
      id: 2,
      title: 'Run 5K in under 25 minutes',
      currentValue: 28,
      targetValue: 25,
      unit: 'minutes',
      type: 'endurance',
      targetDate: '2025-11-30',
      description: 'Improve my running speed and endurance'
    },
    {
      id: 3,
      title: 'Workout 5 days per week',
      currentValue: 18,
      targetValue: 20,
      unit: 'days',
      type: 'consistency',
      targetDate: '2025-10-31',
      description: 'Maintain consistent workout schedule this month'
    }
  ]);

  const [editingGoal, setEditingGoal] = useState(null);
  const [newValue, setNewValue] = useState('');

  const getGoalIcon = (type) => {
    const icons = {
      weight_loss: 'Scale',
      endurance: 'Timer',
      consistency: 'Calendar',
      strength: 'Dumbbell',
      flexibility: 'Flower2'
    };
    return icons?.[type] || 'Target';
  };

  const handleQuickUpdate = (goalId, increment) => {
    setGoals(goals?.map(goal => {
      if (goal?.id === goalId) {
        const newCurrentValue = Math.max(0, goal?.currentValue + increment);
        const updatedGoal = { ...goal, currentValue: newCurrentValue };
        onUpdate(updatedGoal);
        return updatedGoal;
      }
      return goal;
    }));
  };

  const handleManualUpdate = (goalId) => {
    if (!newValue || isNaN(parseFloat(newValue))) return;
    
    setGoals(goals?.map(goal => {
      if (goal?.id === goalId) {
        const updatedGoal = { ...goal, currentValue: parseFloat(newValue) };
        onUpdate(updatedGoal);
        return updatedGoal;
      }
      return goal;
    }));
    
    setEditingGoal(null);
    setNewValue('');
  };

  const startEditing = (goal) => {
    setEditingGoal(goal?.id);
    setNewValue(goal?.currentValue?.toString());
  };

  const cancelEditing = () => {
    setEditingGoal(null);
    setNewValue('');
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Update Goal Progress</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          onClick={() => window.location.href = '/add-goal'}
        >
          Add Goal
        </Button>
      </div>
      <div className="space-y-4">
        {goals?.map((goal) => {
          const progressPercentage = getProgressPercentage(goal?.currentValue, goal?.targetValue);
          const daysRemaining = getDaysRemaining(goal?.targetDate);
          const isCompleted = goal?.currentValue >= goal?.targetValue;

          return (
            <div
              key={goal?.id}
              className={`p-4 rounded-lg border transition-all duration-150 hover:shadow-soft ${
                isCompleted 
                  ? 'bg-success/10 border-success/20' :'bg-muted/30 border-border'
              }`}
            >
              {/* Goal Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isCompleted ? 'bg-success text-success-foreground' : 'bg-primary/10 text-primary'
                  }`}>
                    <Icon name={getGoalIcon(goal?.type)} size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{goal?.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {goal?.description}
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-xs font-medium">Completed!</span>
                  </div>
                )}
              </div>
              {/* Progress Visualization */}
              <div className="mb-4">
                <ProgressVisualization
                  type="bar"
                  value={goal?.currentValue}
                  max={goal?.targetValue}
                  label={`Progress: ${goal?.currentValue} / ${goal?.targetValue} ${goal?.unit}`}
                  showPercentage={true}
                  color={isCompleted ? 'success' : 'primary'}
                  animated={true}
                />
              </div>
              {/* Update Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {editingGoal === goal?.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e?.target?.value)}
                        placeholder="Enter value"
                        className="w-24"
                      />
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Check"
                        onClick={() => handleManualUpdate(goal?.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={cancelEditing}
                      />
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Minus"
                        onClick={() => handleQuickUpdate(goal?.id, -1)}
                        disabled={goal?.currentValue <= 0}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(goal)}
                        className="px-3"
                      >
                        {goal?.currentValue} {goal?.unit}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Plus"
                        onClick={() => handleQuickUpdate(goal?.id, 1)}
                        disabled={isCompleted}
                      />
                    </>
                  )}
                </div>

                {/* Goal Info */}
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="TrendingUp" size={12} />
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {goals?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Target" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">No Goals Yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first fitness goal to start tracking progress.
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => window.location.href = '/add-goal'}
            >
              Add Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalProgressUpdater;