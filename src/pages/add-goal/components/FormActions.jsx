import React, { useState } from 'react';



const FormActions = ({ 
  currentStep, 
  onBack, 
  onNext, 
  onSave, 
  onSubmit, 
  onCancel, 
  isLoading, 
  isSubmitting, 
  isValid, 
  canProceed, 
  hasUnsavedChanges,
  disabled = false 
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      onCancel();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onCancel();
  };

  const cancelDialog = () => {
    setShowCancelDialog(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting || disabled}
            className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || disabled}
          className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        {currentStep < 4 && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || isSubmitting || disabled}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 1 ? 'Continue' : 'Next'}
          </button>
        )}

        {currentStep === 4 && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isValid || isSubmitting || disabled}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            )}
            <span>{isSubmitting ? 'Creating Goal...' : 'Create Goal'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FormActions;