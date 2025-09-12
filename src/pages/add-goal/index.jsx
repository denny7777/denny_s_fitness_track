import React, { useState, useCallback, useMemo } from 'react';
import Header from '../../components/ui/Header';
import GoalTypeSelector from './components/GoalTypeSelector';
import GoalTemplateSelector from './components/GoalTemplateSelector';
import GoalFormFields from './components/GoalFormFields';
import GoalPreview from './components/GoalPreview';
import FormActions from './components/FormActions';
import { useAuth } from '../../contexts/AuthContext';
import { goalService } from '../../services/goalService';

const AddGoal = () => {
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: '',
    target_value: '',
    current_value: 0,
    unit: '',
    custom_unit: '',
    target_date: '',
    template_id: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single validation function to prevent conflicts
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!formData?.goal_type) {
      newErrors.goal_type = 'Please select a goal type';
    }

    if (!formData?.target_value || parseFloat(formData?.target_value) <= 0) {
      newErrors.target_value = 'Target value must be greater than 0';
    }

    if (!formData?.unit) {
      newErrors.unit = 'Please select a unit';
    }

    if (formData?.unit === 'custom' && !formData?.custom_unit?.trim()) {
      newErrors.custom_unit = 'Please specify your custom unit';
    }

    if (!formData?.target_date) {
      newErrors.target_date = 'Target date is required';
    } else {
      const targetDate = new Date(formData?.target_date);
      const today = new Date();
      today?.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
      if (targetDate <= today) {
        newErrors.target_date = 'Target date must be in the future';
      }
    }

    if (formData?.current_value && parseFloat(formData?.current_value) < 0) {
      newErrors.current_value = 'Current value cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  }, [formData]);

  // Simplified validation check
  const isFormValid = useMemo(() => {
    return !!(
      formData?.title?.trim() &&
      formData?.goal_type &&
      formData?.target_value &&
      parseFloat(formData?.target_value) > 0 &&
      formData?.unit &&
      (formData?.unit !== 'custom' || formData?.custom_unit?.trim()) &&
      formData?.target_date &&
      new Date(formData?.target_date) > new Date()
    );
  }, [formData]);

  // Memoized handlers to prevent re-renders
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const handleTypeSelect = useCallback((type) => {
    setFormData(prev => ({
      ...prev,
      goal_type: type,
      template_id: null // Reset template when type changes
    }));
    setCurrentStep(2);
  }, []);

  const handleTemplateSelect = useCallback((template) => {
    setFormData(prev => ({
      ...prev,
      template_id: template?.id,
      title: template?.title || prev?.title,
      description: template?.description || prev?.description,
      target_value: template?.target_value || prev?.target_value,
      unit: template?.unit || prev?.unit
    }));
    setCurrentStep(3);
  }, []);

  const handleSkipTemplate = useCallback(() => {
    setCurrentStep(3);
  }, []);

  const handleSubmit = useCallback(async () => {
    console.log('Goal creation started', { user: user?.id, formData });
    
    if (!validateForm()) {
      console.error('Form validation failed', errors);
      return;
    }

    if (!user?.id) {
      console.error('User ID not available', { user });
      setErrors({ general: 'User authentication required. Please sign in again.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const goalData = {
        user_id: user?.id, // Remove optional chaining to ensure we have user ID
        title: formData?.title?.trim(),
        description: formData?.description?.trim() || null,
        goal_type: formData?.goal_type,
        target_value: parseFloat(formData?.target_value),
        current_value: parseFloat(formData?.current_value || 0),
        unit: formData?.unit === 'custom' ? formData?.custom_unit?.trim() : formData?.unit,
        target_date: formData?.target_date,
        status: 'active'
      };

      console.log('Submitting goal data:', goalData);

      const { data, error } = await goalService?.createGoal(goalData);

      console.log('Goal creation response:', { data, error });

      if (error) {
        console.error('Goal creation error:', error);
        setErrors({ 
          general: error?.message || error?.details || 'Failed to create goal. Please try again.' 
        });
        return;
      }

      if (!data) {
        console.error('No data returned from goal creation');
        setErrors({ general: 'Goal creation completed but no confirmation received.' });
        return;
      }

      console.log('Goal created successfully:', data);
      
      // Success - redirect to goals list
      window.location.href = '/goals-list';
      
    } catch (error) {
      console.error('Unexpected error during goal creation:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, user, validateForm, errors]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Enhanced Next button handler with validation
  const handleNext = useCallback(() => {
    // If we're at step 3 (form fields), validate before proceeding
    if (currentStep === 3) {
      if (!validateForm()) {
        console.log('Form validation failed, cannot proceed to next step', errors);
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  }, [currentStep, validateForm, errors]);

  const handleCancel = useCallback(() => {
    window.location.href = '/goals-list';
  }, []);

  const handleEditFromPreview = useCallback(() => {
    setCurrentStep(3);
  }, []);

  // Memoized computed values
  const hasUnsavedChanges = useMemo(() => {
    return Object.values(formData)?.some(value => value !== '' && value !== 0 && value !== null);
  }, [formData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to create fitness goals</p>
            <button 
              onClick={() => window.location.href = '/landing-page'}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4]?.map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-16 h-0.5 ${
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Enhanced Error Display */}
          {errors?.general && (
            <div className="mb-6 bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="text-error">⚠️</div>
                <div>
                  <span className="text-sm text-error font-medium">Goal Creation Error</span>
                  <p className="text-sm text-error mt-1">{errors?.general}</p>
                  {!user?.id && (
                    <button 
                      onClick={() => window.location.href = '/landing-page'} 
                      className="text-sm text-primary underline mt-2"
                    >
                      Sign in again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Debug Info (remove in production) */}
          {process.env?.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-muted rounded text-xs">
              <strong>Debug Info:</strong> User ID: {user?.id || 'Not available'}, 
              Form Valid: {isFormValid ? 'Yes' : 'No'}, 
              Step: {currentStep}/4
            </div>
          )}

          {/* Step Content */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {currentStep === 1 && (
              <GoalTypeSelector
                selectedType={formData?.goal_type}
                onTypeSelect={handleTypeSelect}
                error={errors?.goal_type}
              />
            )}

            {currentStep === 2 && (
              <GoalTemplateSelector
                selectedType={formData?.goal_type}
                goalType={formData?.goal_type}
                selectedTemplate={formData?.template_id}
                onTemplateSelect={handleTemplateSelect}
                onSelect={handleTemplateSelect}
                onSkipTemplate={handleSkipTemplate}
                onSkip={handleSkipTemplate}
              />
            )}

            {currentStep === 3 && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Goal Details</h2>
                  <p className="text-muted-foreground">
                    Fill in the details for your {formData?.goal_type?.replace('_', ' ')} goal
                  </p>
                </div>
                <GoalFormFields
                  formData={formData}
                  errors={errors}
                  onChange={handleFieldChange}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Goal</h2>
                  <p className="text-muted-foreground">
                    Please review your goal before creating it
                  </p>
                </div>
                <GoalPreview
                  formData={formData}
                  isValid={isFormValid}
                  onEdit={handleEditFromPreview}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-8">
            <FormActions
              currentStep={currentStep}
              onBack={handleBack}
              onNext={handleNext}
              onSave={handleSubmit}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              isSubmitting={isSubmitting}
              isValid={currentStep === 3 ? isFormValid : true}
              canProceed={currentStep === 3 ? isFormValid : true}
              hasUnsavedChanges={hasUnsavedChanges}
              disabled={!user?.id} // Disable if no user
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGoal;