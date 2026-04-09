import React from 'react';
import { useTestStore } from './store/useTestStore';
import { IntroScreen } from './components/IntroScreen';
import { TestScreen } from './components/TestScreen';
import { ResultScreen } from './components/ResultScreen';

function App() {
  const currentScreen = useTestStore(state => state.currentScreen);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fff8_0,#f6faf6_36%,#f2f7f3_100%)] text-[#1e2a22] font-sans antialiased">
      <main className="max-w-[980px] mx-auto px-4 py-6 pb-14 sm:px-6">
        {currentScreen === 'intro' && <IntroScreen />}
        {currentScreen === 'test' && <TestScreen />}
        {currentScreen === 'result' && <ResultScreen />}
      </main>
    </div>
  );
}

export default App;
