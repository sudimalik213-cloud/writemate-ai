import React from 'react';
import { Lightbulb, ArrowUpRight } from 'lucide-react';
import { ExamplePrompt } from '../types';
import { EXAMPLE_PROMPTS } from '../data/examples';

interface ExamplePromptsSectionProps {
  onSelectExample: (example: ExamplePrompt) => void;
  disabled: boolean;
}

export const ExamplePromptsSection: React.FC<ExamplePromptsSectionProps> = ({
  onSelectExample,
  disabled,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/50">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">
            Click an Example Prompt to Try
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Populates your settings instantly
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {EXAMPLE_PROMPTS.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onSelectExample(ex)}
            disabled={disabled}
            className="group p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/40 text-left transition-all duration-150 flex flex-col justify-between gap-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {ex.title}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {ex.language}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                "{ex.prompt}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[11px] text-slate-400 group-hover:text-indigo-500 font-medium">
              <span>{ex.category}</span>
              <span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
                Load Prompt
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
