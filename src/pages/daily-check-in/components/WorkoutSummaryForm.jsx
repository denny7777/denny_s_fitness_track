import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WorkoutSummaryForm = ({ onSubmit, isLoading = false }) => {
  const [workoutSummary, setWorkoutSummary] = useState('');
  const [errors, setErrors] = useState({});

  const quickTemplates = [
    {
      id: 'rest',
      label: 'Rest Day',
      icon: 'Moon',
      template: 'Taking a well-deserved rest day to allow my body to recover and prepare for tomorrow\'s workout.'
    },
    {
      id: 'cardio',
      label: 'Cardio Session',
      icon: 'Heart',
      template: 'Completed a cardio session focusing on cardiovascular endurance and fat burning.'
    },
    {
      id: 'strength',
      label: 'Strength Training',
      icon: 'Dumbbell',
      template: 'Focused on strength training with compound movements and progressive overload.'
    },
    {
      id: 'yoga',
      label: 'Yoga/Flexibility',
      icon: 'Flower2',
      template: 'Practiced yoga and flexibility exercises to improve mobility and reduce stress.'
    }
  ];

  const handleTemplateSelect = (template) => {
    setWorkoutSummary(template);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!workoutSummary?.trim()) {
      newErrors.workoutSummary = 'Please describe your workout or select a template';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ workoutSummary: workoutSummary?.trim() });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="FileText" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Workout Summary</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Templates */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Quick Templates
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {quickTemplates?.map((template) => (
              <Button
                key={template?.id}
                type="button"
                variant="outline"
                size="sm"
                iconName={template?.icon}
                iconPosition="left"
                onClick={() => handleTemplateSelect(template?.template)}
                className="justify-start text-xs"
              >
                {template?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Workout Description */}
        <div>
          <Input
            label="Describe Your Workout"
            type="text"
            value={workoutSummary}
            onChange={(e) => {
              setWorkoutSummary(e?.target?.value);
              if (errors?.workoutSummary) {
                setErrors({ ...errors, workoutSummary: '' });
              }
            }}
            placeholder="What did you do today? Include exercises, duration, intensity..."
            error={errors?.workoutSummary}
            required
            className="min-h-[100px]"
            style={{ resize: 'vertical' }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Be specific about exercises, sets, reps, duration, or any other relevant details.
          </p>
        </div>

        {/* Character Counter */}
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {workoutSummary?.length > 0 ? `${workoutSummary?.length} characters` : 'Start typing...'}
          </span>
          <span>
            {workoutSummary?.length > 500 && 'Consider keeping it concise'}
          </span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          iconName="Save"
          iconPosition="left"
          className="w-full sm:w-auto"
        >
          Save Workout Summary
        </Button>
      </form>
    </div>
  );
};

export default WorkoutSummaryForm;