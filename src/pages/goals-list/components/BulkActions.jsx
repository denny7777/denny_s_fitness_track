import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedGoals, onBulkDelete, onBulkUpdate, onSelectAll, onClearSelection, totalGoals }) => {
  const selectedCount = selectedGoals?.length;

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:relative lg:bottom-auto lg:left-auto lg:transform-none lg:z-auto">
      <div className="bg-card border border-border rounded-lg shadow-elevated p-4">
        <div className="flex items-center justify-between space-x-4">
          {/* Selection Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="font-medium text-foreground">
                {selectedCount} selected
              </span>
            </div>
            
            <div className="w-px h-6 bg-border"></div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelectAll}
                disabled={selectedCount === totalGoals}
              >
                Select All ({totalGoals})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Edit2"
              iconPosition="left"
              onClick={onBulkUpdate}
            >
              Update Progress
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={onBulkDelete}
            >
              Delete ({selectedCount})
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden mt-3 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Edit2"
              iconPosition="left"
              onClick={onBulkUpdate}
              fullWidth
            >
              Update
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={onBulkDelete}
              fullWidth
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;