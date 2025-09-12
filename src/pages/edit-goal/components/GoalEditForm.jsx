import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GoalEditForm = ({ goalData, onSave, onCancel, isLoading }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const goalId = searchParams?.get('id');

  const [formData, setFormData] = useState({
    title: '',
    targetValue: '',
    currentValue: '',
    unit: '',
    targetDate: '',
    description: '',
    goalType: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const goalTypeOptions = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'general_fitness', label: 'General Fitness' }
  ];

  const unitOptions = [
    { value: 'lbs', label: 'Pounds (lbs)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'reps', label: 'Repetitions' },
    { value: 'minutes', label: 'Minutes' },
    { value: 'miles', label: 'Miles' },
    { value: 'km', label: 'Kilometers' },
    { value: 'days', label: 'Days' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  useEffect(() => {
    if (goalData) {
      const initialData = {
        title: goalData?.title || '',
        targetValue: goalData?.targetValue?.toString() || '',
        currentValue: goalData?.currentValue?.toString() || '',
        unit: goalData?.unit || '',
        targetDate: goalData?.targetDate || '',
        description: goalData?.description || '',
        goalType: goalData?.goalType || '',
        priority: goalData?.priority || 'medium'
      };
      setFormData(initialData);
    }
  }, [goalData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!formData?.targetValue || parseFloat(formData?.targetValue) <= 0) {
      newErrors.targetValue = 'Target value must be greater than 0';
    }

    if (!formData?.currentValue || parseFloat(formData?.currentValue) < 0) {
      newErrors.currentValue = 'Current value cannot be negative';
    }

    if (parseFloat(formData?.currentValue) > parseFloat(formData?.targetValue)) {
      newErrors.currentValue = 'Current value cannot exceed target value';
    }

    if (!formData?.unit) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData?.targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (targetDate < today) {
        newErrors.targetDate = 'Target date cannot be in the past';
      }
    }

    if (!formData?.goalType) {
      newErrors.goalType = 'Goal type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedGoal = {
      ...goalData,
      ...formData,
      targetValue: parseFloat(formData?.targetValue),
      currentValue: parseFloat(formData?.currentValue),
      updatedAt: new Date()?.toISOString()
    };

    onSave(updatedGoal);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Mock delete functionality
    navigate('/goals-list');
  };

  const calculateProgress = () => {
    const current = parseFloat(formData?.currentValue) || 0;
    const target = parseFloat(formData?.targetValue) || 1;
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = () => {
    if (!formData?.targetDate) return null;
    
    const target = new Date(formData.targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Title */}
        <Input
          label="Goal Title"
          type="text"
          placeholder="Enter your fitness goal"
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          error={errors?.title}
          required
          className="mb-4"
        />

        {/* Goal Type */}
        <Select
          label="Goal Type"
          options={goalTypeOptions}
          value={formData?.goalType}
          onChange={(value) => handleInputChange('goalType', value)}
          error={errors?.goalType}
          required
          className="mb-4"
        />

        {/* Target and Current Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Target Value"
            type="number"
            placeholder="100"
            value={formData?.targetValue}
            onChange={(e) => handleInputChange('targetValue', e?.target?.value)}
            error={errors?.targetValue}
            required
            min="0"
            step="0.1"
          />

          <Input
            label="Current Value"
            type="number"
            placeholder="50"
            value={formData?.currentValue}
            onChange={(e) => handleInputChange('currentValue', e?.target?.value)}
            error={errors?.currentValue}
            required
            min="0"
            step="0.1"
          />

          <Select
            label="Unit"
            options={unitOptions}
            value={formData?.unit}
            onChange={(value) => handleInputChange('unit', value)}
            error={errors?.unit}
            required
          />
        </div>

        {/* Progress Preview */}
        {formData?.targetValue && formData?.currentValue && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Progress Preview
              </span>
              <span className="text-sm font-mono text-foreground">
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
        )}

        {/* Target Date and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Target Date"
            type="date"
            value={formData?.targetDate}
            onChange={(e) => handleInputChange('targetDate', e?.target?.value)}
            error={errors?.targetDate}
            required
            min={new Date()?.toISOString()?.split('T')?.[0]}
          />

          <Select
            label="Priority Level"
            options={priorityOptions}
            value={formData?.priority}
            onChange={(value) => handleInputChange('priority', value)}
          />
        </div>

        {/* Days Remaining Indicator */}
        {formData?.targetDate && (
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              {getDaysRemaining() > 0 
                ? `${getDaysRemaining()} days remaining`
                : getDaysRemaining() === 0
                ? 'Due today'
                : `${Math.abs(getDaysRemaining())} days overdue`
              }
            </span>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            placeholder="Describe your goal and motivation..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>

        {/* Warning Messages */}
        {hasChanges && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Unsaved Changes
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your modifications will affect progress calculations and historical data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            className="sm:flex-1"
          >
            Save Changes
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="sm:flex-1"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            iconName="Trash2"
            iconPosition="left"
            className="sm:w-auto"
          >
            Delete Goal
          </Button>
        </div>
      </form>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Delete Goal</h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete "{formData?.title}"? All progress history and check-ins related to this goal will be permanently removed.
            </p>

            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                iconName="Trash2"
                iconPosition="left"
                className="flex-1"
              >
                Delete Goal
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalEditForm;