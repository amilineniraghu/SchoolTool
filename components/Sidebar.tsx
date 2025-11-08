import React, { useEffect, useRef } from 'react';
import { StudySparkLogo, BrainIcon, RectangleStackIcon, QuestionMarkCircleIcon } from './Icons';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const sidebar = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !sidebarOpen) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  },[sidebarOpen, setSidebarOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 xl:w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
           <div className="flex items-center gap-2">
                <StudySparkLogo className="h-8 w-8 text-indigo-400"/>
                <span className="text-xl font-bold text-white tracking-tight hidden xl:block">StudySpark</span>
            </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden xl:block">Student Tools</span>
              <span className="block xl:hidden">•••</span>
            </h3>
            <ul className="mt-3">
              <li className="px-3 py-2 rounded-sm mb-0.5 last:mb-0 bg-slate-900">
                <a href="#" className="block text-slate-200 truncate transition duration-150 hover:text-white">
                  <div className="flex items-center">
                    <BrainIcon className="shrink-0 h-6 w-6 text-indigo-400"/>
                    <span className="text-sm font-medium ml-3 xl:opacity-100 2xl:opacity-100 duration-200">
                      Mind Map Generator
                    </span>
                  </div>
                </a>
              </li>
              <li className="px-3 py-2 rounded-sm mb-0.5 last:mb-0">
                <a href="#" className="block text-slate-400 truncate transition duration-150 hover:text-slate-200">
                  <div className="flex items-center">
                    <RectangleStackIcon className="shrink-0 h-6 w-6"/>
                    <span className="text-sm font-medium ml-3 xl:opacity-100 2xl:opacity-100 duration-200">
                      Flashcard Maker
                    </span>
                  </div>
                </a>
              </li>
              <li className="px-3 py-2 rounded-sm mb-0.5 last:mb-0">
                <a href="#" className="block text-slate-400 truncate transition duration-150 hover:text-slate-200">
                  <div className="flex items-center">
                    <QuestionMarkCircleIcon className="shrink-0 h-6 w-6"/>
                    <span className="text-sm font-medium ml-3 xl:opacity-100 2xl:opacity-100 duration-200">
                      Quiz Generator
                    </span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
