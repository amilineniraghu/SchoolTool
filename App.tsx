import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MindMapGeneratorPage from './pages/MindMapGeneratorPage';
import MapPointingPage from './pages/MapPointingPage';
import Footer from './components/Footer';

export type Tool = 'mindMapGenerator' | 'mapPointing';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('mindMapGenerator');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            {activeTool === 'mindMapGenerator' && <MindMapGeneratorPage />}
            {activeTool === 'mapPointing' && <MapPointingPage />}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;