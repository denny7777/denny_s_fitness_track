import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ onFiltersChange, totalEntries }) => {
  const [dateRange, setDateRange] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const moodOptions = [
    { value: 'all', label: 'All Moods' },
    { value: '5', label: '😍 Excellent (5)' },
    { value: '4', label: '😊 Good (4)' },
    { value: '3', label: '😐 Okay (3)' },
    { value: '2', label: '😕 Poor (2)' },
    { value: '1', label: '😞 Terrible (1)' }
  ];

  const goalOptions = [
    { value: 'all', label: 'All Goals' },
    { value: 'weight-loss', label: 'Weight Loss Goals' },
    { value: 'strength', label: 'Strength Goals' },
    { value: 'endurance', label: 'Endurance Goals' },
    { value: 'flexibility', label: 'Flexibility Goals' }
  ];

  const handleFilterChange = (filterType, value) => {
    const filters = {
      dateRange: filterType === 'dateRange' ? value : dateRange,
      moodFilter: filterType === 'moodFilter' ? value : moodFilter,
      goalFilter: filterType === 'goalFilter' ? value : goalFilter,
      searchQuery: filterType === 'searchQuery' ? value : searchQuery
    };

    // Update local state
    switch (filterType) {
      case 'dateRange':
        setDateRange(value);
        break;
      case 'moodFilter':
        setMoodFilter(value);
        break;
      case 'goalFilter':
        setGoalFilter(value);
        break;
      case 'searchQuery':
        setSearchQuery(value);
        break;
    }

    // Notify parent component
    onFiltersChange(filters);
  };

  const clearAllFilters = () => {
    setDateRange('all');
    setMoodFilter('all');
    setGoalFilter('all');
    setSearchQuery('');
    onFiltersChange({
      dateRange: 'all',
      moodFilter: 'all',
      goalFilter: 'all',
      searchQuery: ''
    });
  };

  const hasActiveFilters = dateRange !== 'all' || moodFilter !== 'all' || goalFilter !== 'all' || searchQuery !== '';

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Filter Check-ins</h3>
          <span className="text-sm text-muted-foreground">
            ({totalEntries} entries)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
      </div>
      {/* Search bar - always visible */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search workout descriptions..."
          value={searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Filter controls */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${!isExpanded ? 'hidden md:grid' : ''}`}>
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />

        <Select
          label="Mood Filter"
          options={moodOptions}
          value={moodFilter}
          onChange={(value) => handleFilterChange('moodFilter', value)}
        />

        <Select
          label="Goal Type"
          options={goalOptions}
          value={goalFilter}
          onChange={(value) => handleFilterChange('goalFilter', value)}
        />
      </div>
      {/* Custom date range inputs */}
      {dateRange === 'custom' && (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ${!isExpanded ? 'hidden md:grid' : ''}`}>
          <Input
            type="date"
            label="Start Date"
            onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
          />
          <Input
            type="date"
            label="End Date"
            onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
          />
        </div>
      )}
      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {dateRange !== 'all' && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <Icon name="Calendar" size={14} />
                <span>{dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}</span>
                <button
                  onClick={() => handleFilterChange('dateRange', 'all')}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {moodFilter !== 'all' && (
              <div className="flex items-center space-x-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                <Icon name="Smile" size={14} />
                <span>{moodOptions?.find(opt => opt?.value === moodFilter)?.label}</span>
                <button
                  onClick={() => handleFilterChange('moodFilter', 'all')}
                  className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {goalFilter !== 'all' && (
              <div className="flex items-center space-x-1 bg-warning/10 text-warning px-3 py-1 rounded-full text-sm">
                <Icon name="Target" size={14} />
                <span>{goalOptions?.find(opt => opt?.value === goalFilter)?.label}</span>
                <button
                  onClick={() => handleFilterChange('goalFilter', 'all')}
                  className="ml-1 hover:bg-warning/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {searchQuery && (
              <div className="flex items-center space-x-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                <Icon name="Search" size={14} />
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => handleFilterChange('searchQuery', '')}
                  className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;