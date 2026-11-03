import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PublicLanding from './pages/PublicLanding';
import Home from './pages/Home';
import IQQuiz from './pages/IQQuiz';
import EQQuiz from './pages/EQQuiz';
import Results from './pages/Results';
import Admin from './pages/Admin';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, role, isAdmin, loading: authLoading } = useAuth();

  // Normalize initial hash route
  const getInitialRoute = () => {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (['home', 'iq', 'eq', 'results', 'admin'].includes(rawHash)) {
      return rawHash;
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialSignUp, setAuthInitialSignUp] = useState(false);

  const [iqData, setIqData] = useState(() => {
    const saved = sessionStorage.getItem('smartiq_iq_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [resultsData, setResultsData] = useState(() => {
    const saved = sessionStorage.getItem('smartiq_results_data');
    return saved ? JSON.parse(saved) : null;
  });

  const navigateTo = (route) => {
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
      if (['home', 'iq', 'eq', 'results', 'admin'].includes(rawHash)) {
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

    const protectedRoutes = ['home', 'iq', 'eq', 'results'];

    if (!user) {
      // If unauthenticated visitor attempts to access any protected route, redirect to public landing
      if (protectedRoutes.includes(currentRoute) || currentRoute === 'admin') {
        navigateTo('/');
        setAuthModalOpen(true);
      }
    } else {
      // If authenticated user visits root '/', auto-redirect based on role
      if (currentRoute === '/' || currentRoute === '') {
        if (isAdmin) {
          navigateTo('admin');
        } else {
          navigateTo('home');
        }
      } else if (currentRoute === 'admin' && !isAdmin) {
        // Non-admin attempting to access /admin -> redirect to user home
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
      {/* Strict RBAC Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        tabSwitchCount={tabSwitchCount}
        onOpenAuth={handleOpenAuth}
      />

      {/* Auth Modal for Sign In / Sign Up with Post-Login Routing */}
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
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {user && currentRoute === 'eq' && (
          <EQQuiz
            iqData={iqData}
            onComplete={handleEQComplete}
            onTabSwitch={handleTabSwitch}
            tabSwitchCount={tabSwitchCount}
          />
        )}

        {user && currentRoute === 'results' && (
          <Results
            resultsData={resultsData}
            onRetake={handleRetake}
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
          <p>© 2026 SmartIQ Platform • Supabase Cloud & Dual Psychometrics Engine</p>
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
