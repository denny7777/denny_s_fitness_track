import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterControls = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  selectedStatus, 
  onStatusChange, 
  sortBy, 
  onSortChange,
  onClearFilters,
  isMobile = false
}) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const goalTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'muscle-gain', label: 'Muscle Gain' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'strength', label: 'Strength' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'general', label: 'General Fitness' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'on-track', label: 'On Track' },
    { value: 'behind', label: 'Behind Schedule' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'target-date', label: 'Target Date' },
    { value: 'progress', label: 'Progress' },
    { value: 'title', label: 'Title A-Z' }
  ];

  const hasActiveFilters = searchTerm || selectedType !== 'all' || selectedStatus !== 'all' || sortBy !== 'created';

  if (isMobile) {
    return (
      <div className="bg-card border border-border rounded-lg">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-muted-foreground" />
            <span className="font-medium text-foreground">Filters</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
          </Button>
        </div>
        {/* Expandable Filters */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-border">
            <Input
              type="search"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
            />
            
            <div className="grid grid-cols-1 gap-3">
              <select
                value={selectedType}
                onChange={(e) => onTypeChange(e?.target?.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
              >
                {goalTypes?.map(type => (
                  <option key={type?.value} value={type?.value}>
                    {type?.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e?.target?.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
              >
                {statusOptions?.map(status => (
                  <option key={status?.value} value={status?.value}>
                    {status?.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => onSortChange(e?.target?.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
              >
                {sortOptions?.map(sort => (
                  <option key={sort?.value} value={sort?.value}>
                    Sort by {sort?.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                fullWidth
                iconName="X"
                iconPosition="left"
                onClick={onClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filter & Sort</h3>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-1">
          <Input
            type="search"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
          />
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e?.target?.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            {goalTypes?.map(type => (
              <option key={type?.value} value={type?.value}>
                {type?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e?.target?.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            {statusOptions?.map(status => (
              <option key={status?.value} value={status?.value}>
                {status?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e?.target?.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            {sortOptions?.map(sort => (
              <option key={sort?.value} value={sort?.value}>
                {sort?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;