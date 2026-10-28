import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  Trash2,
  Download,
  Share2,
  Clock,
  Type,
  FileCheck2,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { GeneratedResult } from '../types';
import { copyToClipboard, calculateTextStats } from '../utils/clipboard';

interface OutputPanelProps {
  result: GeneratedResult | null;
  isGenerating: boolean;
  onRegenerate: () => void;
  onClearOutput: () => void;
  onSelectPromptHint?: (text: string) => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  isGenerating,
  onRegenerate,
  onClearOutput,
}) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const stats = calculateTextStats(result?.text || '');
  const isUrdu = result?.language === 'Urdu';

  const handleCopy = async () => {
    if (!result?.text) return;
    const ok = await copyToClipboard(result.text);
    if (ok) {
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2200);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleDownload = () => {
    if (!result?.text) return;
    const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanCat = result.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `writemate_${cleanCat}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 lg:p-7 flex flex-col min-h-[460px]">
      {/* Toast alert on copy */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-full shadow-lg shadow-emerald-900/20 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Text successfully copied to clipboard!</span>
        </div>
      )}

      {/* Case 1: Active generation in progress */}
      {isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Creating your text...
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            WriteMate AI is crafting your content using Google Gemini. Applying your chosen tone, language nuances, and format.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-200/50">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            <span>Formulating structure & phrasing</span>
          </div>
        </div>
      )}

      {/* Case 2: Generated result available */}
      {!isGenerating && result && (
        <div className="flex-1 flex flex-col">
          {/* Header metadata and quick actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                {result.category}
              </span>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                  isUrdu
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : result.language === 'Roman Urdu'
                    ? 'bg-violet-50 text-violet-700 border-violet-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {result.language}
                {isUrdu && ' (RTL)'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                {result.tone}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                {result.length}
              </span>
            </div>

            {/* Quick action tools */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80'
                }`}
                title="Copy generated text to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all"
                title="Download as .txt file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                type="button"
                onClick={onClearOutput}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                title="Clear output content"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Generated Content Body */}
          <div
            className={`flex-1 p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 select-text overflow-y-auto max-h-[500px] leading-relaxed text-slate-800 ${
              isUrdu ? 'font-urdu text-base sm:text-lg text-right' : 'text-sm sm:text-base text-left'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {result.text.split('\n\n').map((para, i) => (
              <p key={i} className="mb-4 last:mb-0 whitespace-pre-wrap">
                {para}
              </p>
            ))}
          </div>

          {/* Footer statistics & Regenerate button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100">
            {/* Statistics */}
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-slate-400" />
                <strong>{stats.words}</strong> words
              </span>
              <span className="text-slate-300">•</span>
              <span>
                <strong>{stats.characters}</strong> characters
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~{stats.readingTimeMinutes} min read
              </span>
            </div>

            {/* Regenerate Action */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onRegenerate}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-all border border-slate-200"
                title="Generate another version with current settings"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case 3: Empty state when nothing has been generated yet */}
      {!isGenerating && !result && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
            <FileCheck2 className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Your Generated Text Appears Here
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            Choose any writing category, select English, Urdu, or Roman Urdu, enter your topic, and click <strong className="text-indigo-600 font-semibold">Generate Text</strong>.
          </p>

          {/* Beginner 3-step visual guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg w-full text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                1
              </div>
              <div className="text-xs font-semibold text-slate-800">Set Category</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pick from 18 formats like Essay, Caption, Email, or Story.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                2
              </div>
              <div className="text-xs font-semibold text-slate-800">Choose Language</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Full support for English, Urdu (اردو), and Roman Urdu.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                3
              </div>
              <div className="text-xs font-semibold text-slate-800">Generate & Copy</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Instant AI generation with 1-click clipboard copy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
