import React, { useState, useEffect } from 'react';
import { Region, QuestionType } from '../../types/geography';
import { Plus, Database, Trash2, CheckCircle2, Download } from 'lucide-react';

interface CustomItem {
  id: string;
  name: string;
  capital?: string;
  region: Region;
  category: QuestionType;
}

export const DatasetAdmin: React.FC = () => {
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [formName, setFormName] = useState('');
  const [formCapital, setFormCapital] = useState('');
  const [formRegion, setFormRegion] = useState<Region>('belgium');
  const [formCategory, setFormCategory] = useState<QuestionType>('province');
  const [toast, setToast] = useState<string | null>(null);

  // Load custom data from localstorage
  useEffect(() => {
    const saved = localStorage.getItem('geo_trainer_custom_items');
    if (saved) {
      try {
        setCustomItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCustomItems = (list: CustomItem[]) => {
    setCustomItems(list);
    localStorage.setItem('geo_trainer_custom_items', JSON.stringify(list));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newItem: CustomItem = {
      id: `custom-${formRegion}-${formCategory}-${Date.now()}`,
      name: formName.trim(),
      capital: formCapital.trim() || undefined,
      region: formRegion,
      category: formCategory,
    };

    const updated = [newItem, ...customItems];
    saveCustomItems(updated);

    // reset fields
    setFormName('');
    setFormCapital('');
    setToast("Item succesvol toegevoegd aan de lokale databank!");
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = customItems.filter(item => item.id !== id);
    saveCustomItems(updated);
  };

  const exportJSON = () => {
    if (customItems.length === 0) return;
    const blob = new Blob([JSON.stringify(customItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aardrijkskunde_dataset_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast("Dataset succesvol geëxporteerd als JSON!");
    setTimeout(() => setToast(null), 2500);
  };

  const exportCSV = () => {
    if (customItems.length === 0) return;
    const headers = ['id', 'name', 'capital', 'region', 'category'];
    const csvRows = [
      headers.join(','),
      ...customItems.map(item => {
        return headers.map(fieldName => {
          const value = item[fieldName as keyof CustomItem] || '';
          const escaped = ('' + value).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',');
      })
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aardrijkskunde_dataset_backup_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast("Dataset succesvol geëxporteerd als CSV!");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-white">
      {/* Editor addition Form */}
      <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit shadow-xl">
        <h3 className="text-lg font-bold font-sans flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-cyan-400" />
          <span>Voeg nieuw record toe</span>
        </h3>

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">Regio</label>
            <select
              value={formRegion}
              onChange={(e) => setFormRegion(e.target.value as Region)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="belgium">België</option>
              <option value="europe">Europa</option>
              <option value="world">Wereld</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">Categorie</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as QuestionType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="province">Provincie</option>
              <option value="country">Land</option>
              <option value="city">Stad</option>
              <option value="river">Rivier</option>
              <option value="mountain">Gebergte</option>
              <option value="sea">Zee / Oceaan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">Naam</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Bijv. Maasricht"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 font-medium placeholder-slate-650"
              required
            />
          </div>

          {formCategory === 'country' || formCategory === 'province' ? (
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-slate-400 mb-1">Hoofdstad (Optioneel)</label>
              <input
                type="text"
                value={formCapital}
                onChange={(e) => setFormCapital(e.target.value)}
                placeholder="Bijv. Maastricht hoofdstad"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 font-medium placeholder-slate-650"
              />
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all mt-6 shadow-md font-sans flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Voeg Record Toe</span>
          </button>
        </form>

        {toast && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}
      </div>

      {/* Database Listing View */}
      <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col h-[520px]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          <h3 className="text-lg font-bold font-sans flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Toegevoegde Beheersrecords ({customItems.length})</span>
          </h3>
          {customItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportJSON}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Download als JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporteer JSON</span>
              </button>
              <button
                onClick={exportCSV}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Download als CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporteer CSV</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto pr-1 space-y-3">
          {customItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
              <Database className="w-10 h-10 text-slate-700 mb-2" />
              <span>Geen handmatige beheerrecords gevonden.</span>
              <p className="text-xs text-slate-600 mt-1">Gebruik het linker formulier om locaties aan de quiz pool toe te voegen.</p>
            </div>
          ) : (
            customItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-950/40 border border-slate-850 p-4 rounded-2xl animate-fade-in">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono uppercase text-[9px] font-bold">
                      {item.region}
                    </span>
                    <span className="bg-cyan-955/20 border border-cyan-900/40 text-cyan-400 px-2 py-0.5 rounded-md font-mono uppercase text-[9px] font-bold">
                      {item.category}
                    </span>
                    {item.capital && (
                      <span className="text-slate-400">Hoofdstad: {item.capital}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 bg-rose-950/30 hover:bg-rose-950/65 border border-rose-900/45 text-rose-400 hover:text-rose-300 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default DatasetAdmin;
