import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user)
          fetchUserProfile(session.user.id)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to get session: ' + err?.message)
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
          fetchUserProfile(session.user.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId) => {
    if (!userId) return
    
    supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to fetch profile: ' + error?.message)
          return
        }
        setUserProfile(data)
      })
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMsg = 'Sign in failed: ' + err?.message
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (err) {
      const errorMsg = 'Sign up failed: ' + err?.message
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      setUser(null)
      setUserProfile(null)
      return { success: true }
    } catch (err) {
      const errorMsg = 'Sign out failed: ' + err?.message
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single()
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      setUserProfile(data)
      return { success: true, data }
    } catch (err) {
      const errorMsg = 'Profile update failed: ' + err?.message
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      })
      
      if (error) {
        setError(error.message)
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (err) {
      const errorMsg = 'Password reset failed: ' + err?.message
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}