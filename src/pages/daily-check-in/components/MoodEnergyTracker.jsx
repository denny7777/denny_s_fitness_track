import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MoodEnergyTracker = ({ mood, energyLevel, onChange }) => {
  const [localMood, setLocalMood] = useState(mood || 3);
  const [localEnergy, setLocalEnergy] = useState(energyLevel || 3);

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Very Low', color: 'text-red-500' },
    { value: 2, emoji: '😕', label: 'Low', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Excellent', color: 'text-emerald-500' }
  ];

  const energyLevels = [
    { value: 1, label: 'Exhausted', icon: 'Battery', color: 'text-red-500' },
    { value: 2, label: 'Low', icon: 'BatteryLow', color: 'text-orange-500' },
    { value: 3, label: 'Moderate', icon: 'Battery', color: 'text-yellow-500' },
    { value: 4, label: 'High', icon: 'Battery', color: 'text-green-500' },
    { value: 5, label: 'Energized', icon: 'Zap', color: 'text-emerald-500' }
  ];

  const handleMoodChange = (newMood) => {
    setLocalMood(newMood);
    if (onChange) {
      onChange('mood', newMood);
    }
  };

  const handleEnergyChange = (newEnergy) => {
    setLocalEnergy(newEnergy);
    if (onChange) {
      onChange('energy_level', newEnergy);
    }
  };

  const handleReset = () => {
    setLocalMood(3);
    setLocalEnergy(3);
    if (onChange) {
      onChange('mood', 3);
      onChange('energy_level', 3);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Heart" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Mood & Energy</h3>
      </div>
      <div className="space-y-6">
        {/* Mood Tracker */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            How are you feeling today?
          </label>
          <div className="flex justify-between items-center space-x-2">
            {moodEmojis?.map((moodItem) => (
              <button
                key={moodItem?.value}
                onClick={() => handleMoodChange(moodItem?.value)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-150 hover:bg-muted ${
                  localMood === moodItem?.value
                    ? 'bg-primary/10 border-2 border-primary' :'bg-muted/50 border-2 border-transparent'
                }`}
              >
                <span className="text-2xl mb-1">{moodItem?.emoji}</span>
                <span className={`text-xs font-medium ${
                  localMood === moodItem?.value ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {moodItem?.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level Tracker */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            What's your energy level?
          </label>
          
          {/* Energy Slider */}
          <div className="relative mb-4">
            <input
              type="range"
              min="1"
              max="5"
              value={localEnergy}
              onChange={(e) => handleEnergyChange(parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #eab308 50%, #22c55e 75%, #10b981 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Energy Level Indicators */}
          <div className="flex justify-between items-center">
            {energyLevels?.map((energyItem) => (
              <button
                key={energyItem?.value}
                onClick={() => handleEnergyChange(energyItem?.value)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-150 hover:bg-muted ${
                  localEnergy === energyItem?.value
                    ? 'bg-primary/10 border border-primary' :'border border-transparent'
                }`}
              >
                <Icon 
                  name={energyItem?.icon} 
                  size={16} 
                  className={localEnergy === energyItem?.value ? 'text-primary' : energyItem?.color}
                />
                <span className={`text-xs font-medium mt-1 ${
                  localEnergy === energyItem?.value ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {energyItem?.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Selection Summary */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{moodEmojis?.find(m => m?.value === localMood)?.emoji}</span>
                <span className="text-sm font-medium text-foreground">
                  {moodEmojis?.find(m => m?.value === localMood)?.label} Mood
                </span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={energyLevels?.find(e => e?.value === localEnergy)?.icon || 'Battery'} 
                  size={16} 
                  className="text-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  {energyLevels?.find(e => e?.value === localEnergy)?.label} Energy
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodEnergyTracker;