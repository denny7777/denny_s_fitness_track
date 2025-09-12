import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionToolbar = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [streakCount] = useState(7); // Mock streak data

  const quickActions = [
    {
      label: 'Quick Check-In',
      icon: 'Plus',
      primary: true,
      action: () => window.location.href = '/daily-check-in'
    },
    {
      label: 'Add Goal',
      icon: 'Target',
      action: () => window.location.href = '/add-goal'
    },
    {
      label: 'View Progress',
      icon: 'TrendingUp',
      action: () => window.location.href = '/check-in-history'
    }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Desktop Toolbar */}
      <div className={`hidden lg:flex items-center justify-between p-4 bg-card rounded-lg border border-border shadow-soft ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Flame" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {streakCount} Day Streak
              </p>
              <p className="text-xs text-muted-foreground">
                Keep it going!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {quickActions?.map((action, index) => (
            <Button
              key={index}
              variant={action?.primary ? 'default' : 'outline'}
              size="sm"
              iconName={action?.icon}
              iconPosition="left"
              onClick={action?.action}
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-70">
        <div className="flex flex-col items-end space-y-3">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="flex flex-col space-y-2 animate-slide-in-right">
              {quickActions?.slice(1)?.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  iconName={action?.icon}
                  onClick={() => {
                    action?.action();
                    setIsExpanded(false);
                  }}
                  className="shadow-elevated bg-card"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="flex items-center space-x-2">
            {/* Streak Indicator */}
            <div className="bg-card border border-border rounded-full px-3 py-2 shadow-elevated">
              <div className="flex items-center space-x-1">
                <Icon name="Flame" size={16} className="text-success" />
                <span className="text-sm font-medium text-foreground">
                  {streakCount}
                </span>
              </div>
            </div>

            {/* Main FAB */}
            <div className="relative">
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                onClick={quickActions?.[0]?.action}
                className="rounded-full w-14 h-14 shadow-elevated"
              />
              
              {/* Expand Button */}
              <button
                onClick={toggleExpanded}
                className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-elevated transition-transform duration-150 hover:scale-110"
              >
                <Icon 
                  name={isExpanded ? 'X' : 'MoreHorizontal'} 
                  size={14} 
                  color="white" 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickActionToolbar;