import React, { useMemo } from 'react';
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  Languages,
  Sliders,
  Maximize2,
  FileText,
  AlertCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import {
  WritingCategory,
  OutputLanguage,
  WritingTone,
  WritingLength,
} from '../types';
import { WRITING_CATEGORIES } from '../data/categories';

interface WritingWorkspaceProps {
  topic: string;
  onTopicChange: (value: string) => void;
  category: WritingCategory;
  onCategoryChange: (value: WritingCategory) => void;
  language: OutputLanguage;
  onLanguageChange: (value: OutputLanguage) => void;
  tone: WritingTone;
  onToneChange: (value: WritingTone) => void;
  length: WritingLength;
  onLengthChange: (value: WritingLength) => void;
  onGenerate: () => void;
  onClearInput: () => void;
  isGenerating: boolean;
  errorMessage: string | null;
}

const TONES: { id: WritingTone; label: string; icon: string; desc: string }[] = [
  { id: 'Professional', label: 'Professional', icon: '💼', desc: 'Polished & business-focused' },
  { id: 'Friendly', label: 'Friendly', icon: '😊', desc: 'Warm, approachable & conversational' },
  { id: 'Casual', label: 'Casual', icon: '☕', desc: 'Relaxed, natural & easygoing' },
  { id: 'Formal', label: 'Formal', icon: '📜', desc: 'Dignified & highly structured' },
  { id: 'Creative', label: 'Creative', icon: '🎨', desc: 'Imaginative & expressive storytelling' },
  { id: 'Funny', label: 'Funny', icon: '😄', desc: 'Witty, humorous & playful' },
  { id: 'Persuasive', label: 'Persuasive', icon: '🎯', desc: 'Compelling & action-driven' },
  { id: 'Inspirational', label: 'Inspirational', icon: '🚀', desc: 'Uplifting & motivational' },
  { id: 'Simple', label: 'Simple', icon: '💡', desc: 'Clear, plain & easy to read' },
];

const LENGTH_OPTIONS: { id: WritingLength; label: string; range: string; desc: string }[] = [
  { id: 'Short', label: 'Short', range: '~50–120 words', desc: 'Concise & punchy' },
  { id: 'Medium', label: 'Medium', range: '~150–300 words', desc: 'Balanced & thorough' },
  { id: 'Long', label: 'Long', range: '~400–700 words', desc: 'Detailed & extensive' },
];

