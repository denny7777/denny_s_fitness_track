import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // Enhanced profile operations with better error handling
  const profileOperations = useMemo(() => ({
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      try {
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
        if (!error && data) {
          setUserProfile(data)
        } else if (error?.code === 'PGRST116') {
          // Profile doesn't exist - this is expected for new users
          console.log('User profile not found, will be created during signup process')
          setUserProfile(null)
        } else {
          console.error('Error loading user profile:', error)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Profile loading error:', error)
        setUserProfile(null)
      } finally {
        setProfileLoading(false)
      }
    },
    
    async create(userId, profileData) {
      if (!userId) return { error: { message: 'User ID is required' } }
      
      try {
        const { data, error } = await supabase?.from('user_profiles')?.insert({
          id: userId,
          email: profileData?.email,
          full_name: profileData?.full_name
        })?.select()?.single()
        
        if (!error && data) {
          setUserProfile(data)
          return { data, error: null }
        }
        
        return { data: null, error }
      } catch (error) {
        console.error('Profile creation error:', error)
        return { data: null, error: { message: 'Failed to create user profile' } }
      }
    },
    
    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    }
  }), [])

  // Enhanced auth state handler with profile creation
  const handleAuthStateChange = useCallback(async (event, session) => {
    console.log('Auth state change:', event, session?.user?.id)
    
    setUser(session?.user ?? null)
    setLoading(false)
    
    if (session?.user) {
      // Load existing profile or create new one
      try {
        const { data: existingProfile, error } = await supabase
          ?.from('user_profiles')
          ?.select('*')
          ?.eq('id', session?.user?.id)
          ?.single()
        
        if (existingProfile) {
          setUserProfile(existingProfile)
        } else if (error?.code === 'PGRST116') {
          // Profile doesn't exist, create it
          console.log('Creating new user profile...')
          const { data: newProfile, error: createError } = await supabase
            ?.from('user_profiles')
            ?.insert({
              id: session?.user?.id,
              email: session?.user?.email,
              full_name: session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')?.[0] || 'User'
            })
            ?.select()
            ?.single()
          
          if (newProfile && !createError) {
            console.log('User profile created successfully')
            setUserProfile(newProfile)
          } else {
            console.error('Failed to create user profile:', createError)
            setUserProfile(null)
          }
        } else {
          console.error('Error checking user profile:', error)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setUserProfile(null)
      }
    } else {
      profileOperations?.clear()
    }
  }, [profileOperations])

  // Enhanced signup method with profile creation
  const signUp = useCallback(async (email, password, options = {}) => {
    try {
      console.log('Starting signup process...')
      
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options?.metadata?.full_name || email?.split('@')?.[0] || 'User'
          }
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        return { data: null, error }
      }
      
      if (data?.user) {
        console.log('Signup successful, user created:', data?.user?.id)
        
        // If user is immediately confirmed (e.g., in development), create profile
        if (data?.user?.email_confirmed_at || !data?.user?.confirmation_sent_at) {
          console.log('User confirmed, creating profile...')
          await profileOperations?.create(data?.user?.id, {
            email: data?.user?.email,
            full_name: options?.metadata?.full_name || email?.split('@')?.[0] || 'User'
          })
        }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Signup process error:', error)
      return { data: null, error: { message: 'Signup failed. Please try again.' } }
    }
  }, [profileOperations])

  // Enhanced signin method with better error handling
  const signIn = useCallback(async (email, password) => {
    try {
      console.log('Starting signin process...')
      
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Signin error:', error)
        // Provide more user-friendly error messages
        if (error?.message?.includes('Invalid login credentials')) {
          return { data: null, error: { message: 'Invalid email or password. Please try again.' } }
        }
        return { data: null, error }
      }
      
      console.log('Signin successful:', data?.user?.id)
      return { data, error: null }
    } catch (error) {
      console.error('Signin process error:', error)
      return { data: null, error: { message: 'Signin failed. Please try again.' } }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email)
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }, [])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }
    
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      if (!error) setUserProfile(data)
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }, [user])

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  }), [user, userProfile, loading, profileLoading, signIn, signUp, signOut, resetPassword, updateProfile])

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase?.auth?.getSession()
        if (error) {
          console.error('Session initialization error:', error)
        }
        await handleAuthStateChange(null, session)
      } catch (error) {
        console.error('Auth initialization error:', error)
        setLoading(false)
      }
    }

    initializeAuth()

    // Set up auth listener
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(handleAuthStateChange)

    return () => subscription?.unsubscribe()
  }, [handleAuthStateChange])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}