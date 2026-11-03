import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import IQQuiz from './pages/IQQuiz';
import EQQuiz from './pages/EQQuiz';
import Results from './pages/Results';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['home', 'iq', 'eq', 'results', 'admin'].includes(hash) ? hash : 'home';
  });

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [iqData, setIqData] = useState(() => {
    const saved = sessionStorage.getItem('smartiq_iq_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [resultsData, setResultsData] = useState(() => {
    const saved = sessionStorage.getItem('smartiq_results_data');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync route with window hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'iq', 'eq', 'results', 'admin'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabSwitch = () => {
    if (currentRoute === 'iq' || currentRoute === 'eq') {
      setTabSwitchCount((prev) => prev + 1);
    }
  };

  const handleIQComplete = (data) => {
    setIqData(data);
    sessionStorage.setItem('smartiq_iq_data', JSON.stringify(data));
    navigateTo('eq');
  };

  const handleEQComplete = (combinedData) => {
    setResultsData(combinedData);
    sessionStorage.setItem('smartiq_results_data', JSON.stringify(combinedData));
    navigateTo('results');
  };

  const handleRetake = (quizType = 'iq') => {
    setTabSwitchCount(0);
    if (quizType === 'iq') {
      setIqData(null);
      sessionStorage.removeItem('smartiq_iq_data');
    }
    navigateTo(quizType);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar with Supabase Auth controls */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        tabSwitchCount={tabSwitchCount}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal for Sign In / Sign Up */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <Home onStartQuiz={navigateTo} />
        )}

        {currentRoute === 'iq' && (
          <IQQuiz
            onComplete={handleIQComplete}
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {currentRoute === 'eq' && (
          <EQQuiz
            iqData={iqData}
            onComplete={handleEQComplete}
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {currentRoute === 'results' && (
          <Results
            resultsData={resultsData}
            onRetake={handleRetake}
          />
        )}

        {currentRoute === 'admin' && (
          <Admin onOpenAuth={() => setAuthModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SmartIQ Platform • Supabase Cloud & Dual Psychometrics Engine</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              LLM Inference: Groq AI Ready
            </span>
            <span>•</span>
            <button 
              onClick={() => navigateTo('admin')}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Admin Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
