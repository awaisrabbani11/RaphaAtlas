import React from 'react';
import { Search, Command, Calendar, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200">
      {/* 1. Newspaper Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 lg:px-8 py-1.5 text-[11px] font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Date & Issue Metadata */}
          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Calendar className="h-3.5 w-3.5 text-teal-400" />
              <span>{currentDateFormatted}</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">Vol. IV, No. 128</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-sans text-[10px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Medically Verified Edition</span>
            </span>
          </div>

          {/* Trending Topics Ticker - Fully Clickable Filters */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-teal-400 text-[10px] uppercase font-mono tracking-wider">
              Trending Topics:
            </span>
            <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-300">
              <button
                onClick={() => setSearchQuery('ApoB')}
                className="hover:text-teal-300 transition-colors cursor-pointer text-slate-300 hover:underline"
                title="Filter articles by ApoB & Lipid Science"
              >
                #ApoBLipids
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => setSearchQuery('Circadian')}
                className="hover:text-teal-300 transition-colors cursor-pointer text-slate-300 hover:underline"
                title="Filter articles by Circadian Sleep Protocols"
              >
                #CircadianSleep
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => setSearchQuery('Ring Dips')}
                className="hover:text-teal-300 transition-colors cursor-pointer text-slate-300 hover:underline"
                title="Filter articles by Ring Dip Joint Prehab"
              >
                #RingDipPrehab
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => setSearchQuery('VO2 Max')}
                className="hover:text-teal-300 transition-colors cursor-pointer text-slate-300 hover:underline"
                title="Filter articles by Zone 2 & VO2 Max"
              >
                #VO2Max
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => setSearchQuery('Glucose')}
                className="hover:text-teal-300 transition-colors cursor-pointer text-slate-300 hover:underline"
                title="Filter articles by Continuous Glucose Monitoring"
              >
                #GlucoseCGM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Newspaper Central Masthead Logo Banner */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-8 flex flex-col items-center justify-center text-center space-y-4">
        {/* Crisp Vector Logo with Globe & Caduceus Circuit */}
        <Logo size="md" showSubtitle={true} />

        {/* Traditional Newspaper Double Border Subtitle Bar */}
        <div className="w-full max-w-4xl border-y-2 border-slate-900 py-1.5 my-2">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-800 font-mono">
            <span>LIFESTYLE & LONGEVITY</span>
            <span className="text-slate-400">•</span>
            <span>FUNCTIONAL FITNESS & MOBILITY</span>
            <span className="text-slate-400">•</span>
            <span>MEDICAL LAB SCIENCE</span>
            <span className="text-slate-400">•</span>
            <span>CLINICAL GEMINI AI ENGINE</span>
          </div>
        </div>

        {/* Compact Quick Search Bar */}
        <div className="w-full max-w-md pt-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search health topics, biomarkers, articles, AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all font-sans shadow-2xs"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-slate-400 font-mono">
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
