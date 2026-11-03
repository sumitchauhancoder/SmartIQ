import React, { useState } from 'react';
import { Brain, Sparkles, Shield, BarChart3, Menu, X, Award } from 'lucide-react';

export default function Navbar({ currentRoute, onRouteChange, tabSwitchCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Brain },
    { id: 'iq', label: 'IQ Assessment', icon: Sparkles },
    { id: 'eq', label: 'EQ Assessment', icon: Award },
    { id: 'results', label: 'Results & Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Console', icon: Shield },
  ];

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
            onClick={() => handleNav('home')} 
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
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Anti-Cheat Shield Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
              tabSwitchCount > 1 
                ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 animate-pulse'
                : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
            }`}>
              <Shield className="w-3.5 h-3.5" />
              <span>Anti-Cheat: {tabSwitchCount > 0 ? `${tabSwitchCount} Warning${tabSwitchCount > 1 ? 's' : ''}` : 'Active'}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
