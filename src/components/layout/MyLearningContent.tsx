import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Plus, Trash2, Edit2, ChevronDown, ChevronRight, Check, Map, HelpCircle } from 'lucide-react';
import { UserPreferences, CustomFolder } from '../../hooks/useUserPreferences';

import * as belgiumData from '../../data/belgium.json';
import * as europeData from '../../data/europe.json';
import * as worldData from '../../data/world.json';
import { belgiumRivers, belgiumHighways, europeRivers, europeMountains, worldRivers, worldMountains } from '../../data/geoData';
import { uiTranslations, Language } from '../../utils/language';
import { getCategoryLabel } from '../../utils/questionDescriptions';
import { translateName } from '../../utils/language';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  onStartQuiz: (folderId?: string, quizMode?: 'multiple-choice' | 'map' | 'flag') => void;
  theme: 'dark' | 'light';
  language: Language;
}

const ALL_DATA = {
  belgium: {
    province: (belgiumData as any).provinces || [],
    capital: ((belgiumData as any).provinces || []).filter((p: any) => p.capital || p.hoofdstad),
    river: belgiumRivers,
    highway: belgiumHighways,
    mountain: (belgiumData as any).mountains || []
  },
  europe: {
    country: (europeData as any).countries || [],
    capital: ((europeData as any).countries || []).filter((c: any) => c.capital || c.hoofdstad),
    river: europeRivers,
    mountain: europeMountains,
    sea: (europeData as any).seas || [],
    city: (europeData as any).steden || (europeData as any).cities || []
  },
  world: {
    country: (worldData as any).countries || [],
    capital: ((worldData as any).countries || []).filter((c: any) => c.capital || c.hoofdstad),
    river: worldRivers,
    mountain: worldMountains,
    city: (worldData as any).steden || [],
    ocean: (worldData as any).oceans || [],
    continent: (worldData as any).continents || [],
    line: (worldData as any).referenceLines || []
  }
};


