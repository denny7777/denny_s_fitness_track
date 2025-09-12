import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalTemplateSelector = ({ selectedType, onTemplateSelect, onSkipTemplate }) => {
  const templates = {
    weight_loss: [
      {
        id: 'lose_10_lbs',
        title: 'Lose 10 pounds',
        targetValue: 10,
        unit: 'lbs',
        timeframe: '8 weeks',
        description: 'A healthy weight loss goal of 1-2 pounds per week'
      },
      {
        id: 'lose_20_lbs',
        title: 'Lose 20 pounds',
        targetValue: 20,
        unit: 'lbs',
        timeframe: '16 weeks',
        description: 'Sustainable weight loss over 4 months'
      }
    ],
    strength: [
      {
        id: 'bench_press_goal',
        title: 'Bench Press 200 lbs',
        targetValue: 200,
        unit: 'lbs',
        timeframe: '12 weeks',
        description: 'Progressive strength training for bench press'
      },
      {
        id: 'squat_goal',
        title: 'Squat 250 lbs',
        targetValue: 250,
        unit: 'lbs',
        timeframe: '16 weeks',
        description: 'Build lower body strength with squats'
      }
    ],
    endurance: [
      {
        id: 'run_5k',
        title: 'Run 5K without stopping',
        targetValue: 5,
        unit: 'km',
        timeframe: '8 weeks',
        description: 'Build cardiovascular endurance for 5K run'
      },
      {
        id: 'run_10k',
        title: 'Complete 10K race',
        targetValue: 10,
        unit: 'km',
        timeframe: '12 weeks',
        description: 'Train for and complete a 10K race'
      }
    ],
    flexibility: [
      {
        id: 'daily_stretch',
        title: 'Daily stretching routine',
        targetValue: 30,
        unit: 'days',
        timeframe: '30 days',
        description: '15-minute daily stretching for flexibility'
      }
    ],
    nutrition: [
      {
        id: 'water_intake',
        title: 'Drink 8 glasses of water daily',
        targetValue: 8,
        unit: 'glasses',
        timeframe: '30 days',
        description: 'Stay hydrated with proper water intake'
      }
    ]
  };

  const currentTemplates = templates?.[selectedType] || [];

  if (!selectedType || selectedType === 'custom' || currentTemplates?.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted/30 rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Lightbulb" size={20} className="text-warning" />
          <h3 className="font-semibold text-foreground">Quick Start Templates</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkipTemplate}
        >
          Skip Templates
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Choose a template to get started quickly, or skip to create your own custom goal.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentTemplates?.map((template) => (
          <button
            key={template?.id}
            type="button"
            onClick={() => onTemplateSelect(template)}
            className="p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-soft transition-all duration-200 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-foreground text-sm">
                {template?.title}
              </h4>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {template?.timeframe}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {template?.description}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-primary">
                Target: {template?.targetValue} {template?.unit}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GoalTemplateSelector;