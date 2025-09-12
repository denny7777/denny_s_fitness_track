import React from 'react';
import Icon from '../../../components/AppIcon';
import ProgressVisualization from '../../../components/ui/ProgressVisualization';

const MetricsCard = ({ title, value, subtitle, icon, color = 'primary', trend, progressData }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus';
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    return trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover-lift transition-all duration-150">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            color === 'primary' ? 'bg-primary/10' :
            color === 'secondary' ? 'bg-secondary/10' :
            color === 'success' ? 'bg-success/10' :
            color === 'warning'? 'bg-warning/10' : 'bg-primary/10'
          }`}>
            <Icon 
              name={icon} 
              size={24} 
              className={
                color === 'primary' ? 'text-primary' :
                color === 'secondary' ? 'text-secondary' :
                color === 'success' ? 'text-success' :
                color === 'warning'? 'text-warning' : 'text-primary'
              }
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-2xl font-bold text-foreground font-mono">{value}</p>
          </div>
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>
      )}
      {progressData && (
        <ProgressVisualization
          type="bar"
          value={progressData?.current}
          max={progressData?.target}
          color={color}
          size="sm"
          showPercentage={false}
          className="mt-3"
        />
      )}
    </div>
  );
};

export default MetricsCard;