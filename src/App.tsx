/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WritingWorkspace } from './components/WritingWorkspace';
import { OutputPanel } from './components/OutputPanel';
import { ExamplePromptsSection } from './components/ExamplePromptsSection';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HelpModal } from './components/HelpModal';
import {
  WritingCategory,
  OutputLanguage,
  WritingTone,
  WritingLength,
  GeneratedResult,
  ExamplePrompt,
} from './types';
import {
  getSavedHistory,
  saveResultToHistory,
  deleteHistoryItem,
  clearAllHistory,
} from './utils/storage';
import { Sparkles, Shield, CheckCircle2, Feather } from 'lucide-react';

export default function App() {
  // Input Workspace State
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<WritingCategory>('Paragraph');
  const [language, setLanguage] = useState<OutputLanguage>('English');
  const [tone, setTone] = useState<WritingTone>('Professional');
  const [length, setLength] = useState<WritingLength>('Medium');

  // Generation & Status State
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GeneratedResult | null>(null);

  // History & Modal Drawers
  const [history, setHistory] = useState<GeneratedResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = getSavedHistory();
    setHistory(saved);
  }, []);

  // Main Generation Handler
  const handleGenerate = useCallback(async () => {
    const trimmed = topic.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a topic or instruction before generating text.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: trimmed,
          category,
          language,
          tone,
          length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content. Please try again.');
      }

      const newResult: GeneratedResult = {
        id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        topic: trimmed,
        text: data.text,
        category: data.category || category,
        language: data.language || language,
        tone: data.tone || tone,
        length: data.length || length,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setCurrentResult(newResult);

      // Save to local storage history
      const updatedHistory = saveResultToHistory(newResult);
      setHistory(updatedHistory);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'An unexpected error occurred while communicating with the AI service.');
    } finally {
      setIsGenerating(false);
    }
  }, [topic, category, language, tone, length]);

  // Example Prompt Picker
  const handleSelectExample = (example: ExamplePrompt) => {
    setTopic(example.prompt);
    setCategory(example.category);
    setLanguage(example.language);
    setTone(example.tone);
    setLength(example.length);
    setErrorMessage(null);

    // Smooth scroll to top of workspace on smaller screens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Re-generate current text
  const handleRegenerate = () => {
    if (topic.trim() && !isGenerating) {
      handleGenerate();
    }
  };

  // Clear Input
  const handleClearInput = () => {
    setTopic('');
    setErrorMessage(null);
  };

  // Clear Output
  const handleClearOutput = () => {
    setCurrentResult(null);
  };

  // History Actions
  const handleSelectHistoryItem = (item: GeneratedResult) => {
    setCurrentResult(item);
    setTopic(item.topic);
    setCategory(item.category);
    setLanguage(item.language);
    setTone(item.tone);
    setLength(item.length);
    setErrorMessage(null);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Subtle welcome callout banner for beginners */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-violet-500/5 rounded-2xl border border-indigo-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-indigo-600 shadow-2xs border border-indigo-100/80">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                AI Text Generator for Students, Creators & Professionals
              </p>
              <p className="text-xs text-slate-500">
                Choose any writing format, pick English, Urdu (اردو) or Roman Urdu, and get polished copy instantly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-indigo-200/80 transition-colors"
            >
              How it works
            </button>
          </div>
        </div>

        {/* Workspace: 2-column Grid (Editor Left, Output Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Input and Configuration Workspace */}
          <WritingWorkspace
            topic={topic}
            onTopicChange={(val) => {
              setTopic(val);
              if (errorMessage) setErrorMessage(null);
            }}
            category={category}
            onCategoryChange={setCategory}
            language={language}
            onLanguageChange={setLanguage}
            tone={tone}
            onToneChange={setTone}
            length={length}
            onLengthChange={setLength}
            onGenerate={handleGenerate}
            onClearInput={handleClearInput}
            isGenerating={isGenerating}
            errorMessage={errorMessage}
          />

          {/* Right Column: Output Panel */}
          <OutputPanel
            result={currentResult}
            isGenerating={isGenerating}
            onRegenerate={handleRegenerate}
            onClearOutput={handleClearOutput}
          />
        </div>

        {/* Beginner Clickable Example Prompts Section */}
        <ExamplePromptsSection
          onSelectExample={handleSelectExample}
          disabled={isGenerating}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-[10px]">
              W
            </div>
            <span>
              <strong>WriteMate AI</strong> — Smart Writing Assistant
            </span>
          </div>

          <div className="flex items-center gap-4 text-center sm:text-right">
            <span>Powered by official Google Gemini API</span>
            <span className="text-slate-300">•</span>
            <span>English • اردو • Roman Urdu</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 text-center text-[11px] text-slate-400">
          AI generated results may occasionally contain inaccuracies. Please review your content before publishing.
        </div>
      </footer>

      {/* Recent History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={handleSelectHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Help & Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
