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
  Zap, 
  Dumbbell 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentRoute, onRouteChange, onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, isAdmin, signOut } = useAuth();

  // Navigation Items according to strict RBAC rules:
  // When logged out: only link to landing dashboard
  // When logged in as user: Hub, IQ, EQ, SQ, AQ, Gym, 4D Matrix
  // When logged in as admin: Hub, IQ, EQ, SQ, AQ, Gym, 4D Matrix, Admin Console
  let navItems = [];

  if (!user) {
    // Logged Out
    navItems = [
      { id: '/', label: 'Overview', shortLabel: 'Overview', icon: Sparkles }
    ];
  } else if (!isAdmin) {
    // Regular User
    navItems = [
      { id: 'home', label: 'Hub', shortLabel: 'Hub', icon: Brain },
      { id: 'iq', label: 'IQ Test', shortLabel: 'IQ', icon: Sparkles, color: 'text-blue-400' },
      { id: 'eq', label: 'EQ Test', shortLabel: 'EQ', icon: Award, color: 'text-rose-400' },
      { id: 'sq', label: 'SQ Test', shortLabel: 'SQ', icon: Compass, color: 'text-amber-400' },
      { id: 'aq', label: 'AQ Test', shortLabel: 'AQ', icon: Zap, color: 'text-emerald-400' },
      { id: 'gym', label: 'Gym', shortLabel: 'Gym', icon: Dumbbell, color: 'text-purple-400' },
      { id: 'results', label: '4D Matrix', shortLabel: 'Matrix', icon: BarChart3 }
    ];
  } else {
    // Administrator
    navItems = [
      { id: 'home', label: 'Hub', shortLabel: 'Hub', icon: Brain },
      { id: 'iq', label: 'IQ Test', shortLabel: 'IQ', icon: Sparkles, color: 'text-blue-400' },
      { id: 'eq', label: 'EQ Test', shortLabel: 'EQ', icon: Award, color: 'text-rose-400' },
      { id: 'sq', label: 'SQ Test', shortLabel: 'SQ', icon: Compass, color: 'text-amber-400' },
      { id: 'aq', label: 'AQ Test', shortLabel: 'AQ', icon: Zap, color: 'text-emerald-400' },
      { id: 'gym', label: 'Gym', shortLabel: 'Gym', icon: Dumbbell, color: 'text-purple-400' },
      { id: 'results', label: '4D Matrix', shortLabel: 'Matrix', icon: BarChart3 },
      { id: 'admin', label: 'Admin', shortLabel: 'Admin', icon: Shield, badge: 'Admin' }
    ];
  }

  const handleNav = (routeId) => {
    onRouteChange(routeId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl h-16 w-full flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Brand Logo - Fixed Width Anchor to prevent layout shift */}
        <div 
          onClick={() => handleNav(user ? 'home' : '/')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[2px] transition-transform duration-200 group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400 group-hover:text-emerald-300 transition-colors" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
              Enigma
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
              4D Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Navigation - Rock-solid stable buttons with fixed height & permanent borders */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id || (item.id === '/' && (currentRoute === '' || currentRoute === '/'));
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium border transition-colors duration-150 select-none flex-shrink-0 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.shortLabel || item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 ml-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Action Cluster - Stable width anchor */}
        <div className="hidden lg:flex items-center justify-end flex-shrink-0 min-w-[140px]">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 transition-colors select-none"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                <span className="max-w-[110px] truncate font-medium">{user.email?.split('@')[0]}</span>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                  isAdmin ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-700/80 p-2 shadow-2xl z-50 animate-fadeIn bg-slate-950/95"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Signed In As</p>
                    <p className="text-xs font-bold text-white truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                      Role: {role}
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => { handleNav('admin'); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-xl mt-1 text-left transition-colors"
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

        {/* Mobile menu trigger (< lg screens) */}
        <div className="lg:hidden flex items-center gap-2">
          {!user ? (
            <button
              onClick={() => onOpenAuth(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
            >
              Sign In
            </button>
          ) : (
            <span className="text-xs font-semibold text-slate-300 max-w-[100px] truncate">
              {user.email?.split('@')[0]}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown (< lg screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-1.5 shadow-2xl animate-fadeIn">
          {user && (
            <div className="p-3 mb-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Account ({role})</p>
                <p className="text-xs font-bold text-white truncate max-w-[190px]">{user.email}</p>
              </div>
              <button
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/50 text-rose-300 border border-rose-800/50 hover:bg-rose-900/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600/25 text-indigo-200 border-indigo-500/50 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-300 hover:bg-slate-800/60 border-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
