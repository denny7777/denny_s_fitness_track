import { supabase } from '../lib/supabase';

export const goalService = {
  // Create a new goal with enhanced error handling
  async createGoal(goalData) {
    try {
      console.log('goalService.createGoal called with:', goalData);
      
      // Validate required fields before sending to Supabase
      const requiredFields = ['user_id', 'title', 'goal_type', 'target_value', 'unit', 'target_date'];
      const missingFields = requiredFields?.filter(field => !goalData?.[field]);
      
      if (missingFields?.length > 0) {
        const error = { 
          message: `Missing required fields: ${missingFields?.join(', ')}`,
          details: 'Please fill in all required fields before submitting.'
        };
        console.error('Validation error:', error);
        return { data: null, error };
      }

      // Ensure numeric values are properly formatted
      const cleanGoalData = {
        ...goalData,
        target_value: Number(goalData?.target_value),
        current_value: Number(goalData?.current_value || 0)
      };

      console.log('Sending cleaned data to Supabase:', cleanGoalData);

      const { data, error } = await supabase?.from('fitness_goals')?.insert([cleanGoalData])?.select()?.single();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code
        });
        return { data: null, error };
      }

      if (!data) {
        const noDataError = { 
          message: 'Goal creation completed but no data returned',
          details: 'The goal may have been created successfully.'
        };
        console.warn('No data returned:', noDataError);
        return { data: null, error: noDataError };
      }

      console.log('Goal created successfully:', data);
      return { data, error: null };
      
    } catch (error) {
      console.error('Unexpected error in goalService.createGoal:', error);
      return { 
        data: null, 
        error: { 
          message: 'Network error occurred', 
          details: error?.message || 'Please check your connection and try again.'
        }
      };
    }
  },

  // Get all goals for the authenticated user
  async getUserGoals() {
    try {
      const { data, error } = await supabase?.from('fitness_goals')?.select('*')?.order('created_at', { ascending: false })

      if (error) {
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get a specific goal by ID
  async getGoal(goalId) {
    try {
      const { data, error } = await supabase?.from('fitness_goals')?.select('*')?.eq('id', goalId)?.single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Update a goal
  async updateGoal(goalId, updates) {
    try {
      const { data, error } = await supabase?.from('fitness_goals')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', goalId)?.select()?.single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete a goal
  async deleteGoal(goalId) {
    try {
      const { error } = await supabase?.from('fitness_goals')?.delete()?.eq('id', goalId)

      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Update goal progress
  async updateProgress(goalId, newValue, notes = '') {
    try {
      // First, get current value
      const { data: goal, error: goalError } = await supabase?.from('fitness_goals')?.select('current_value, user_id')?.eq('id', goalId)?.single()

      if (goalError) {
        return { data: null, error: goalError }
      }

      // Create progress update record
      const { data, error } = await supabase?.from('goal_progress_updates')?.insert([{
          goal_id: goalId,
          user_id: goal?.user_id,
          previous_value: goal?.current_value || 0,
          new_value: newValue,
          notes: notes
        }])?.select()?.single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get goal progress history
  async getGoalProgress(goalId) {
    try {
      const { data, error } = await supabase?.from('goal_progress_updates')?.select('*')?.eq('goal_id', goalId)?.order('created_at', { ascending: false })

      if (error) {
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Get goals with specific filters
  async getFilteredGoals(filters = {}) {
    try {
      let query = supabase?.from('fitness_goals')?.select('*')

      // Apply filters
      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }
      
      if (filters?.goal_type) {
        query = query?.eq('goal_type', filters?.goal_type)
      }

      if (filters?.search) {
        query = query?.or(`title.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`)
      }

      const { data, error } = await query?.order('created_at', { ascending: false })

      if (error) {
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  }
}