
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { StatsPage } from './pages/StatsPage';
import { LoadingScreen } from './pages/LoadingScreen';
import { ReportPage } from './pages/ReportPage';
import { AdPage } from './pages/AdPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdPlaceholder } from './components/AdPlaceholder';
import { DevConsole } from './components/DevConsole';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isExcluded = location.pathname === '/loading' || location.pathname === '/ad';
  const isPrivacy = location.pathname === '/privacy';
  const isReport = location.pathname === '/report';

  return (
    <div className="relative min-h-screen selection:bg-accent selection:text-white font-space">
      <ScrollToTop />
      {/* Aesthetic Background Overlays - Hidden on Loading and Ad pages */}
      {!isExcluded && (
        <>
          <div className="noise fixed inset-0 z-[100] pointer-events-none"></div>
          <div className="animated-gradient fixed inset-0 -z-10 opacity-40"></div>
        </>
      )}
      
      <Navbar />

      <main className="pt-16">
        {children}
      </main>

      {!isExcluded && !isPrivacy && !isReport && location.pathname !== '/404' && (
        <section className="px-12 lg:px-48 py-8">
          <AdPlaceholder size="leaderboard" slot="global-page-bottom" />
        </section>
      )}

      <Footer />
      
      {/* Dev Console - Floating outside the main layout */}
      <DevConsole />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <PageWrapper>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/loading" element={<LoadingScreen />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/ad" element={<AdPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageWrapper>
      </Router>
    </AuthProvider>
  );
}
