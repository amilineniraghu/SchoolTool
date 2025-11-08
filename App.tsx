import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import MindMapGeneratorPage from './pages/MindMapGeneratorPage';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* The MindMapGeneratorPage is the currently active tool */}
            <MindMapGeneratorPage />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default App;
