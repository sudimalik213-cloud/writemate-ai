import React from 'react';
import { Sparkles, History, HelpCircle, PenTool, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/30">
            <PenTool className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-violet-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                WriteMate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Your ideas, beautifully written.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online & Ready</span>
          </div>

          {/* Languages indicator badge */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
            <span>English</span>
            <span className="text-slate-300">•</span>
            <span className="font-urdu text-[11px] font-bold">اردو</span>
            <span className="text-slate-300">•</span>
            <span>Roman Urdu</span>
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200 transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            title="View recent generated results"
            aria-label="View recent generated results"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Recent</span>
            {historyCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Help Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-slate-400/30"
            title="How WriteMate AI works"
            aria-label="How WriteMate AI works"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
