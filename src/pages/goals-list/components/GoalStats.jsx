import React from 'react';
import Icon from '../../../components/AppIcon';

const GoalStats = ({ goals }) => {
  const totalGoals = goals?.length;
  const completedGoals = goals?.filter(goal => (goal?.currentValue / goal?.targetValue) >= 1)?.length;
  const onTrackGoals = goals?.filter(goal => {
    const progress = (goal?.currentValue / goal?.targetValue) * 100;
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    return progress < 100 && (progress >= 50 || daysRemaining >= 30);
  })?.length;
  const behindGoals = goals?.filter(goal => {
    const progress = (goal?.currentValue / goal?.targetValue) * 100;
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    return progress < 100 && progress < 50 && daysRemaining < 30;
  })?.length;

  const averageProgress = totalGoals > 0 
    ? Math.round(goals?.reduce((sum, goal) => sum + (goal?.currentValue / goal?.targetValue) * 100, 0) / totalGoals)
    : 0;

  const stats = [
    {
      label: 'Total Goals',
      value: totalGoals,
      icon: 'Target',
      color: 'text-foreground',
      bgColor: 'bg-muted'
    },
    {
      label: 'Completed',
      value: completedGoals,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'On Track',
      value: onTrackGoals,
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Behind Schedule',
      value: behindGoals,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stat?.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
      {/* Average Progress */}
      <div className="lg:col-span-4 bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Average Progress
              </p>
              <p className="text-xs text-muted-foreground">
                Across all active goals
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {averageProgress}%
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalStats;