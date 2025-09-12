import React from 'react';
import Icon from '../../../components/AppIcon';
import ProgressVisualization from '../../../components/ui/ProgressVisualization';

const GoalPreview = ({ formData, isValid }) => {
  if (!isValid || !formData?.title || !formData?.targetValue) {
    return (
      <div className="bg-muted/30 rounded-lg p-6 border border-border">
        <div className="text-center py-8">
          <Icon name="Eye" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-muted-foreground mb-2">Goal Preview</h3>
          <p className="text-sm text-muted-foreground">
            Fill in the required fields to see how your goal will look
          </p>
        </div>
      </div>
    );
  }

  const displayUnit = formData?.unit === 'custom' ? formData?.customUnit : formData?.unit;
  const currentValue = parseFloat(formData?.currentValue) || 0;
  const targetValue = parseFloat(formData?.targetValue) || 0;
  const progress = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysRemaining = () => {
    if (!formData?.targetDate) return null;
    const today = new Date();
    const target = new Date(formData.targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-soft">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Eye" size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Goal Preview</h3>
      </div>
      <div className="space-y-4">
        {/* Goal Header */}
        <div>
          <h4 className="font-semibold text-foreground text-lg mb-2">
            {formData?.title}
          </h4>
          {formData?.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {formData?.description}
            </p>
          )}
        </div>

        {/* Progress Visualization */}
        <div className="bg-muted/30 rounded-lg p-4">
          <ProgressVisualization
            type="bar"
            value={currentValue}
            max={targetValue}
            label="Progress"
            showPercentage={true}
            showDetails={false}
            color="primary"
            size="default"
            animated={false}
          />
        </div>

        {/* Goal Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Target
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {targetValue} {displayUnit}
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="TrendingUp" size={16} className="text-secondary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Current
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {currentValue} {displayUnit}
            </p>
          </div>
        </div>

        {/* Timeline */}
        {formData?.targetDate && (
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Calendar" size={16} className="text-warning" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Target Date
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {formatDate(formData?.targetDate)}
                </p>
              </div>
              {daysRemaining !== null && (
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {daysRemaining}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    days left
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Goal Type Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {formData?.goalType?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase()) || 'Custom Goal'}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalPreview;