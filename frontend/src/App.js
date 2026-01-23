import React, { useState } from 'react';
import LandingPage from './components/landing/LandingPage';
import StringArtGenerator from './components/app/StringArtGenerator';
import { Toaster } from './components/ui/sonner';

const App = () => {
  const [view, setView] = useState('landing');

  return (
    <>
      {view === 'app' ? (
        <StringArtGenerator onBack={() => setView('landing')} />
      ) : (
        <LandingPage onStart={() => setView('app')} />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default App;
