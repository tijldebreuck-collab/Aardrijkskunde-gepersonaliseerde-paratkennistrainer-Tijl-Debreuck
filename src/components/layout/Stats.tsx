import React from 'react';
import { UserStats } from '../../hooks/useQuizEngine';
import { Target, Clock, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsProps {
  stats: UserStats;
  onClearStats: () => void;
}

export const Stats: React.FC<StatsProps> = ({ stats, onClearStats }) => {
  const totalCorrect = stats.totalCorrect || 0;
  const totalAnswered = stats.totalAnswered || 0;
  const accuracy = stats.accuracy || 0;
  const avgTime = stats.avgTime || 0;
  const weaknesses = stats.weaknesses || [];

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-white">
      {/* Dynamic Key Performance Indicators (Bento Grid layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono">Precisie</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{accuracy}%</p>
          </div>
          <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-400/30 text-blue-500 dark:text-blue-400">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono">Tijd per Vraag</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{avgTime}s</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/30 text-purple-500 dark:text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 border p-6 rounded-3xl flex items-center justify-between shadow-xl">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold font-mono">Totaal Beantwoord</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalAnswered}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-500 dark:text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Accuracy SVG chart display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 border rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold font-sans mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span>Voortgang & Resultaten Ratio</span>
          </h3>

          <div className="flex flex-col items-center justify-center h-48 relative">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * accuracy) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-center mt-1">
              <span className="text-3xl font-extrabold">{accuracy}%</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase mt-0.5">SLAAGKANS</p>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 px-2 font-mono">
            <span>Juist: {totalCorrect}</span>
            <span>Fout: {totalAnswered - totalCorrect}</span>
          </div>
        </div>

        {/* Weakness analysis radar/list */}
        <div className="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 border rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-sans mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
              <span>Zwakke Punten Analyse</span>
            </h3>

            {weaknesses.length === 0 ? (
              <div className="text-center py-10 font-medium text-slate-500 text-sm">
                Geen actieve zwakke punten gedetecteerd! Goed gedaan.
              </div>
            ) : (
              <div className="space-y-3 max-h-44 overflow-y-auto pr-1">
                {weaknesses.map((weak, i) => (
                   <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shrink-0"></span>
                      <div>
                        <span className="font-semibold text-sm">{weak.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono ml-2 uppercase">({weak.region})</span>
                      </div>
                    </div>
                    <span className="text-xs bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded-full font-mono font-semibold">
                      {weak.errorCount}x fout
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clean score reset triggers */}
      <div className="flex justify-end pr-2 pt-2">
        <button
          onClick={onClearStats}
          className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:underline transition-all cursor-pointer font-bold font-mono"
        >
          Reset alle voortgangsstatistieken
        </button>
      </div>
    </div>
  );
};
export default Stats;
