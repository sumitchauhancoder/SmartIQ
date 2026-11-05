import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Shield, 
  BarChart3, 
  Menu, 
  X, 
  Award, 
  User, 
  LogOut, 
  LogIn,
  Compass,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentRoute, onRouteChange, tabSwitchCount = 0, onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, isAdmin, signOut } = useAuth();

  // Navigation Items according to strict RBAC rules:
  // When logged out: only link to landing dashboard
  // When logged in as user: Hub, IQ, EQ, SQ, AQ, 4D Matrix
  // When logged in as admin: Hub, IQ, EQ, SQ, AQ, 4D Matrix, Admin Console
  let navItems = [];

  if (!user) {
    // Logged Out
    navItems = [
      { id: '/', label: 'Overview', icon: Sparkles }
    ];
  } else if (!isAdmin) {
    // Regular User
    navItems = [
      { id: 'home', label: 'Hub', icon: Brain },
      { id: 'iq', label: 'IQ Test', icon: Sparkles, color: 'text-blue-400' },
      { id: 'eq', label: 'EQ Test', icon: Award, color: 'text-rose-400' },
      { id: 'sq', label: 'SQ Test', icon: Compass, color: 'text-amber-400' },
      { id: 'aq', label: 'AQ Test', icon: Zap, color: 'text-emerald-400' },
      { id: 'results', label: '4D Matrix', icon: BarChart3 }
    ];
  } else {
    // Administrator
    navItems = [
      { id: 'home', label: 'Hub', icon: Brain },
      { id: 'iq', label: 'IQ Test', icon: Sparkles, color: 'text-blue-400' },
      { id: 'eq', label: 'EQ Test', icon: Award, color: 'text-rose-400' },
      { id: 'sq', label: 'SQ Test', icon: Compass, color: 'text-amber-400' },
      { id: 'aq', label: 'AQ Test', icon: Zap, color: 'text-emerald-400' },
      { id: 'results', label: '4D Matrix', icon: BarChart3 },
      { id: 'admin', label: 'Admin', icon: Shield, badge: 'Admin' }
    ];
  }

  const handleNav = (routeId) => {
    onRouteChange(routeId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNav(user ? 'home' : '/')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[2px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400 group-hover:text-emerald-300 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Smart<span className="text-emerald-400">IQ</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                Dual Psychometrics
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id || (item.id === '/' && (currentRoute === '' || currentRoute === '/'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-3">
            {/* Anti-Cheat Shield (only active during assessment) */}
            {user && (currentRoute === 'iq' || currentRoute === 'eq' || currentRoute === 'sq' || currentRoute === 'aq') && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                tabSwitchCount > 1 
                  ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 animate-pulse'
                  : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
              }`}>
                <Shield className="w-3.5 h-3.5" />
                <span>Anti-Cheat: {tabSwitchCount > 0 ? `${tabSwitchCount} Warning${tabSwitchCount > 1 ? 's' : ''}` : 'Active'}</span>
              </div>
            )}

            {/* Authenticated State vs Logged Out State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[130px] truncate font-medium">{user.email?.split('@')[0]}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    isAdmin ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {role}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                        Role: {role}
                      </span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => { handleNav('admin'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-xl mt-1 text-left"
                      >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <button
                      onClick={() => { signOut(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl mt-1 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white transition-all shadow-md shadow-indigo-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Get Started</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {!user ? (
              <button
                onClick={() => onOpenAuth(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => signOut()}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40"
              >
                Logout
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-1">
          {user && (
            <div className="p-3 mb-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Signed in as ({role})</p>
                <p className="text-sm font-bold text-white truncate max-w-[200px]">{user.email}</p>
              </div>
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