export default function MyLearningContent({ isOpen, onClose, preferences, updatePreferences, onStartQuiz, theme, language }: Props) {
  const t = uiTranslations[language];
  const isDark = theme === 'dark';
  
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingFolder, setEditingFolder] = useState<CustomFolder | null>(null);
  
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleRegion = (region: string) => setExpandedRegions(p => ({ ...p, [region]: !p[region] }));
  const toggleCategory = (catId: string) => setExpandedCategories(p => ({ ...p, [catId]: !p[catId] }));

  const customFolders = preferences.customFolders || [];

  const handleCreateNew = () => {
    setEditingFolder({
      id: Date.now().toString(),
      name: 'Nieuwe Map',
      items: []
    });
    setView('edit');
  };

  const handleEdit = (folder: CustomFolder) => {
    setEditingFolder({ ...folder });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    updatePreferences({
      customFolders: customFolders.filter(f => f.id !== id)
    });
  };

  const handleSave = () => {
    if (!editingFolder) return;
    
    const isNew = !customFolders.some(f => f.id === editingFolder.id);
    let newFolders;
    if (isNew) {
      newFolders = [...customFolders, editingFolder];
    } else {
      newFolders = customFolders.map(f => f.id === editingFolder.id ? editingFolder : f);
    }
    
    updatePreferences({ customFolders: newFolders });
    setView('list');
    setEditingFolder(null);
  };

  const toggleItem = (item: any, regionId: string, categoryId: string) => {
    if (!editingFolder) return;
    const itemKey = `${regionId}::${categoryId}::${item.id}`;
    const hasItem = editingFolder.items.some(i => i.itemKey === itemKey);
    
    let newItems;
    if (hasItem) {
      newItems = editingFolder.items.filter(i => i.itemKey !== itemKey);
    } else {
      newItems = [...editingFolder.items, { ...item, itemKey, region: regionId, mappedCategory: categoryId }];
    }
    
    setEditingFolder({ ...editingFolder, items: newItems });
  };

  const toggleCategorySelectAll = (regionId: string, categoryId: string, items: any[], e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingFolder) return;
    const itemKeys = items.map(item => `${regionId}::${categoryId}::${item.id}`);
    const allSelected = itemKeys.every(key => editingFolder.items.some(i => i.itemKey === key));

    let updatedItems = [...editingFolder.items];
    if (allSelected) {
      updatedItems = updatedItems.filter(i => !itemKeys.includes(i.itemKey));
    } else {
      items.forEach(item => {
        const itemKey = `${regionId}::${categoryId}::${item.id}`;
        if (!updatedItems.some(i => i.itemKey === itemKey)) {
          updatedItems.push({ ...item, itemKey, region: regionId, mappedCategory: categoryId });
        }
      });
    }
    setEditingFolder({ ...editingFolder, items: updatedItems });
  };

  const toggleRegionSelectAll = (regionId: keyof typeof ALL_DATA, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingFolder) return;
    const categories = ALL_DATA[regionId];
    let allRegionKeys: string[] = [];
    let itemsToSelect: Array<{ item: any; itemKey: string; catId: string }> = [];

    Object.entries(categories).forEach(([catId, catItems]) => {
      (catItems as any[]).forEach(item => {
        const itemKey = `${regionId}::${catId}::${item.id}`;
        allRegionKeys.push(itemKey);
        itemsToSelect.push({ item, itemKey, catId });
      });
    });

    const allSelected = allRegionKeys.every(key => editingFolder.items.some(i => i.itemKey === key));
    let updatedItems = [...editingFolder.items];

    if (allSelected) {
      updatedItems = updatedItems.filter(i => !allRegionKeys.includes(i.itemKey));
    } else {
      itemsToSelect.forEach(({ item, itemKey, catId }) => {
        if (!updatedItems.some(i => i.itemKey === itemKey)) {
          updatedItems.push({ ...item, itemKey, region: regionId, mappedCategory: catId });
        }
      });
    }
    setEditingFolder({ ...editingFolder, items: updatedItems });
  };
  
  const isItemSelected = (itemId: string, regionId: string, categoryId: string) => {
    if (!editingFolder) return false;
    return editingFolder.items.some(i => i.itemKey === `${regionId}::${categoryId}::${itemId}`);
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
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl ${
              isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
            }`}
          >
            <div className="p-6 sm:p-8 shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold">{t.myLearningTitle}</h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {view === 'list' ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Mijn Mappen</h3>
                    <button
                      onClick={handleCreateNew}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Nieuwe Map
                    </button>
                  </div>
                  
                  {customFolders.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      Geen mappen gevonden. Maak er een aan om specifieke items te oefenen!
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {customFolders.map(folder => {
                        const hasCountries = folder.items.some(i => i.mappedCategory === 'country' || i.category === 'country' || i.region !== 'belgium');
                        return (
                          <div key={folder.id} className={`flex flex-wrap items-center justify-between p-4 rounded-2xl border gap-3 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div>
                              <h4 className="font-bold text-lg">{folder.name}</h4>
                              <span className="text-xs text-slate-500">{folder.items.length} items</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleEdit(folder)}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
                                title="Bewerken"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(folder.id)}
                                className="p-2 rounded-lg transition-colors hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 cursor-pointer"
                                title="Verwijderen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { updatePreferences({ activeFolderId: folder.id }); onStartQuiz(folder.id, 'multiple-choice'); }}
                                className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/20 text-xs cursor-pointer"
                                title="Meerkeuze Quiz"
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                Meerkeuze
                              </button>
                              <button
                                onClick={() => { updatePreferences({ activeFolderId: folder.id }); onStartQuiz(folder.id, 'map'); }}
                                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 text-xs cursor-pointer"
                                title="Kaart Quiz"
                              >
                                <Map className="w-3.5 h-3.5" />
                                Kaart
                              </button>
                              {hasCountries && (
                                <button
                                  onClick={() => { updatePreferences({ activeFolderId: folder.id }); onStartQuiz(folder.id, 'flag'); }}
                                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 text-xs cursor-pointer"
                                  title="Vlaggen Quiz (Vlaggen apart oefenen)"
                                >
                                  <span className="text-sm">🏳️</span>
                                  Vlaggen
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <input 
                      type="text"
                      value={editingFolder?.name || ''}
                      onChange={(e) => setEditingFolder(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className={`flex-1 px-4 py-3 rounded-xl text-lg font-bold border-2 focus:ring-4 focus:outline-none transition-all ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                      placeholder="Naam van de map..."
                    />
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/30 cursor-pointer"
                    >
                      <Check className="w-5 h-5" />
                      Opslaan
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(Object.keys(ALL_DATA) as Array<keyof typeof ALL_DATA>).map(regionId => {
                      const categories = ALL_DATA[regionId];
                      let totalRegionItemsCount = 0;
                      let selectedRegionItemsCount = 0;

                      Object.entries(categories).forEach(([catId, catItems]) => {
                        (catItems as any[]).forEach(item => {
                          totalRegionItemsCount++;
                          if (isItemSelected(item.id, regionId, catId)) {
                            selectedRegionItemsCount++;
                          }
                        });
                      });

                      const isAllRegionSelected = totalRegionItemsCount > 0 && selectedRegionItemsCount === totalRegionItemsCount;

                      return (
                        <div key={regionId} className={`rounded-2xl border overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <div 
                            onClick={() => toggleRegion(regionId)}
                            className={`w-full px-5 py-4 flex items-center justify-between font-bold text-lg cursor-pointer ${isDark ? 'bg-slate-800/80 hover:bg-slate-700/80' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="capitalize">{regionId === 'belgium' ? t.belgium : regionId === 'europe' ? t.europe : t.world}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 font-semibold">
                                {selectedRegionItemsCount}/{totalRegionItemsCount}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => toggleRegionSelectAll(regionId, e)}
                                className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
                              >
                                {isAllRegionSelected ? 'Alles deselecteren' : 'Alles selecteren'}
                              </button>
                              {expandedRegions[regionId] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedRegions[regionId] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-2 space-y-2">
                                  {(Object.keys(ALL_DATA[regionId]) as Array<keyof typeof ALL_DATA[typeof regionId]>).map(categoryId => {
                                    const items = ALL_DATA[regionId][categoryId];
                                    if (!items || items.length === 0) return null;
                                    
                                    const catKey = `${regionId}-${categoryId}`;
                                    const catSelectedCount = items.filter((it: any) => isItemSelected(it.id, regionId, categoryId)).length;
                                    const isCatAllSelected = catSelectedCount === items.length;

                                    // Alphabetical sort of items
                                    const sortedItems = [...items].sort((a: any, b: any) => {
                                      const nameA = translateName(categoryId === 'capital' ? (a.capital || a.hoofdstad) : (a.name || a.naam), language);
                                      const nameB = translateName(categoryId === 'capital' ? (b.capital || b.hoofdstad) : (b.name || b.naam), language);
                                      return nameA.localeCompare(nameB, language);
                                    });
                                    
                                    return (
                                      <div key={categoryId} className={`rounded-xl border ${isDark ? 'border-slate-700/50 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                                        <div 
                                          onClick={() => toggleCategory(catKey)}
                                          className={`w-full px-4 py-3 flex items-center justify-between font-semibold text-sm cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'} transition-colors`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="capitalize">{getCategoryLabel(categoryId, language)}</span>
                                            <span className="text-xs text-slate-400">({catSelectedCount}/{items.length})</span>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={(e) => toggleCategorySelectAll(regionId, categoryId, items, e)}
                                              className="px-2 py-0.5 text-xs font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all"
                                            >
                                              {isCatAllSelected ? 'Deselecteer alles' : 'Selecteer alles'}
                                            </button>
                                            {expandedCategories[catKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                          </div>
                                        </div>
                                        
                                        <AnimatePresence>
                                          {expandedCategories[catKey] && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              className="overflow-hidden border-t border-slate-200 dark:border-slate-800"
                                            >
                                              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                                                {sortedItems.map((item: any) => {
                                                  const itemName = translateName(categoryId === 'capital' ? (item.capital || item.hoofdstad) : (item.name || item.naam), language);
                                                  const isSelected = isItemSelected(item.id, regionId, categoryId);
                                                  
                                                  return (
                                                    <button
                                                      key={item.id}
                                                      onClick={() => toggleItem(item, regionId, categoryId)}
                                                      className={`px-3 py-2 rounded-lg text-left text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                                                        isSelected
                                                          ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 ring-1 ring-inset ring-blue-600/30'
                                                          : isDark
                                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                      }`}
                                                    >
                                                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-400 dark:border-slate-500'}`}>
                                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                                      </div>
                                                      <span className="truncate">{itemName}</span>
                                                    </button>
                                                  )
                                                })}
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
