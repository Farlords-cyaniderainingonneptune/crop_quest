import { useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { GLOSSARY } from '../data/glossary';
import { GlossaryTerm } from '../types';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GlossaryModal({ isOpen, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'PM', 'AI & ML', 'Agri-Tech', 'Field & Ethics'];

  const filteredTerms = GLOSSARY.filter((item: GlossaryTerm) => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.example.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col text-stone-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-100">
                Agri-Tech & PM Field Handbook
              </h2>
              <p className="text-xs text-stone-400">Essential terminology, frameworks, and field definitions</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-stone-800 space-y-3 bg-stone-950/60">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts (e.g. RICE, Grounding, NDVI, Precision...)"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3.5 py-2 text-xs md:text-sm text-stone-100 placeholder:text-stone-500 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setCategoryFilter(cat);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Term List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              No matching terms found. Try a different search query.
            </div>
          ) : (
            filteredTerms.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-2 hover:border-stone-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm md:text-base text-stone-100">{t.term}</h3>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 border border-blue-800/40 px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">{t.definition}</p>

                <div className="pt-2 border-t border-stone-850 text-xs text-amber-300/90 italic flex items-start gap-1.5">
                  <span className="font-semibold text-stone-400 not-italic shrink-0">Field Example:</span>
                  <span>"{t.example}"</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/70 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
          >
            Close Handbook
          </button>
        </div>
      </div>
    </div>
  );
}
