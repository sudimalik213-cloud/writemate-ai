import React, { useState } from 'react';
import {
  X,
  History,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
} from 'lucide-react';
import { GeneratedResult } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedResult[];
  onSelectResult: (result: GeneratedResult) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onDeleteItem,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Generated Results
              </h2>
              <p className="text-xs text-slate-500">
                {history.length} saved result{history.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all"
            aria-label="Close recent results"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local Storage Privacy Notice */}
        <div className="px-5 py-2.5 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-2 text-xs text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            History is saved <strong>locally in your browser</strong> only. No personal accounts or cloud sync.
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <FileText className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-medium text-slate-600">No recent results yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Generated writing results will automatically appear here so you can view, copy, or restore them anytime.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="group p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {item.language}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                {/* Snippet */}
                <p
                  className={`text-xs text-slate-700 line-clamp-3 leading-relaxed ${
                    item.language === 'Urdu' ? 'font-urdu text-right text-sm' : ''
                  }`}
                  dir={item.language === 'Urdu' ? 'rtl' : 'ltr'}
                >
                  {item.text}
                </p>

                {/* Card footer actions */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                  <span className="text-indigo-600 font-medium group-hover:underline flex items-center gap-1">
                    Load in viewer <ArrowRight className="w-3 h-3" />
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, item.text, item.id)}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Copy text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete this saved result"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">Stored on this browser</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved results?')) {
                  onClearAll();
                }
              }}
              className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
