import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} StudySpark. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="text-slate-500 hover:text-slate-700">About</a>
            <a href="#" className="text-slate-500 hover:text-slate-700">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
