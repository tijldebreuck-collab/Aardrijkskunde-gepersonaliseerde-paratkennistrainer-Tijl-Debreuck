import React, { useState, } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X,Plus, Trash2, Edit2, ChevronDown, ChevronRight, Check, Map, HelpCircle, Lock, Mail, Chrome, AlertCircle } from 'lucide-react';
import { UserPreferences, CustomFolder } from '../../hooks/useUserPreferences';
import { User } from 'firebase/auth';
import { auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../../lib/firebase';

import belgiumData from '../../data/belgium.json';
import europeData from '../../data/europe.json';
import worldData from '../../data/world.json';
import { belgiumRivers, belgiumHighways, europeRivers, europeMountains, worldRivers, worldMountains } from '../../data/geoData';
import { uiTranslations, Language } from '../../utils/language';
import { getCategoryLabel } from '../../utils/questionDescriptions';
import { translateName } from '../../utils/language';

interface Props {
  user?: User | null;
  isOpen?: boolean;
  onClose?: () => void;
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


export default function MyLearningContent({ user, isOpen, onClose, preferences, updatePreferences, onStartQuiz, theme, language }: Props) {
  const t = uiTranslations[language];
  const isDark = theme === 'dark';
  
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingFolder, setEditingFolder] = useState<CustomFolder | null>(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [dontAskDelete, setDontAskDelete] = useState(false);

  const toggleRegion = (region: string) => setExpandedRegions(p => ({ ...p, [region]: !p[region] }));
  const toggleCategory = (catId: string) => setExpandedCategories(p => ({ ...p, [catId]: !p[catId] }));

  const customFolders = preferences.customFolders || [];

  const handleCreateNew = () => {
    if (!user) {
      setPendingAction(() => () => {
        setEditingFolder({
          id: Date.now().toString(),
          name: 'Nieuwe Map',
          items: []
        });
        setView('edit');
      });
      setShowAuthModal(true);
      return;
    }

    setEditingFolder({
      id: Date.now().toString(),
      name: 'Nieuwe Map',
      items: []
    });
    setView('edit');
  };

  const handleEdit = (folder: CustomFolder) => {
    if (!user) {
      setPendingAction(() => () => {
        setEditingFolder({ ...folder });
        setView('edit');
      });
      setShowAuthModal(true);
      return;
    }

    setEditingFolder({ ...folder });
    setView('edit');
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Inloggen met Google mislukt.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      if (isLoginTab) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authenticatie mislukt.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (preferences.skipDeleteFolderConfirmation) {
      updatePreferences({
        customFolders: customFolders.filter(f => f.id !== id)
      });
    } else {
      setDeleteConfirmId(id);
      setDontAskDelete(false);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      const updates: Partial<UserPreferences> = {
        customFolders: customFolders.filter(f => f.id !== deleteConfirmId)
      };
      if (dontAskDelete) {
        updates.skipDeleteFolderConfirmation = true;
      }
      updatePreferences(updates);
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
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
      const strippedItem = { ...item };
      delete strippedItem.polygon;
      delete strippedItem.polygons;
      delete strippedItem.coordinates;
      delete strippedItem.coordinatesList;
      newItems = [...editingFolder.items, { ...strippedItem, itemKey, region: regionId, mappedCategory: categoryId }];
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
          const strippedItem = { ...item };
          delete strippedItem.polygon;
          delete strippedItem.polygons;
          delete strippedItem.coordinates;
          delete strippedItem.coordinatesList;
          updatedItems.push({ ...strippedItem, itemKey, region: regionId, mappedCategory: categoryId });
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
          const strippedItem = { ...item };
          delete strippedItem.polygon;
          delete strippedItem.polygons;
          delete strippedItem.coordinates;
          delete strippedItem.coordinatesList;
          updatedItems.push({ ...strippedItem, itemKey, region: regionId, mappedCategory: catId });
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
    <div className={`space-y-6 animate-fade-in max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-extrabold">{t.myLearningTitle}</h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Stel je eigen studiemappen samen of oefen aangepaste leersets.
            </p>
          </div>
        </div>

        {!user && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-600 dark:text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                <strong>Inloggen vereist voor eigen leerstof:</strong> Log in met je account om je eigen studiemappen toe te voegen, te bewerken en permanent op te slaan.
              </p>
            </div>
            <button
              onClick={() => {
                setPendingAction(null);
                setShowAuthModal(true);
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              Inloggen
            </button>
          </div>
        )}

        <div>
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

                  {customFolders.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Zoek in je mappen..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full pl-4 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                      </div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <option value="all">Alle Categorieën</option>
                        <option value="country">{getCategoryLabel('country', language)}</option>
                        <option value="capital">{getCategoryLabel('capital', language)}</option>
                        <option value="city">{getCategoryLabel('city', language)}</option>
                        <option value="province">{getCategoryLabel('province', language)}</option>
                        <option value="river">{getCategoryLabel('river', language)}</option>
                        <option value="mountain">{getCategoryLabel('mountain', language)}</option>
                        <option value="sea">{getCategoryLabel('sea', language)}</option>
                      </select>
                    </div>
                  )}
                  
                  {customFolders.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      Geen mappen gevonden. Maak er een aan om specifieke items te oefenen!
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {(() => {
                        const filteredFolders = customFolders.filter(folder => {
                          const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesCategory = filterCategory === 'all' || folder.items.some(i => i.mappedCategory === filterCategory || i.category === filterCategory);
                          return matchesSearch && matchesCategory;
                        });

                        if (filteredFolders.length === 0) {
                          return (
                            <div className="text-center py-12 text-slate-500">
                              Geen mappen gevonden voor deze zoekopdracht.
                            </div>
                          );
                        }

                        return filteredFolders.map(folder => {
                          const hasCountries = folder.items.some(i => i.mappedCategory === 'country' || i.category === 'country' || i.type === 'country');
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
                        });
                      })()}
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
                                            <span className="capitalize">
                                              {categoryId === 'capital' && regionId === 'belgium' ? t.catProvincialCapitals : getCategoryLabel(categoryId, language)}
                                            </span>
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
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-2xl">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Inloggen vereist</h3>
                    <p className="text-xs text-slate-500">Eigen leerstof toevoegen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Om je eigen leersof toe te voegen of te bewerken en permanent op je account te bewaren, moet je eerst inloggen.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-300 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
                >
                  <Chrome className="w-5 h-5 text-blue-500" />
                  Inloggen met Google
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink-0 mx-4 text-xs text-slate-400">of e-mail</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mailadres"
                      required
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Wachtwoord"
                      required
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>

                  {authError && (
                    <div className="flex items-start gap-2 text-rose-500 text-xs bg-rose-50 dark:bg-rose-500/10 p-2.5 rounded-xl">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold transition-all disabled:opacity-50 flex justify-center items-center shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    {authLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : isLoginTab ? 'Inloggen' : 'Registreren'}
                  </button>
                </form>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginTab(!isLoginTab)}
                    className="text-xs text-blue-500 hover:underline cursor-pointer font-medium"
                  >
                    {isLoginTab ? 'Nog geen account? Maak er een aan' : 'Al een account? Log in'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-2xl">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Map verwijderen</h3>
                  </div>
                </div>
                <button
                  onClick={cancelDelete}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-2 mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Weet je zeker dat je deze map wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontAskDelete}
                    onChange={(e) => setDontAskDelete(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Niet meer vragen</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelDelete}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Annuleren
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  Verwijderen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
