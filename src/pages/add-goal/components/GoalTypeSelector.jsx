import React from 'react';
import Icon from '../../../components/AppIcon';

const GoalTypeSelector = ({ selectedType, onTypeSelect, error }) => {
  const goalTypes = [
    {
      id: 'weight_loss',
      name: 'Weight Loss',
      icon: 'TrendingDown',
      description: 'Track weight reduction goals',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'strength',
      name: 'Strength Training',
      icon: 'Dumbbell',
      description: 'Build muscle and increase strength',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'endurance',
      name: 'Endurance',
      icon: 'Activity',
      description: 'Improve cardiovascular fitness',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'flexibility',
      name: 'Flexibility',
      icon: 'Zap',
      description: 'Enhance mobility and flexibility',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      icon: 'Apple',
      description: 'Track dietary and nutrition goals',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'custom',
      name: 'Custom Goal',
      icon: 'Target',
      description: 'Create your own goal type',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Goal Type <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {goalTypes?.map((type) => (
            <button
              key={type?.id}
              type="button"
              onClick={() => onTypeSelect(type?.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-soft ${
                selectedType === type?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${type?.bgColor}`}>
                  <Icon name={type?.icon} size={20} className={type?.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm mb-1">
                    {type?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {type?.description}
                  </p>
                </div>
                {selectedType === type?.id && (
                  <Icon name="Check" size={16} className="text-primary mt-1" />
                )}
              </div>
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>
    </div>
  );
};

export default GoalTypeSelector;