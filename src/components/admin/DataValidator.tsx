import React, { useState, useMemo } from 'react';
import { runDatabaseAudit, AuditReport, CORRECTED_COORDINATES } from '../../utils/validation';
import { 
  Database, Play, CheckCircle2, AlertTriangle, ShieldCheck, FileText, 
  ChevronRight, Download, MapPin, Search, Info, HelpCircle
} from 'lucide-react';
import belgiumData from '../../data/belgium.json';
import europeData from '../../data/europe.json';
import worldData from '../../data/world.json';
import { getDutchCategoryLabel } from '../../utils/questionDescriptions';

export const DataValidator: React.FC = () => {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [datasetFilter, setDatasetFilter] = useState<'all' | 'belgium' | 'world' | 'europe'>('all');

  const triggerAudit = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = runDatabaseAudit();
      setReport(result);
      setIsRunning(false);
      
      // Print directly to developer console as requested
      if (result.isPassed) {
        console.log("DATABASE AUDIT SUCCESS: All datasets are 100% compliant.");
      } else {
        console.error("DATABASE AUDIT FAILED: Discrepancies found in datasets:", result);
      }
    }, 600);
  };

  // Helper function to build and download the fully corrected JSON source data
  const downloadCorrectedJson = (datasetName: 'belgium' | 'world' | 'europe') => {
    let sourceData: any;
    if (datasetName === 'belgium') {
      sourceData = JSON.parse(JSON.stringify(belgiumData));
      if (sourceData.provinces) {
        sourceData.provinces = sourceData.provinces.map((item: any) => {
          if (CORRECTED_COORDINATES[item.id]) {
            return { ...item, coordinates: CORRECTED_COORDINATES[item.id] };
          }
          return item;
        });
      }
      if (sourceData.regions) {
        sourceData.regions = sourceData.regions.map((item: any) => {
          if (CORRECTED_COORDINATES[item.id]) {
            return { ...item, coordinates: CORRECTED_COORDINATES[item.id] };
          }
          return item;
        });
      }
    } else if (datasetName === 'world') {
      sourceData = JSON.parse(JSON.stringify(worldData));
      if (sourceData.steden) {
        sourceData.steden = sourceData.steden.map((item: any) => {
          if (CORRECTED_COORDINATES[item.id]) {
            return { ...item, coordinates: CORRECTED_COORDINATES[item.id] };
          }
          return item;
        });
      }
      if (sourceData.countries) {
        sourceData.countries = sourceData.countries.map((item: any) => {
          if (CORRECTED_COORDINATES[item.id]) {
            return { ...item, coordinates: CORRECTED_COORDINATES[item.id] };
          }
          return item;
        });
      }
    } else if (datasetName === 'europe') {
      sourceData = JSON.parse(JSON.stringify(europeData));
      if (sourceData.countries) {
        sourceData.countries = sourceData.countries.map((item: any) => {
          if (CORRECTED_COORDINATES[item.id]) {
            return { ...item, coordinates: CORRECTED_COORDINATES[item.id] };
          }
          return item;
        });
      }
    }

    if (!sourceData) return;

    const jsonString = JSON.stringify(sourceData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${datasetName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered list of faulty coordinate items for live display/search queries
  const filteredFaultyItems = useMemo(() => {
    if (!report) return [];
    return report.faultyItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = datasetFilter === 'all' || item.dataset === datasetFilter;
      return matchesSearch && matchesFilter;
    });
  }, [report, searchQuery, datasetFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        {/* Header section with brand audit title & trigger button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/50 rounded-2xl border border-cyan-500/30">
              <Database className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sans tracking-tight text-white">Systeemdiagnose & Datavalidatie</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Controleer alle JSON databronnen, coördinaten en ID-koppelingen live.</p>
            </div>
          </div>

          <button
            onClick={triggerAudit}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold transition-all shadow-md shadow-cyan-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isRunning ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
            ) : (
              <Play className="w-5 h-5 fill-white" />
            )}
            <span>Controleer databank</span>
          </button>
        </div>

        {/* Audit Status Panel */}
        {report ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 animate-fade-in">
              <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono mb-1">Status</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {report.isPassed ? (
                    <>
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      <span className="text-emerald-400 font-extrabold text-lg">Valide</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6 text-rose-400" />
                      <span className="text-rose-400 font-extrabold text-lg">Conflict</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono mb-1">Records Gescand</p>
                <p className="text-3xl font-extrabold text-white mt-1">{report.totalRecords}</p>
              </div>

              <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono mb-1">Coördinaten Fouten</p>
                <p className={`text-3xl font-extrabold mt-1 ${report.missingCoordsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {report.missingCoordsCount}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono mb-1">Duplicaten</p>
                <p className={`text-3xl font-extrabold mt-1 ${report.duplicateCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {report.duplicateCount}
                </p>
              </div>
            </div>

            {/* Downloader Widget container */}
            <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl animate-fade-in relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Download className="w-24 h-24 text-white" />
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/20 text-cyan-400">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">Download Databestanden</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {report.missingCoordsCount > 0 
                      ? `Er zijn ${report.missingCoordsCount} items geïdentificeerd met ontbrekende of onjuiste coördinaten. Klik op de knoppen hieronder om directe gecorrigeerde versies van de JSON databestanden lokaal op te slaan.`
                      : 'Alle databestanden zijn 100% gevalideerd. Er zijn 0 foute coördinaten gevonden in de databank.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => downloadCorrectedJson('world')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600/25 to-teal-600/20 hover:from-emerald-600/35 hover:to-teal-600/30 border border-emerald-500/25 text-emerald-300 hover:text-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download world.json</span>
                </button>
                <button
                  onClick={() => downloadCorrectedJson('belgium')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600/25 to-yellow-600/20 hover:from-amber-600/35 hover:to-yellow-600/30 border border-amber-500/25 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download belgium.json</span>
                </button>
                <button
                  onClick={() => downloadCorrectedJson('europe')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/40 hover:bg-slate-800/65 border border-slate-700/50 text-slate-300 hover:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download europe.json</span>
                </button>
              </div>
            </div>

            {/* List and Table of Specific Anomalies */}
            <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden animate-fade-in">
              <div className="p-5 border-b border-slate-850 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>Live Overzicht: {report.missingCoordsCount} Anomalieën</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Hieronder staan de specifieke records die ontbrekende of onjuiste coördinaten hebben.</p>
                </div>

                {/* Filter and search bars */}
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Zoeken op naam of ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-full sm:w-48"
                    />
                  </div>

                  <select
                    value={datasetFilter}
                    onChange={(e) => setDatasetFilter(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Alle Datasets</option>
                    <option value="world">World.json ({report.faultyItems.filter(it => it.dataset === 'world').length})</option>
                    <option value="belgium">Belgium.json ({report.faultyItems.filter(it => it.dataset === 'belgium').length})</option>
                    <option value="europe">Europe.json ({report.faultyItems.filter(it => it.dataset === 'europe').length})</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                {filteredFaultyItems.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                        <th className="py-3.5 px-5">ID</th>
                        <th className="py-3.5 px-4">Item Naam</th>
                        <th className="py-3.5 px-4">Dataset</th>
                        <th className="py-3.5 px-4">Categorie</th>
                        <th className="py-3.5 px-4">Huidige Waarde</th>
                        <th className="py-3.5 px-5">Aanbevolen Correctie [Lon, Lat]</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs">
                      {filteredFaultyItems.map((item, index) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-all">
                          <td className="py-3 px-5 font-mono text-[11px] text-slate-400 font-semibold">{item.id}</td>
                          <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                            <span className={`px-2 py-1 rounded-md ${
                              item.dataset === 'world' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/15' : 
                              item.dataset === 'belgium' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/15' :
                              'bg-cyan-500/10 text-cyan-300 border border-cyan-500/15'
                            }`}>
                              {item.dataset}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                            {getDutchCategoryLabel(item.category)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-rose-400 bg-rose-500/10 border border-rose-500/15 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
                              {item.currentValue}
                            </span>
                          </td>
                          <td className="py-3 px-5">
                            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold flex items-center gap-1.5 w-max">
                              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>[{item.correctedValue[0].toFixed(4)}, {item.correctedValue[1].toFixed(4)}]</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center">
                    <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-semibold">Geen records gevonden die voldoen aan de zoekcriteria.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audit CLI log terminal */}
            <div className="bg-slate-950 rounded-2xl border border-slate-850 p-6 shadow-inner animate-fade-in">
              <h3 className="text-emerald-400 font-mono text-sm uppercase tracking-wider mb-3 pb-3 border-b border-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>Systeem Logconsole</span>
              </h3>
              <div className="h-64 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                {report.logs.map((log, i) => {
                  let colorClass = "text-slate-400";
                  if (log.includes("❌")) colorClass = "text-rose-400 font-bold";
                  else if (log.includes("⚠️")) colorClass = "text-amber-400 font-bold";
                  else if (log.includes("✅")) colorClass = "text-emerald-400 font-semibold";
                  else if (log.includes("STARTING") || log.includes("DIAGNOSTICS END")) colorClass = "text-cyan-400 font-extrabold border-y border-cyan-950/65 py-1.5 block my-2";

                  return (
                    <div key={i} className={`flex gap-2 items-start ${colorClass}`}>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                      <span>{log}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-slate-800 bg-slate-950/10 p-12 rounded-3xl text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-slate-400 font-semibold mb-1">Geen audit rapport geladen</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Klik hierboven op "Controleer databank" om een uitgebreide diagnose op te bouwen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataValidator;
