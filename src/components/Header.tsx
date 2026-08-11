import React from 'react';
import { Search, HeartPulse } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onNavigateCalculators?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onNavigateAbout,
  onNavigateContact,
  onNavigateCalculators,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/90 font-sans sticky top-0 z-50 shadow-2xs">
      {/* Main Clean Healthline-Style Header Row */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <a
            href="/"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
            className="cursor-pointer"
          >
            <Logo size="sm" showSubtitle={false} layout="horizontal" />
          </a>
        </div>

        {/* Central Search Bar */}
        <div className="w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search calculators, health topics, biomarkers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-2xl pl-10 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Action Links */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-semibold">
          {onNavigateCalculators && (
            <button
              onClick={onNavigateCalculators}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>Health Calculators</span>
            </button>
          )}
          {onNavigateAbout && (
            <button
              onClick={onNavigateAbout}
              className="px-3.5 py-2 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              About
            </button>
          )}
          {onNavigateContact && (
            <button
              onClick={onNavigateContact}
              className="px-3.5 py-2 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              Contact
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

