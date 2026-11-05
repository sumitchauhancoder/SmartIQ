import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PublicLanding from './pages/PublicLanding';
import Home from './pages/Home';
import IQQuiz from './pages/IQQuiz';
import EQQuiz from './pages/EQQuiz';
import SQQuiz from './pages/SQQuiz';
import AQQuiz from './pages/AQQuiz';
import Results from './pages/Results';
import CognitiveGym from './pages/CognitiveGym';
import Admin from './pages/Admin';
import IntelligenceChatbot from './components/IntelligenceChatbot';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, role, isAdmin, loading: authLoading } = useAuth();

  // Normalize initial hash route
  const getInitialRoute = () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (['home', 'iq', 'eq', 'sq', 'aq', 'results', 'gym', 'admin'].includes(rawHash)) {
      return rawHash;
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [resultsTab, setResultsTab] = useState('ALL');
  const [gymPillar, setGymPillar] = useState('IQ');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialSignUp, setAuthInitialSignUp] = useState(false);

  // 4 Independent Intelligence States
  const [iqData, setIqData] = useState(() => {
    try {
      const saved = localStorage.getItem('enigma_iq_data') || localStorage.getItem('smartiq_iq_data') || sessionStorage.getItem('enigma_iq_data') || sessionStorage.getItem('smartiq_iq_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [eqData, setEqData] = useState(() => {
    try {
      const saved = localStorage.getItem('enigma_eq_data') || localStorage.getItem('smartiq_eq_data') || sessionStorage.getItem('enigma_eq_data') || sessionStorage.getItem('smartiq_eq_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [sqData, setSqData] = useState(() => {
    try {
      const saved = localStorage.getItem('enigma_sq_data') || localStorage.getItem('smartiq_sq_data') || sessionStorage.getItem('enigma_sq_data') || sessionStorage.getItem('smartiq_sq_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [aqData, setAqData] = useState(() => {
    try {
      const saved = localStorage.getItem('enigma_aq_data') || localStorage.getItem('smartiq_aq_data') || sessionStorage.getItem('enigma_aq_data') || sessionStorage.getItem('smartiq_aq_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [resultsData, setResultsData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('enigma_results_data') || sessionStorage.getItem('smartiq_results_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const navigateTo = (route, subParam = null) => {
    if (route === 'results' && subParam) {
      setResultsTab(subParam);
    }
    if (route === 'gym' && subParam) {
      setGymPillar(subParam);
    }
    const targetRoute = route === '/' ? '' : route;
    setCurrentRoute(route);
    window.location.hash = targetRoute;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (isSignUp = false) => {
    setAuthInitialSignUp(isSignUp);
    setAuthModalOpen(true);
  };

  // Sync route with window hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      if (['home', 'iq', 'eq', 'sq', 'aq', 'results', 'gym', 'admin'].includes(rawHash)) {
        setCurrentRoute(rawHash);
      } else {
        setCurrentRoute('/');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Strict Role-Based Route Guarding & Redirection
  useEffect(() => {
    if (authLoading) return;

    const protectedRoutes = ['home', 'iq', 'eq', 'sq', 'aq', 'results', 'gym'];

    if (!user) {
      if (protectedRoutes.includes(currentRoute) || currentRoute === 'admin') {
        navigateTo('/');
        setAuthModalOpen(true);
      }
    } else {
      if (currentRoute === '/' || currentRoute === '') {
        if (isAdmin) {
          navigateTo('admin');
        } else {
          navigateTo('home');
        }
      } else if (currentRoute === 'admin' && !isAdmin) {
        navigateTo('home');
      }
    }
  }, [user, isAdmin, currentRoute, authLoading]);

  // Post-Login Role-Based Redirection Callback
  const handleAuthSuccess = (resolvedRole) => {
    if (resolvedRole === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('home');
    }
  };

  const handleTabSwitch = () => {
    if (['iq', 'eq', 'sq', 'aq'].includes(currentRoute)) {
      setTabSwitchCount((prev) => prev + 1);
    }
  };

  const handleIQComplete = (data) => {
    setIqData(data);
  };

  const handleEQComplete = (data) => {
    setEqData(data);
  };

  const handleSQComplete = (data) => {
    setSqData(data);
  };

  const handleAQComplete = (data) => {
    setAqData(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Strict RBAC Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        tabSwitchCount={tabSwitchCount}
        onOpenAuth={handleOpenAuth}
      />

      {/* Auth Modal for Sign In / Sign Up */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialSignUp={authInitialSignUp}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Public Route (Unauthenticated Welcome Dashboard) */}
        {(currentRoute === '/' || currentRoute === '') && (
          <PublicLanding
            onGetStarted={() => handleOpenAuth(true)}
            onSignIn={() => handleOpenAuth(false)}
          />
        )}

        {/* User Protected Routes */}
        {user && currentRoute === 'home' && (
          <Home onStartQuiz={navigateTo} />
        )}

        {user && currentRoute === 'iq' && (
          <IQQuiz
            onComplete={handleIQComplete}
            onNavigate={navigateTo}
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {user && currentRoute === 'eq' && (
          <EQQuiz
            onComplete={handleEQComplete}
            onNavigate={navigateTo}
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {user && currentRoute === 'sq' && (
          <SQQuiz
            onComplete={handleSQComplete}
            onNavigate={navigateTo}
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {user && currentRoute === 'aq' && (
          <AQQuiz
            onComplete={handleAQComplete}
            onNavigate={navigateTo}
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {user && currentRoute === 'results' && (
          <Results
            resultsData={resultsData}
            iqData={iqData}
            eqData={eqData}
            sqData={sqData}
            aqData={aqData}
            onNavigate={navigateTo}
            initialTab={resultsTab}
          />
        )}

        {user && currentRoute === 'gym' && (
          <CognitiveGym
            onNavigate={navigateTo}
            initialPillar={gymPillar}
          />
        )}

        {/* Admin Protected Route */}
        {user && isAdmin && currentRoute === 'admin' && (
          <Admin
            onOpenAuth={() => handleOpenAuth(false)}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Enigma Platform • 4D Multidimensional Intelligence Matrix (IQ • EQ • SQ • AQ)</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              LLM Inference: Groq AI Ready
            </span>
            {user && isAdmin && (
              <>
                <span>•</span>
                <button 
                  onClick={() => navigateTo('admin')}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Admin Console
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Side Intelligence Chatbot (Powered by Groq) */}
      <IntelligenceChatbot />
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