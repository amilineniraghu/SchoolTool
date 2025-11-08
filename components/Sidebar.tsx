import React, { useRef, useEffect } from 'react';
import { StudySparkLogo, XCircleIcon, GlobeAltIcon } from './Icons';
import { Tool } from '../App';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, activeTool, setActiveTool }) => {
  const sidebar = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !sidebarOpen) return;
      if (!sidebar.current.contains(target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
    setSidebarOpen(false);
  }

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true"></div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button className="lg:hidden text-slate-500 hover:text-slate-400" onClick={() => setSidebarOpen(!sidebarOpen)} aria-controls="sidebar" aria-expanded={sidebarOpen}>
            <span className="sr-only">Close sidebar</span>
            <XCircleIcon className="w-6 h-6 fill-current"/>
          </button>
          {/* Logo */}
          <a className="block" href="/">
            <div className="flex items-center gap-2">
                <StudySparkLogo className="h-8 w-8 text-indigo-500"/>
                <span className="text-xl font-bold text-white tracking-tight">StudySpark</span>
            </div>
          </a>
        </div>

        {/* Links */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
               <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Tools</span>
            </h3>
            <ul className="mt-3">
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${activeTool === 'mindMapGenerator' ? 'bg-slate-900' : ''}`}>
                <button onClick={() => handleToolClick('mindMapGenerator')} className="block w-full text-left text-slate-200 hover:text-white truncate transition duration-150">
                  <div className="flex items-center">
                    <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path className={`fill-current ${activeTool === 'mindMapGenerator' ? 'text-indigo-500' : 'text-slate-400'}`} d="M19.714 14.714c-1.953 0-3.571 1.618-3.571 3.571s1.618 3.571 3.571 3.571 3.571-1.618 3.571-3.571-1.618-3.571-3.571-3.571zM19.714 20.429c-1.225 0-2.214-.989-2.214-2.214s.989-2.214 2.214-2.214 2.214.989 2.214 2.214-.989 2.214-2.214 2.214zM11.143 4.286c-1.953 0-3.571 1.618-3.571 3.571s1.618 3.571 3.571 3.571 3.571-1.618 3.571-3.571S13.096 4.286 11.143 4.286zM11.143 10c-1.225 0-2.214-.989-2.214-2.214s.989-2.214 2.214-2.214 2.214.989 2.214 2.214S12.368 10 11.143 10zM4.286 14.714c-1.953 0-3.571 1.618-3.571 3.571s1.618 3.571 3.571 3.571 3.571-1.618 3.571-3.571S6.239 14.714 4.286 14.714zM4.286 20.429c-1.225 0-2.214-.989-2.214-2.214s.989-2.214 2.214-2.214 2.214.989 2.214 2.214S5.511 20.429 4.286 20.429z"></path>
                    </svg>
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Mind Map Generator</span>
                  </div>
                </button>
              </li>
              <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${activeTool === 'mapPointing' ? 'bg-slate-900' : ''}`}>
                <button onClick={() => handleToolClick('mapPointing')} className="block w-full text-left text-slate-200 hover:text-white truncate transition duration-150">
                  <div className="flex items-center">
                    <GlobeAltIcon className={`shrink-0 h-6 w-6 ${activeTool === 'mapPointing' ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">Map Pointing</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;