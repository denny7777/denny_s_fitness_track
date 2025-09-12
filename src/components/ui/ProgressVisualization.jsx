import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ProgressVisualization = ({ 
  type = 'bar', 
  value = 0, 
  max = 100, 
  label = '', 
  showPercentage = true,
  showDetails = false,
  color = 'primary',
  size = 'default',
  animated = true,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const percentage = Math.min((value / max) * 100, 100);

  // Animate progress on mount
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const getColorClasses = (colorName) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      error: 'bg-error text-error-foreground'
    };
    return colors?.[colorName] || colors?.primary;
  };

  const getSizeClasses = (sizeType) => {
    const sizes = {
      sm: 'h-2',
      default: 'h-3',
      lg: 'h-4',
      xl: 'h-6'
    };
    return sizes?.[sizeType] || sizes?.default;
  };

  if (type === 'circle') {
    const radius = size === 'sm' ? 20 : size === 'lg' ? 40 : 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div 
        className={`relative inline-flex items-center justify-center ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          width={radius * 2 + 20}
          height={radius * 2 + 20}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={radius + 10}
            cy={radius + 10}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animated ? strokeDashoffset : circumference - (percentage / 100) * circumference}
            className={`${getColorClasses(color)?.split(' ')?.[0]?.replace('bg-', 'text-')} transition-all duration-300 progress-fill`}
            strokeLinecap="round"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-semibold text-foreground">
            {showPercentage ? `${Math.round(percentage)}%` : displayValue}
          </span>
          {label && (
            <span className="text-xs text-muted-foreground mt-1">
              {label}
            </span>
          )}
        </div>
        {/* Hover details */}
        {isHovered && showDetails && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-elevated text-xs whitespace-nowrap z-10">
            {displayValue} of {max}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
          </div>
        )}
      </div>
    );
  }

  if (type === 'streak') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1">
          <Icon name="Flame" size={20} className="text-success" />
          <span className="text-lg font-bold text-foreground font-mono">
            {displayValue}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <div className="flex space-x-1 mt-1">
            {[...Array(7)]?.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < displayValue 
                    ? 'bg-success celebration-glow' :'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default bar type
  return (
    <div 
      className={`w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label and value */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
        <div className="flex items-center space-x-2">
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
          <span className="text-sm font-mono text-foreground">
            {displayValue}/{max}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full bg-muted rounded-full overflow-hidden ${getSizeClasses(size)}`}>
        <div
          className={`${getSizeClasses(size)} ${getColorClasses(color)} rounded-full transition-all duration-300 progress-fill ${
            isHovered ? 'shadow-soft' : ''
          }`}
          style={{
            width: animated ? `${(displayValue / max) * 100}%` : `${percentage}%`
          }}
        />
      </div>

      {/* Details on hover */}
      {isHovered && showDetails && (
        <div className="mt-2 p-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          Progress: {displayValue} out of {max} completed
        </div>
      )}
    </div>
  );
};

// Compound component for multiple progress items
const ProgressGroup = ({ title, children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

// Export compound component
ProgressVisualization.Group = ProgressGroup;

export default ProgressVisualization;