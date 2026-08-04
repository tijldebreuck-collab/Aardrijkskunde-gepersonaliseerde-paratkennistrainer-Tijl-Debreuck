import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, 
  RotateCcw, Download, Upload, Sliders, Sparkles, Check, Languages, Lock
} from 'lucide-react';
import { Language, uiTranslations } from '../../utils/language';

interface SettingsProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  isSoundMuted: boolean;
  toggleSound: () => void;
  onClearStats: () => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  isAdmin?: boolean;
  onVerifyAdmin?: (password: string) => Promise<boolean>;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  setTheme,
  isSoundMuted,
  toggleSound,
  onClearStats,
  language = 'nl',
  onLanguageChange,
  isAdmin = false,
  onVerifyAdmin
}) => {
  const t = uiTranslations[language];

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleUnlockData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onVerifyAdmin) return;
    setAdminPasswordError(null);
    setAdminLoading(true);
    const success = await onVerifyAdmin(adminPasswordInput);
    setAdminLoading(false);
    if (success) {
      setAdminPasswordInput('');
      showToast('Gegevensbeheer ontgrendeld!');
    } else {
      setAdminPasswordError('Onjuist wachtwoord!');
    }
  };

  // Local state for persisted settings
  const [questionsPerSession, setQuestionsPerSession] = useState<number>(() => {
    const val = localStorage.getItem('geo_questions_per_session');
    return val ? parseInt(val, 10) : 14;
  });

  const [autoNextDelay, setAutoNextDelay] = useState<number>(() => {
    const val = localStorage.getItem('geo_auto_next_delay');
    return val ? parseInt(val, 10) : 2300;
  });

  const [wrongAnswerDelay, setWrongAnswerDelay] = useState<number>(() => {
    const val = localStorage.getItem('geo_wrong_answer_delay');
    return val ? parseFloat(val) : 3.0;
  });

  const [confettiEnabled, setConfettiEnabled] = useState<boolean>(() => {
    return localStorage.getItem('geo_confetti_enabled') !== 'false';
  });

  const [mapHighContrast, setMapHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('geo_map_contrast') === 'true';
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLanguageToggle = (nextLang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
    localStorage.setItem('geo_language', nextLang);
    showToast(t.toastLangChanged(nextLang === 'nl' ? 'Nederlands' : 'English'));
  };

  const handleQuestionsChange = (count: number) => {
    setQuestionsPerSession(count);
    localStorage.setItem('geo_questions_per_session', count.toString());
    showToast(`Sessie ingesteld op ${count} vragen per ronde`);
  };

  const handleDelayChange = (ms: number) => {
    setAutoNextDelay(ms);
    localStorage.setItem('geo_auto_next_delay', ms.toString());
    showToast(`Vraag-overgang ingesteld op ${(ms / 1000).toFixed(1)}s`);
  };

  const handleWrongDelayChange = (seconds: number) => {
    setWrongAnswerDelay(seconds);
    localStorage.setItem('geo_wrong_answer_delay', seconds.toString());
    showToast(`Pauze bij fout antwoord ingesteld op ${seconds.toFixed(1)}s`);
  };

  const handleToggleConfetti = () => {
    const next = !confettiEnabled;
    setConfettiEnabled(next);
    localStorage.setItem('geo_confetti_enabled', String(next));
    showToast(next ? 'Confetti-effect geactiveerd' : 'Confetti-effect uitgeschakeld');
  };

  const handleToggleContrast = () => {
    const next = !mapHighContrast;
    setMapHighContrast(next);
    localStorage.setItem('geo_map_contrast', String(next));
    showToast(next ? 'Hoog-contrast kaartranden ingeschakeld' : 'Standaard kaartranden ingeschakeld');
  };

  const handleExportData = () => {
    const exportData = {
      stats: localStorage.getItem('geo_trainer_stats') ? JSON.parse(localStorage.getItem('geo_trainer_stats')!) : null,
      progress: localStorage.getItem('geo_trainer_progress') ? JSON.parse(localStorage.getItem('geo_trainer_progress')!) : null,
      customItems: localStorage.getItem('geo_trainer_custom_items') ? JSON.parse(localStorage.getItem('geo_trainer_custom_items')!) : null,
      settings: {
        theme,
        soundMuted: isSoundMuted,
        questionsPerSession,
        autoNextDelay,
        confettiEnabled,
        mapHighContrast
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geotrainer_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Voortgangsbackup gedownload!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.stats) localStorage.setItem('geo_trainer_stats', JSON.stringify(data.stats));
        if (data.progress) localStorage.setItem('geo_trainer_progress', JSON.stringify(data.progress));
        if (data.customItems) localStorage.setItem('geo_trainer_custom_items', JSON.stringify(data.customItems));
        
        showToast('Gegevens succesvol geïmporteerd! De pagina wordt herladen...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        alert('Ongeldig backup-bestand ingevoerd.');
      }
    };
    reader.readAsText(file);
  };

  const isDark = theme === 'dark';
  const cardClass = `p-6 rounded-3xl border shadow-xl space-y-4 ${
    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
  }`;
  const subtitleClass = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderDivideClass = isDark ? 'border-slate-800' : 'border-slate-100';
  const btnInactiveClass = isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200';

  return (
    <div className={`space-y-8 animate-fade-in max-w-4xl mx-auto ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 border border-emerald-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Header Section */}
      <div className={`p-6 border rounded-3xl shadow-xl flex items-center justify-between ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-500 border border-blue-500/30 rounded-2xl">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Applicatie Instellingen
            </h2>
            <p className={`text-sm ${subtitleClass}`}>Pas de weergave, audio, quizvoorkeuren en data-instellingen aan naar wens.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taal van Benamingen */}
        <div className={`${cardClass} md:col-span-2`}>
          <div className={`flex items-center gap-2 pb-3 border-b text-indigo-500 ${borderDivideClass}`}>
            <Languages className="w-5 h-5" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.languageSettingTitle}</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
            <div>
              <span className="text-sm font-bold block">{t.languageSettingTitle}</span>
              <span className={`text-xs ${subtitleClass}`}>{t.languageSettingSubtitle}</span>
            </div>
            <div className={`flex items-center p-1 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => handleLanguageToggle('nl')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  language === 'nl' ? 'bg-blue-600 text-white shadow-md' : `${subtitleClass} hover:text-blue-500`
                }`}
              >
                <span>🇳🇱</span> Nederlands
              </button>
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-md' : `${subtitleClass} hover:text-blue-500`
                }`}
              >
                <span>🇬🇧</span> English
              </button>
            </div>
          </div>
        </div>

        {/* Audio & Geluid */}
        <div className={cardClass}>
          <div className={`flex items-center gap-2 pb-3 border-b text-blue-500 ${borderDivideClass}`}>
            <Volume2 className="w-5 h-5" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Geluid & Audio</h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-bold block">Geluidseffecten</span>
              <span className={`text-xs ${subtitleClass}`}>Speel een geluid af bij het selecteren van antwoorden</span>
            </div>
            <button
              onClick={toggleSound}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                !isSoundMuted 
                  ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md shadow-emerald-500/20' 
                  : btnInactiveClass
              }`}
            >
              {!isSoundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{!isSoundMuted ? 'Ingeschakeld' : 'Gedempt'}</span>
            </button>
          </div>
        </div>

        {/* Weergave & Thema */}
        <div className={cardClass}>
          <div className={`flex items-center gap-2 pb-3 border-b text-purple-500 ${borderDivideClass}`}>
            <Sun className="w-5 h-5" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Weergave & Thema</h3>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-bold block">Interface Thema</span>
              <span className={`text-xs ${subtitleClass}`}>Schakel tussen een donkere of lichte lay-out</span>
            </div>
            <div className={`flex items-center p-1 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => {
                  setTheme('dark');
                  showToast('Donker thema ingeschakeld');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  theme === 'dark' ? 'bg-blue-600 text-white shadow' : `${subtitleClass} hover:text-blue-500`
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Donker
              </button>
              <button
                onClick={() => {
                  setTheme('light');
                  showToast('Licht thema ingeschakeld');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  theme === 'light' ? 'bg-blue-600 text-white shadow' : `${subtitleClass} hover:text-blue-500`
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Licht
              </button>
            </div>
          </div>

          <div className={`flex items-center justify-between py-2 border-t ${borderDivideClass}`}>
            <div>
              <span className="text-sm font-bold block">Hoog-contrast Kaartranden</span>
              <span className={`text-xs ${subtitleClass}`}>Duidelijkere grenzen en contouren op kaarten</span>
            </div>
            <button
              onClick={handleToggleContrast}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                mapHighContrast
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                  : btnInactiveClass
              }`}
            >
              {mapHighContrast ? 'Aan' : 'Uit'}
            </button>
          </div>
        </div>

        {/* Quiz Voorkeuren */}
        <div className={cardClass}>
          <div className={`flex items-center gap-2 pb-3 border-b text-amber-500 ${borderDivideClass}`}>
            <Sliders className="w-5 h-5" />
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Quiz Voorkeuren</h3>
          </div>

          {/* Omvang Quizronde */}
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold block">Omvang Quizronde</span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                Volledige Dataset (Alle Vragen)
              </span>
            </div>
            <p className={`text-xs ${subtitleClass} leading-relaxed`}>
              Een quizronde stelt automatisch <strong>alle mogelijke vragen</strong> uit de gekozen categorie in willekeurige volgorde en geeft aan het einde een score overzicht.
            </p>
          </div>

          {/* Slider for Wrong Answer Delay */}
          <div className={`space-y-3 py-3 border-t ${borderDivideClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold block">Vertraging bij Fout Antwoord</span>
                <span className={`text-xs ${subtitleClass}`}>
                  Seconden wachten bij onjuist antwoord (bij een goed antwoord ga je direct snel door)
                </span>
              </div>
              <span className="text-sm font-mono font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-500/20 shrink-0">
                {wrongAnswerDelay.toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-mono font-bold text-slate-400">0.5s</span>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={wrongAnswerDelay}
                onChange={(e) => handleWrongDelayChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-xs font-mono font-bold text-slate-400">5.0s</span>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5">
              <span>⚡ Snel doorwerken</span>
              <span>🐢 Rustig antwoord bekijken</span>
            </div>
          </div>

          {/* Confetti Toggle */}
          <div className={`flex items-center justify-between py-2 border-t ${borderDivideClass}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-sm font-bold block">Confetti Feest Effect</span>
                <span className={`text-xs ${subtitleClass}`}>Toon feestelijke animatie bij afronding</span>
              </div>
            </div>
            <button
              onClick={handleToggleConfetti}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                confettiEnabled
                  ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                  : btnInactiveClass
              }`}
            >
              {confettiEnabled ? 'Aan' : 'Uit'}
            </button>
          </div>
        </div>

        {/* Data & Backup */}
        <div className={cardClass}>
          <div className={`flex items-center justify-between pb-3 border-b text-emerald-500 ${borderDivideClass}`}>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Data & Voortgang Beheer</h3>
            </div>
            {isAdmin && (
              <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Beheerder Geautoriseerd
              </span>
            )}
          </div>

          {!isAdmin ? (
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'} space-y-3 my-2`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold block">Import & Export Beveiligd</span>
                  <span className={`text-xs ${subtitleClass}`}>
                    Voer het beheerderswachtwoord in om data te kunnen importeren of exporteren.
                  </span>
                </div>
              </div>
              <form onSubmit={handleUnlockData} className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Beheerderswachtwoord"
                  disabled={adminLoading}
                  className={`px-3 py-2 text-xs rounded-xl border font-mono flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={adminLoading || !adminPasswordInput.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{adminLoading ? 'Verifiëren...' : 'Ontgrendelen'}</span>
                </button>
              </form>
              {adminPasswordError && (
                <p className="text-xs text-rose-500 font-semibold">{adminPasswordError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3 py-1">
              <div className="flex gap-3">
                <button
                  onClick={handleExportData}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export Backup
                </button>

                <label className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer">
                  <Upload className="w-4 h-4" /> Import Backup
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>
              </div>
              <p className={`text-[11px] leading-relaxed ${subtitleClass}`}>
                Exporteer een JSON-bestand van je voortgang en statistieken om later te herstellen of mee te nemen naar een ander apparaat.
              </p>
            </div>
          )}

          <div className={`pt-3 border-t ${borderDivideClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-rose-500 block">Voortgang Wissen</span>
                <span className={`text-xs ${subtitleClass}`}>Wis alle scores en spaced repetition statistieken</span>
              </div>
              <button
                onClick={onClearStats}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

