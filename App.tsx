import React, { useState } from 'react';
import Hero from './components/Hero.tsx';
import BottomNavigation from './components/BottomNavigation.tsx';
import ProviderNavigation from './components/ProviderNavigation.tsx';
import SOSModal from './components/SOSModal.tsx';

import HomeView from './views/HomeView.tsx';
import ConciergeView from './views/ConciergeView.tsx';
import BerberEyeView from './views/BerberEyeView.tsx';
import MarketplaceView from './views/MarketplaceView.tsx';
import ChatView from './views/ChatView.tsx';
import ProfileView from './views/ProfileView.tsx';
// Provider Views
import ProviderPortalView from './views/ProviderPortalView.tsx';
import ReservationsView from './views/ReservationsView.tsx';
import CertificationView from './views/CertificationView.tsx';
import { AppView, AppMode, ProviderView } from './types.ts';

const App: React.FC = () => {
  const [appStarted, setAppStarted] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('home');
  const [appMode, setAppMode] = useState<AppMode>('tourist');
  const [activeProviderView, setActiveProviderView] = useState<ProviderView>('dashboard');
  const [isSOSVisible, setIsSOSVisible] = useState(false);

  const renderTouristView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView appMode={appMode} onShowSOS={() => setIsSOSVisible(true)} />;
      case 'concierge':
        return <ConciergeView />;
      case 'berberEye':
        return <BerberEyeView />;
      case 'marketplace':
        return <MarketplaceView onNavigate={setActiveView} />;
      case 'chat':
        return <ChatView />;
      case 'profile':
        // Pass setActiveProviderView to reset to dashboard when switching modes
        return <ProfileView appMode={appMode} setAppMode={(mode) => { setAppMode(mode); setActiveProviderView('dashboard'); }} />;
      default:
        return <HomeView appMode={appMode} onShowSOS={() => setIsSOSVisible(true)} />;
    }
  };

  const renderProviderView = () => {
      switch(activeProviderView) {
          case 'dashboard':
              return <ProviderPortalView onNavigate={setActiveProviderView} />;
          case 'reservations':
              return <ReservationsView />;
          case 'certification':
              return <CertificationView />;
          default:
              return <ProviderPortalView onNavigate={setActiveProviderView} />;
      }
  }

  if (!appStarted) {
    return <Hero onStart={() => setAppStarted(true)} />;
  }

  if (appMode === 'provider') {
    return (
      <div className="bg-neutral-slate-dark min-h-screen text-neutral-white antialiased pb-24 relative z-10">
        <main>
          {renderProviderView()}
        </main>
        <ProviderNavigation activeView={activeProviderView} setActiveView={setActiveProviderView} />
      </div>
    );
  }

  return (
    <div className="bg-neutral-slate-dark min-h-screen text-neutral-white antialiased pb-24 relative z-10">
      {/* FIX: Corrected typo from isVisible to isSOSVisible to match the state variable. */}
      <SOSModal isVisible={isSOSVisible} onClose={() => setIsSOSVisible(false)} />
      <main>
        {renderTouristView()}
      </main>
      <BottomNavigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;