export const WritingWorkspace: React.FC<WritingWorkspaceProps> = ({
  topic,
  onTopicChange,
  category,
  onCategoryChange,
  language,
  onLanguageChange,
  tone,
  onToneChange,
  length,
  onLengthChange,
  onGenerate,
  onClearInput,
  isGenerating,
  errorMessage,
}) => {
  const MAX_CHARS = 2500;
  const charsUsed = topic.length;
  const isNearLimit = charsUsed > MAX_CHARS * 0.9;

  const currentCategoryInfo = useMemo(() => {
    return WRITING_CATEGORIES.find((c) => c.id === category) || WRITING_CATEGORIES[0];
  }, [category]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isGenerating && topic.trim()) {
        onGenerate();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 lg:p-7 flex flex-col gap-6">
      {/* Topic text area section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Enter Your Topic or Instructions</span>
          </label>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`font-mono transition-colors ${
                isNearLimit ? 'text-amber-600 font-semibold' : 'text-slate-400'
              }`}
            >
              {charsUsed} / {MAX_CHARS}
            </span>
            {topic.length > 0 && !isGenerating && (
              <button
                type="button"
                onClick={onClearInput}
                className="text-slate-400 hover:text-slate-700 underline text-xs transition-colors"
                title="Clear input text"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <textarea
            id="topic-input"
            rows={5}
            maxLength={MAX_CHARS}
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder={currentCategoryInfo.placeholder}
            className={`w-full p-4 rounded-xl text-slate-900 bg-slate-50/70 border transition-all text-sm sm:text-base leading-relaxed placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed ${
              errorMessage && !topic.trim()
                ? 'border-red-400 focus:border-red-500'
                : 'border-slate-200 focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Dynamic Category Hint */}
        <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span>
            Writing as <strong className="font-semibold text-slate-700">{category}</strong>: {currentCategoryInfo.description}
          </span>
        </p>
      </div>

      {/* Writing Category Selector */}
      <div>
        <label htmlFor="category-select" className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Writing Category ({WRITING_CATEGORIES.length} options)</span>
        </label>
        
        <div className="relative">
          <select
            id="category-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value as WritingCategory)}
            disabled={isGenerating}
            className="w-full appearance-none px-4 py-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <optgroup label="Academic & General">
              {WRITING_CATEGORIES.filter((c) => c.group === 'Academic & Essays').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.description.slice(0, 48)}...
                </option>
              ))}
            </optgroup>
            <optgroup label="Social Media & Video">
              {WRITING_CATEGORIES.filter((c) => c.group === 'Social & Video').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.description.slice(0, 48)}...
                </option>
              ))}
            </optgroup>
            <optgroup label="Professional & Business">
              {WRITING_CATEGORIES.filter((c) => c.group === 'Professional & Business').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.description.slice(0, 48)}...
                </option>
              ))}
            </optgroup>
            <optgroup label="Personal & Creative">
              {WRITING_CATEGORIES.filter((c) => c.group === 'Personal & Creative').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.description.slice(0, 48)}...
                </option>
              ))}
            </optgroup>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Quick category badges for common beginner picks */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {['Essay', 'Social Media Caption', 'Professional Email', 'Birthday Wish', 'Story', 'YouTube Video Description'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat as WritingCategory)}
                disabled={isGenerating}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Output Language Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-600" />
            <span>Output Language</span>
          </label>
          <span className="text-xs text-slate-500">Supports RTL Urdu & Roman Urdu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* English */}
          <button
            type="button"
            onClick={() => onLanguageChange('English')}
            disabled={isGenerating}
            className={`p-3 rounded-xl border text-left transition-all relative ${
              language === 'English'
                ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">English</span>
              {language === 'English' && <Check className="w-4 h-4 text-indigo-600" />}
            </div>
            <p className="text-xs text-slate-500 mt-1">Natural, fluent & grammatically correct</p>
          </button>

          {/* Urdu */}
          <button
            type="button"
            onClick={() => onLanguageChange('Urdu')}
            disabled={isGenerating}
            className={`p-3 rounded-xl border text-left transition-all relative ${
              language === 'Urdu'
                ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-900">Urdu</span>
                <span className="font-urdu font-bold text-sm text-purple-700">(اردو)</span>
              </div>
              {language === 'Urdu' && <Check className="w-4 h-4 text-purple-600" />}
            </div>
            <p className="text-xs text-slate-500 mt-1">Authentic Urdu script in RTL format</p>
          </button>

          {/* Roman Urdu */}
          <button
            type="button"
            onClick={() => onLanguageChange('Roman Urdu')}
            disabled={isGenerating}
            className={`p-3 rounded-xl border text-left transition-all relative ${
              language === 'Roman Urdu'
                ? 'border-violet-500 bg-violet-50/50 ring-2 ring-violet-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Roman Urdu</span>
              {language === 'Roman Urdu' && <Check className="w-4 h-4 text-violet-600" />}
            </div>
            <p className="text-xs text-slate-500 mt-1">Urdu language written in English alphabet</p>
          </button>
        </div>
      </div>

      {/* Tone & Length Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
        {/* Tone Selector */}
        <div>
          <label htmlFor="tone-select" className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Tone & Style</span>
          </label>
          <div className="relative">
            <select
              id="tone-select"
              value={tone}
              onChange={(e) => onToneChange(e.target.value as WritingTone)}
              disabled={isGenerating}
              className="w-full appearance-none px-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              {TONES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.label} — {t.desc}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Current style: <span className="font-medium text-slate-700">{tone}</span>
          </p>
        </div>

        {/* Text Length Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-indigo-600" />
            <span>Desired Length</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LENGTH_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onLengthChange(opt.id)}
                disabled={isGenerating}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  length === opt.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-500/30'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="text-xs sm:text-sm font-medium">{opt.label}</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{opt.range}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onClearInput}
          disabled={isGenerating || !topic.trim()}
          className="order-2 sm:order-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Input</span>
        </button>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="order-1 sm:order-2 flex-1 sm:flex-initial sm:min-w-[220px] flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-white font-semibold text-sm sm:text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 hover:from-indigo-500 hover:via-purple-500 hover:to-violet-600 shadow-md shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating your text...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Generate Text</span>
              <span className="hidden lg:inline-block text-[11px] font-normal opacity-75 bg-black/20 px-1.5 py-0.5 rounded">
                Ctrl+Enter
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
