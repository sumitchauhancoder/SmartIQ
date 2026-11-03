import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const AuthContext = createContext({
  user: null,
  session: null,
  role: 'user',
  isAdmin: false,
  token: null,
  loading: true,
  isConfigured: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId, userEmail = '') => {
    if (userEmail && userEmail.toLowerCase() === 'sumitchauhancoder@gmail.com') {
      setRole('admin');
      return;
    }

    if (!supabase || (!userId && !userEmail)) {
      setRole('user');
      return;
    }

    try {
      if (userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data && data.role) {
          setRole(data.role.toLowerCase());
          return;
        }
      }

      if (userEmail) {
        const { data: emailData, error: emailErr } = await supabase
          .from('profiles')
          .select('role')
          .ilike('email', userEmail)
          .maybeSingle();

        if (!emailErr && emailData && emailData.role) {
          setRole(emailData.role.toLowerCase());
          return;
        }
      }

      setRole('user');
    } catch (err) {
      console.warn('[SmartIQ Auth] Failed to fetch profile role:', err);
      if (userEmail && userEmail.toLowerCase() === 'sumitchauhancoder@gmail.com') {
        setRole('admin');
      } else {
        setRole('user');
      }
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setUser(initSession?.user ?? null);
      if (initSession?.user) {
        fetchUserRole(initSession.user.id, initSession.user.email);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchUserRole(newSession.user.id, newSession.user.email);
        } else {
          setRole('user');
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole('user');
  };

  const refreshProfile = async () => {
    if (user?.id || user?.email) {
      await fetchUserRole(user?.id, user?.email);
    }
  };

  const value = {
    user,
    session,
    role,
    isAdmin: role === 'admin',
    token: session?.access_token || null,
    loading,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
