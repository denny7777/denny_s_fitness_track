import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ImpactPreview = ({ originalGoal, updatedGoal, className = '' }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate impact metrics
  const calculateImpact = () => {
    if (!originalGoal || !updatedGoal) return null;

    const originalProgress = (originalGoal?.currentValue / originalGoal?.targetValue) * 100;
    const updatedProgress = (updatedGoal?.currentValue / updatedGoal?.targetValue) * 100;
    const progressChange = updatedProgress - originalProgress;

    const originalDaysRemaining = Math.ceil((new Date(originalGoal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    const updatedDaysRemaining = Math.ceil((new Date(updatedGoal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    const timelineChange = updatedDaysRemaining - originalDaysRemaining;

    const targetValueChange = updatedGoal?.targetValue - originalGoal?.targetValue;
    const currentValueChange = updatedGoal?.currentValue - originalGoal?.currentValue;

    return {
      progressChange,
      timelineChange,
      targetValueChange,
      currentValueChange,
      originalProgress,
      updatedProgress,
      originalDaysRemaining,
      updatedDaysRemaining
    };
  };

  const impact = calculateImpact();

  if (!impact) {
    return null;
  }

  const getImpactLevel = () => {
    const changes = [
      Math.abs(impact?.progressChange),
      Math.abs(impact?.timelineChange) / 7, // Normalize weeks
      Math.abs(impact?.targetValueChange) / originalGoal?.targetValue * 100
    ];

    const maxChange = Math.max(...changes);
    
    if (maxChange > 20) return { level: 'high', color: 'error', icon: 'AlertTriangle' };
    if (maxChange > 10) return { level: 'medium', color: 'warning', icon: 'AlertCircle' };
    return { level: 'low', color: 'success', icon: 'CheckCircle' };
  };

  const impactLevel = getImpactLevel();

  const formatChange = (value, unit = '', showSign = true) => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value?.toFixed(1)}${unit}`;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon 
            name={impactLevel?.icon} 
            size={20} 
            className={`text-${impactLevel?.color}`} 
          />
          <h3 className="text-lg font-semibold text-foreground">
            Impact Preview
          </h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-150"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {/* Impact Level Indicator */}
      <div className={`p-4 rounded-lg mb-4 bg-${impactLevel?.color}/10 border border-${impactLevel?.color}/20`}>
        <div className="flex items-center space-x-2">
          <Icon 
            name={impactLevel?.icon} 
            size={16} 
            className={`text-${impactLevel?.color}`} 
          />
          <span className={`text-sm font-medium text-${impactLevel?.color}`}>
            {impactLevel?.level === 'high' ? 'High Impact Changes' :
             impactLevel?.level === 'medium'? 'Moderate Impact Changes' : 'Low Impact Changes'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {impactLevel?.level === 'high' ?'These changes will significantly affect your goal tracking and dashboard metrics.'
            : impactLevel?.level === 'medium' ?'These changes will moderately impact your progress calculations.' :'These changes will have minimal impact on your overall progress.'
          }
        </p>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className={`text-sm font-mono ${getChangeColor(impact?.progressChange)}`}>
              {formatChange(impact?.progressChange, '%')}
            </span>
          </div>
          <div className="text-lg font-semibold text-foreground mt-1">
            {impact?.updatedProgress?.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">
            was {impact?.originalProgress?.toFixed(1)}%
          </div>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Timeline</span>
            <span className={`text-sm font-mono ${getChangeColor(impact?.timelineChange)}`}>
              {formatChange(impact?.timelineChange, 'd')}
            </span>
          </div>
          <div className="text-lg font-semibold text-foreground mt-1">
            {impact?.updatedDaysRemaining}d
          </div>
          <div className="text-xs text-muted-foreground">
            was {impact?.originalDaysRemaining}d
          </div>
        </div>
      </div>
      {/* Detailed Changes */}
      {showDetails && (
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground">Detailed Changes</h4>
          
          <div className="space-y-2">
            {impact?.targetValueChange !== 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target Value</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-muted-foreground">
                    {originalGoal?.targetValue} → {updatedGoal?.targetValue}
                  </span>
                  <span className={`font-mono ${getChangeColor(impact?.targetValueChange)}`}>
                    ({formatChange(impact?.targetValueChange)})
                  </span>
                </div>
              </div>
            )}

            {impact?.currentValueChange !== 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Value</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-muted-foreground">
                    {originalGoal?.currentValue} → {updatedGoal?.currentValue}
                  </span>
                  <span className={`font-mono ${getChangeColor(impact?.currentValueChange)}`}>
                    ({formatChange(impact?.currentValueChange)})
                  </span>
                </div>
              </div>
            )}

            {originalGoal?.targetDate !== updatedGoal?.targetDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target Date</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-muted-foreground">
                    {new Date(originalGoal.targetDate)?.toLocaleDateString()} → {new Date(updatedGoal.targetDate)?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {originalGoal?.goalType !== updatedGoal?.goalType && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Goal Type</span>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {originalGoal?.goalType} → {updatedGoal?.goalType}
                  </span>
                  <Icon name="AlertTriangle" size={14} className="text-warning" />
                </div>
              </div>
            )}
          </div>

          {/* Dashboard Impact */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <h5 className="text-sm font-medium text-foreground mb-2">
              Dashboard Impact
            </h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Overall progress percentage will be recalculated</li>
              <li>• Goal completion timeline may shift</li>
              <li>• Weekly progress charts will reflect new targets</li>
              {impactLevel?.level === 'high' && (
                <li className="text-warning">• Historical comparisons may be affected</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactPreview;