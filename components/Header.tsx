import React from 'react';
import { Bars3, UserCircle, StudySparkLogo } from './Icons';

// Fix: Add sidebarOpen to the component's props to fix the TypeScript error in App.tsx.
interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex items-center space-x-4">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(true); }}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3 className="w-6 h-6 fill-current" />
            </button>
            {/* Logo for larger screens */}
             <div className="hidden lg:flex items-center gap-2">
                <StudySparkLogo className="h-8 w-8 text-indigo-500"/>
                <span className="text-xl font-bold text-slate-800 tracking-tight">StudySpark</span>
            </div>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-500">
                <span className="sr-only">Settings</span>
                <UserCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;