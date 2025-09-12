import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GoalFormFields = ({ formData, errors, onChange }) => {
  const unitOptions = [
    { value: 'lbs', label: 'Pounds (lbs)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'miles', label: 'Miles' },
    { value: 'km', label: 'Kilometers (km)' },
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'reps', label: 'Repetitions' },
    { value: 'sets', label: 'Sets' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'glasses', label: 'Glasses' },
    { value: 'calories', label: 'Calories' },
    { value: 'steps', label: 'Steps' },
    { value: 'custom', label: 'Custom Unit' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  // Calculate minimum date (today)
  const today = new Date()?.toISOString()?.split('T')?.[0];

  return (
    <div className="space-y-6">
      {/* Goal Title */}
      <Input
        label="Goal Title"
        type="text"
        placeholder="e.g., Lose 10 pounds, Run 5K, Bench press 200 lbs"
        value={formData?.title}
        onChange={(e) => handleInputChange('title', e?.target?.value)}
        error={errors?.title}
        required
        maxLength={100}
        description="Give your goal a clear, motivating title"
      />
      {/* Target Value and Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Target Value"
          type="number"
          placeholder="0"
          value={formData?.target_value}
          onChange={(e) => handleInputChange('target_value', e?.target?.value)}
          error={errors?.target_value}
          required
          min="0"
          step="0.1"
          description="The number you want to achieve"
        />

        <Select
          label="Unit"
          options={unitOptions}
          value={formData?.unit}
          onChange={(value) => handleInputChange('unit', value)}
          error={errors?.unit}
          required
          placeholder="Select unit"
          description="Choose the measurement unit"
        />
      </div>
      {/* Custom Unit Input */}
      {formData?.unit === 'custom' && (
        <Input
          label="Custom Unit"
          type="text"
          placeholder="e.g., workouts, sessions, portions"
          value={formData?.custom_unit}
          onChange={(e) => handleInputChange('custom_unit', e?.target?.value)}
          error={errors?.custom_unit}
          required
          maxLength={20}
          description="Specify your custom measurement unit"
        />
      )}
      {/* Current Value */}
      <Input
        label="Current Value"
        type="number"
        placeholder="0"
        value={formData?.current_value}
        onChange={(e) => handleInputChange('current_value', e?.target?.value)}
        error={errors?.current_value}
        min="0"
        step="0.1"
        description="Your starting point (leave 0 if starting fresh)"
      />
      {/* Target Date */}
      <Input
        label="Target Date"
        type="date"
        value={formData?.target_date}
        onChange={(e) => handleInputChange('target_date', e?.target?.value)}
        error={errors?.target_date}
        required
        min={today}
        description="When do you want to achieve this goal?"
      />
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          placeholder="Describe your goal, motivation, and any specific details..."
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          rows={4}
          maxLength={500}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            Add context and motivation for your goal
          </p>
          <span className="text-xs text-muted-foreground">
            {formData?.description?.length}/500
          </span>
        </div>
        {errors?.description && (
          <p className="mt-1 text-sm text-error">{errors?.description}</p>
        )}
      </div>
    </div>
  );
};

export default GoalFormFields;