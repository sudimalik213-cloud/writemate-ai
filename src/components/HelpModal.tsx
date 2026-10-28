import React from 'react';
import { X, HelpCircle, Sparkles, BookOpen, Globe2, ShieldCheck, Check } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                How to Use WriteMate AI
              </h2>
              <p className="text-xs text-slate-500">
                Beginner's guide to creating great AI text
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              1. Choose the Right Category
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              WriteMate AI has 18 tailored categories (Essays, Emails, Instagram Captions, YouTube Scripts, Stories, and more). Choosing the exact category ensures the AI applies the proper structure, greetings, and formatting.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1.5">
              <Globe2 className="w-4 h-4 text-purple-600" />
              2. Language Support (Urdu & Roman Urdu)
            </h3>
            <ul className="text-xs sm:text-sm space-y-1.5 text-slate-500 list-disc list-inside">
              <li>
                <strong className="text-slate-800">English:</strong> Fluent, natural English with clean grammar.
              </li>
              <li>
                <strong className="text-slate-800">Urdu (اردو):</strong> Pure Urdu script displayed in proper right-to-left (RTL) format with Urdu typography.
              </li>
              <li>
                <strong className="text-slate-800">Roman Urdu:</strong> Urdu language written in English alphabet (e.g. <em>"Aap ka bohot shukriya..."</em>), widely used in social media and messaging.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              3. Prompting Tips for Best Results
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Include key context in your topic. For example, instead of just <em>"Write an email"</em>, write <em>"Write an email to my team lead requesting a 2-day leave next Monday for family commitments"</em>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800 font-semibold block mb-0.5">Privacy & Safety</strong>
              Your inputs are processed directly via Google Gemini server-side. No user account is needed. Always review AI-generated text before publishing or sending.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
          >
            Got it, let's write!
          </button>
        </div>
      </div>
    </div>
  );
};
