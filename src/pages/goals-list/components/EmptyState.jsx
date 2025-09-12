import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasFilters, onClearFilters, onAddGoal }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No goals match your filters
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Try adjusting your search terms or filters to find the goals you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onAddGoal}
          >
            Add New Goal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Target" size={32} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        Start Your Fitness Journey
      </h3>
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
        Set your first fitness goal and begin tracking your progress. Whether it's weight loss, muscle gain, or improving endurance, every journey starts with a single goal.
      </p>
      
      <div className="space-y-4">
        <Button
          variant="default"
          size="lg"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddGoal}
        >
          Create Your First Goal
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span>Track progress visually</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span>Set target dates</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-warning" />
            <span>Monitor achievements</span>
          </div>
        </div>
      </div>

      {/* Onboarding Tips */}
      <div className="mt-12 bg-muted/30 rounded-lg p-6 max-w-2xl mx-auto">
        <h4 className="font-semibold text-foreground mb-4 flex items-center justify-center space-x-2">
          <Icon name="Lightbulb" size={20} className="text-warning" />
          <span>Quick Tips for Success</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Target" size={16} className="text-primary" />
            </div>
            <p className="font-medium text-foreground mb-1">Be Specific</p>
            <p className="text-muted-foreground">Set clear, measurable targets</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Calendar" size={16} className="text-success" />
            </div>
            <p className="font-medium text-foreground mb-1">Set Deadlines</p>
            <p className="text-muted-foreground">Choose realistic target dates</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="BarChart3" size={16} className="text-warning" />
            </div>
            <p className="font-medium text-foreground mb-1">Track Daily</p>
            <p className="text-muted-foreground">Regular check-ins boost success</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;