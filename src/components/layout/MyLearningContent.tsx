import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Shuffle } from 'lucide-react';
import { UserPreferences } from '../../hooks/useUserPreferences';

// Import our datasets to dynamically extract categories
import * as belgiumData from '../../data/belgium.json';
import * as europeData from '../../data/europe.json';
import * as worldData from '../../data/world.json';
import { uiTranslations, Language } from '../../utils/language';
import { getCategoryLabel } from '../../utils/questionDescriptions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  onStartQuiz: () => void;
  theme: 'dark' | 'light';
  language: Language;
}

export default function MyLearningContent({ isOpen, onClose, preferences, updatePreferences, onStartQuiz, theme, language }: Props) {
  const t = uiTranslations[language];
  const isDark = theme === 'dark';

  // Extract all categories dynamically from the regions
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    
    // Quick helper to extract categories from our JSON structure
    const extract = (data: any) => {
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            if (item.category) cats.add(item.category);
          });
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          if (data[key].category) cats.add(data[key].category);
        }
      });
    };
    
    // We only extract categories if the region is selected
    if (preferences.selectedRegions.includes('belgium')) extract(belgiumData);
    if (preferences.selectedRegions.includes('europe')) extract(europeData);
    if (preferences.selectedRegions.includes('world')) extract(worldData);
    
    // Fallback if none selected
    if (cats.size === 0) {
       cats.add('country');
       cats.add('capital');
       cats.add('river');
       cats.add('mountain');
    }
    
    return Array.from(cats);
  }, [preferences.selectedRegions]);

  const toggleRegion = (region: string) => {
    const isSelected = preferences.selectedRegions.includes(region);
    let newRegions = [];
    if (isSelected) {
      newRegions = preferences.selectedRegions.filter(r => r !== region);
    } else {
      newRegions = [...preferences.selectedRegions, region];
    }
    // Prevent deselecting all
    if (newRegions.length === 0) newRegions = [region];
    updatePreferences({ selectedRegions: newRegions });
  };

  const toggleCategory = (cat: string) => {
    const isSelected = preferences.selectedCategories.includes(cat);
    let newCats = [];
    if (isSelected) {
      newCats = preferences.selectedCategories.filter(c => c !== cat);
    } else {
      newCats = [...preferences.selectedCategories, cat];
    }
    if (newCats.length === 0) newCats = [cat];
    updatePreferences({ selectedCategories: newCats });
  };

  const handleSurprise = () => {
    updatePreferences({
      selectedRegions: ['belgium', 'europe', 'world'],
      selectedCategories: ['country', 'capital', 'river', 'mountain', 'province'],
      difficulty: 'all'
    });
    onStartQuiz();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl ${
              isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">{t.myLearningTitle}</h2>
            
            <div className="space-y-8">
              {/* Regions */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">{t.chooseRegionsTitle}</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'belgium', label: t.belgium },
                    { id: 'europe', label: t.europe },
                    { id: 'world', label: t.world }
                  ].map(region => {
                    const selected = preferences.selectedRegions.includes(region.id);
                    return (
                      <button
                        key={region.id}
                        onClick={() => toggleRegion(region.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          selected
                            ? 'bg-blue-600 text-white shadow-md'
                            : isDark
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {region.label}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Categories */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">{t.chooseSubjectsTitle}</h3>
                <div className="flex flex-wrap gap-3">
                  {availableCategories.map(cat => {
                    const selected = preferences.selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                          selected
                            ? 'bg-emerald-600 text-white shadow-md'
                            : isDark
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {getCategoryLabel(cat, language)}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Difficulty */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">{t.difficultyTitle}</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'all', label: t.diffAll },
                    { id: 'makkelijk', label: t.diffEasy },
                    { id: 'gemiddeld', label: t.diffMedium },
                    { id: 'moeilijk', label: t.diffHard }
                  ].map(diff => {
                    const selected = preferences.difficulty === diff.id;
                    return (
                      <button
                        key={diff.id}
                        onClick={() => updatePreferences({ difficulty: diff.id as any })}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          selected
                            ? 'bg-violet-600 text-white shadow-md'
                            : isDark
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {diff.label}
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartQuiz}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{t.startSessionBtn}</span>
              </button>
              
              <button
                onClick={handleSurprise}
                className={`py-4 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Shuffle className="w-4 h-4" />
                <span>{t.surpriseMixBtn}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
