import { supabase } from '../lib/supabase';

export const checkInService = {
  // Create a daily check-in
  async createCheckIn(checkInData) {
    try {
      const { data, error } = await supabase?.from('daily_check_ins')?.insert([{
          ...checkInData,
          date: checkInData?.date || new Date()?.toISOString()?.split('T')?.[0]
        }])?.select()?.single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get check-in for specific date
  async getCheckInByDate(date) {
    try {
      const { data, error } = await supabase?.from('daily_check_ins')?.select('*')?.eq('date', date)?.single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get today's check-in
  async getTodayCheckIn() {
    const today = new Date()?.toISOString()?.split('T')?.[0]
    return this.getCheckInByDate(today)
  },

  // Get all user check-ins with optional filters
  async getUserCheckIns(filters = {}) {
    try {
      let query = supabase?.from('daily_check_ins')?.select('*')

      // Apply date range filter
      if (filters?.startDate) {
        query = query?.gte('date', filters?.startDate)
      }
      
      if (filters?.endDate) {
        query = query?.lte('date', filters?.endDate)
      }

      // Apply mood filter
      if (filters?.mood) {
        query = query?.eq('mood', filters?.mood)
      }

      // Apply workout filter
      if (filters?.workoutCompleted !== undefined) {
        query = query?.eq('workout_completed', filters?.workoutCompleted)
      }

      const { data, error } = await query?.order('date', { ascending: false })

      if (error) {
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      return { data: [], error }
    }
  },

  // Update check-in
  async updateCheckIn(checkInId, updates) {
    try {
      const { data, error } = await supabase?.from('daily_check_ins')?.update(updates)?.eq('id', checkInId)?.select()?.single()

      if (error) {
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete check-in
  async deleteCheckIn(checkInId) {
    try {
      const { error } = await supabase?.from('daily_check_ins')?.delete()?.eq('id', checkInId)

      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Get check-in streak
  async getCheckInStreak() {
    try {
      const { data, error } = await supabase?.from('daily_check_ins')?.select('date')?.order('date', { ascending: false })?.limit(100)

      if (error) {
        return { streak: 0, error }
      }

      if (!data?.length) {
        return { streak: 0, error: null }
      }

      // Calculate streak
      let streak = 0
      const today = new Date()
      const dates = data?.map(item => new Date(item?.date))?.sort((a, b) => b - a)

      // Check if today or yesterday has a check-in (to allow for timezone differences)
      const todayStr = today?.toISOString()?.split('T')?.[0]
      const yesterdayStr = new Date(today.getTime() - 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0]
      
      const hasRecentCheckIn = dates?.some(date => {
        const dateStr = date?.toISOString()?.split('T')?.[0]
        return dateStr === todayStr || dateStr === yesterdayStr
      })

      if (!hasRecentCheckIn) {
        return { streak: 0, error: null }
      }

      // Count consecutive days
      let currentDate = new Date(dates[0])
      for (let i = 0; i < dates?.length; i++) {
        const checkDate = dates?.[i]
        const expectedDateStr = currentDate?.toISOString()?.split('T')?.[0]
        const checkDateStr = checkDate?.toISOString()?.split('T')?.[0]
        
        if (expectedDateStr === checkDateStr) {
          streak++
          currentDate?.setDate(currentDate?.getDate() - 1)
        } else {
          break
        }
      }

      return { streak, error: null }
    } catch (error) {
      return { streak: 0, error }
    }
  },

  // Get check-in statistics
  async getCheckInStats(days = 30) {
    try {
      const startDate = new Date()
      startDate?.setDate(startDate?.getDate() - days)
      const startDateStr = startDate?.toISOString()?.split('T')?.[0]

      const { data, error } = await supabase?.from('daily_check_ins')?.select('mood, energy_level, workout_completed')?.gte('date', startDateStr)

      if (error) {
        return { stats: null, error }
      }

      const stats = {
        totalCheckIns: data?.length || 0,
        workoutsCompleted: data?.filter(item => item?.workout_completed)?.length || 0,
        averageEnergyLevel: data?.length ? (data?.reduce((sum, item) => sum + (item?.energy_level || 0), 0) / data?.length)?.toFixed(1) : 0,
        moodDistribution: {
          excellent: data?.filter(item => item?.mood === 'excellent')?.length || 0,
          good: data?.filter(item => item?.mood === 'good')?.length || 0,
          neutral: data?.filter(item => item?.mood === 'neutral')?.length || 0,
          tired: data?.filter(item => item?.mood === 'tired')?.length || 0,
          struggling: data?.filter(item => item?.mood === 'struggling')?.length || 0
        }
      }

      return { stats, error: null }
    } catch (error) {
      return { stats: null, error }
    }
  }
}