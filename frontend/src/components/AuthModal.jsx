import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, AlertCircle, CheckCircle2, User, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function AuthModal({ isOpen, onClose, initialSignUp = false, onAuthSuccess }) {
  const { signIn, signUp, resetPassword, updatePassword, isConfigured, isPasswordRecovery, setIsPasswordRecovery } = useAuth();
  
  // Modes: 'signin' | 'signup' | 'forgot' | 'update_password'
  const [mode, setMode] = useState(initialSignUp ? 'signup' : 'signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isPasswordRecovery || window.location.hash.includes('reset-password') || window.location.hash.includes('type=recovery')) {
      setMode('update_password');
    } else {
      setMode(initialSignUp ? 'signup' : 'signin');
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialSignUp, isOpen, isPasswordRecovery]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Handle Forgot Password mode
    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      setLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMsg('Password reset link sent! Please check your email inbox.');
      } catch (err) {
        setErrorMsg(err.message || 'Failed to send password reset email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Handle Update Password mode (from recovery email)
    if (mode === 'update_password') {
      if (!password || password.length < 6) {
        setErrorMsg('New password must be at least 6 characters.');
        return;
      }
      setLoading(true);
      try {
        await updatePassword(password);
        setSuccessMsg('Password updated successfully! Redirecting...');
        if (setIsPasswordRecovery) setIsPasswordRecovery(false);
        setTimeout(() => {
          onClose();
          window.location.hash = 'home';
        }, 1000);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to update password. Recovery link may have expired.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Handle Sign In or Sign Up
    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      let authData = null;
      if (mode === 'signup') {
        authData = await signUp(email.trim(), password, fullName.trim());
        setSuccessMsg('Account created successfully! Welcome to Enigma.');
      } else {
        authData = await signIn(email.trim(), password);
        setSuccessMsg('Signed in successfully! Redirecting...');
      }

      // Fetch user role for post-login redirection
      let userRole = 'user';
      const userId = authData?.user?.id;
      if (userId && supabase) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();
          if (data && data.role) {
            userRole = data.role.toLowerCase();
          }
        } catch (e) {
          console.warn('[SmartIQ AuthModal] Role fetch error:', e);
        }
      }

      setTimeout(() => {
        onClose();
        if (onAuthSuccess) {
          onAuthSuccess(userRole);
        }
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mx-auto mb-4">
          {mode === 'forgot' || mode === 'update_password' ? (
            <KeyRound className="w-6 h-6" />
          ) : (
            <Lock className="w-6 h-6" />
          )}
        </div>

        <h3 className="text-2xl font-extrabold text-center text-white mb-1.5">
          {mode === 'signup'
            ? 'Create Enigma Profile'
            : mode === 'forgot'
            ? 'Reset Your Password'
            : mode === 'update_password'
            ? 'Set New Password'
            : 'Sign in to Enigma'}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-6">
          {mode === 'signup'
            ? 'Register with your name to save your 4D test results and personal growth history.'
            : mode === 'forgot'
            ? 'Enter your registered email and we will send you a secure link to reset your password.'
            : mode === 'update_password'
            ? 'Enter your new password below to regain full access to your account.'
            : 'Access authenticated 4D assessments and administrative control console.'}
        </p>

        {!isConfigured && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-950/50 border border-amber-600/40 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Supabase environment keys are not configured yet. Set <code className="font-mono text-amber-200">VITE_SUPABASE_URL</code> in environment to activate cloud auth.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sumit Chauhan"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          {/* Email Address (Not shown in update_password mode) */}
          {mode !== 'update_password' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          {/* Password Field (Shown in signin, signup, update_password; hidden in forgot) */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {mode === 'update_password' ? 'New Password' : 'Password'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'update_password' ? 'Enter at least 6 characters' : '••••••••'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? (
              'Processing...'
            ) : mode === 'signup' ? (
              'Create Profile & Start'
            ) : mode === 'forgot' ? (
              'Send Password Reset Link'
            ) : mode === 'update_password' ? (
              'Save New Password'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'forgot' ? (
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          ) : mode === 'signup' ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : mode === 'signin' ? (
            <span>
              New to Enigma?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Create Account
              </button>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
