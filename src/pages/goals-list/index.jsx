import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import GoalCard from './components/GoalCard';
import FilterControls from './components/FilterControls';
import BulkActions from './components/BulkActions';
import EmptyState from './components/EmptyState';
import GoalStats from './components/GoalStats';
import { useAuth } from '../../contexts/AuthContext';
import { goalService } from '../../services/goalService';

const GoalsList = () => {
  const { user, loading } = useAuth();
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load goals
  useEffect(() => {
    const loadGoals = async () => {
      if (!user) return;
      
      setDataLoading(true);
      setError(null);
      
      try {
        const { data, error: goalError } = await goalService?.getUserGoals();
        if (goalError) {
          setError(goalError?.message || 'Failed to load goals');
        } else {
          setGoals(data || []);
        }
      } catch (error) {
        console.error('Error loading goals:', error);
        setError('Something went wrong while loading your goals');
      } finally {
        setDataLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...goals];

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(goal => goal?.status === filters?.status);
    }

    // Apply type filter
    if (filters?.type !== 'all') {
      filtered = filtered?.filter(goal => goal?.goal_type === filters?.type);
    }

    // Apply search filter
    if (filters?.search?.trim()) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(goal =>
        goal?.title?.toLowerCase()?.includes(searchTerm) ||
        goal?.description?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      const aValue = a?.[filters?.sortBy];
      const bValue = b?.[filters?.sortBy];
      
      if (filters?.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredGoals(filtered);
  }, [goals, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle goal selection
  const handleGoalSelect = (goalId, isSelected) => {
    if (isSelected) {
      setSelectedGoals(prev => [...prev, goalId]);
    } else {
      setSelectedGoals(prev => prev?.filter(id => id !== goalId));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedGoals?.length === filteredGoals?.length) {
      setSelectedGoals([]);
    } else {
      setSelectedGoals(filteredGoals?.map(goal => goal?.id));
    }
  };

  // Handle goal actions
  const handleGoalUpdate = async (goalId) => {
    // For now, navigate to a simple update page
    window.location.href = `/edit-goal?id=${goalId}`;
  };

  const handleGoalEdit = (goalId) => {
    window.location.href = `/edit-goal?id=${goalId}`;
  };

  const handleGoalDelete = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await goalService?.deleteGoal(goalId);
      if (error) {
        alert('Failed to delete goal: ' + error?.message);
      } else {
        // Remove from local state
        setGoals(prev => prev?.filter(goal => goal?.id !== goalId));
        setSelectedGoals(prev => prev?.filter(id => id !== goalId));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong while deleting the goal');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedGoals?.length === 0) return;

    switch (action) {
      case 'delete':
        if (!confirm(`Are you sure you want to delete ${selectedGoals?.length} goal(s)?`)) return;
        
        try {
          for (const goalId of selectedGoals) {
            await goalService?.deleteGoal(goalId);
          }
          // Refresh goals
          setGoals(prev => prev?.filter(goal => !selectedGoals?.includes(goal?.id)));
          setSelectedGoals([]);
        } catch (error) {
          console.error('Bulk delete error:', error);
          alert('Some goals could not be deleted');
        }
        break;
        
      case 'archive':
        try {
          for (const goalId of selectedGoals) {
            await goalService?.updateGoal(goalId, { status: 'archived' });
          }
          // Refresh goals
          const { data } = await goalService?.getUserGoals();
          setGoals(data || []);
          setSelectedGoals([]);
        } catch (error) {
          console.error('Bulk archive error:', error);
          alert('Some goals could not be archived');
        }
        break;
        
      default:
        break;
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your goals...</p>
            </div>
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
            <p className="text-muted-foreground mb-6">Please sign in to view your goals</p>
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => window.location?.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Goals</h1>
            <p className="text-muted-foreground">
              Track and manage your fitness goals
            </p>
          </div>
          <a
            href="/add-goal"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Goal</span>
          </a>
        </div>

        {/* Stats */}
        {goals?.length > 0 && (
          <div className="mb-8">
            <GoalStats goals={goals} />
          </div>
        )}

        {/* Filters and Bulk Actions */}
        {goals?.length > 0 && (
          <div className="mb-6 space-y-4">
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              totalGoals={goals?.length}
              filteredGoals={filteredGoals?.length}
              searchTerm={filters?.search}
              onSearchChange={(value) => handleFilterChange('search', value)}
              selectedType={filters?.type}
              onTypeChange={(value) => handleFilterChange('type', value)}
              selectedStatus={filters?.status}
              onStatusChange={(value) => handleFilterChange('status', value)}
              sortBy={filters?.sortBy}
              onSortChange={(value) => handleFilterChange('sortBy', value)}
              onClearFilters={() => setFilters({
                status: 'all',
                type: 'all',
                search: '',
                sortBy: 'created_at',
                sortOrder: 'desc'
              })}
            />
            
            {selectedGoals?.length > 0 && (
              <BulkActions
                selectedCount={selectedGoals?.length}
                onAction={handleBulkAction}
                onSelectAll={handleSelectAll}
                isAllSelected={selectedGoals?.length === filteredGoals?.length}
                onBulkDelete={() => handleBulkAction('delete')}
                onBulkUpdate={() => handleBulkAction('archive')}
                onClearSelection={() => setSelectedGoals([])}
                totalGoals={goals?.length}
              />
            )}
          </div>
        )}

        {/* Goals List */}
        {filteredGoals?.length > 0 ? (
          <div className="space-y-4">
            {filteredGoals?.map(goal => (
              <GoalCard
                key={goal?.id}
                goal={goal}
                isSelected={selectedGoals?.includes(goal?.id)}
                onSelect={(isSelected) => handleGoalSelect(goal?.id, isSelected)}
                onUpdate={() => handleGoalUpdate(goal?.id)}
                onEdit={() => handleGoalEdit(goal?.id)}
                onDelete={() => handleGoalDelete(goal?.id)}
                onUpdateProgress={(goalId, progress) => {
                  // Handle progress update
                  goalService?.updateGoal(goalId, { progress });
                  setGoals(prev => prev?.map(g => 
                    g?.id === goalId ? { ...g, progress } : g
                  ));
                }}
              />
            ))}
          </div>
        ) : goals?.length === 0 ? (
          <EmptyState 
            hasFilters={false}
            onClearFilters={() => setFilters({
              status: 'all',
              type: 'all',
              search: '',
              sortBy: 'created_at',
              sortOrder: 'desc'
            })}
            onAddGoal={() => window.location.href = '/add-goal'}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-foreground mb-2">No goals match your filters</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsList;