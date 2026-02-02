import { useState, useEffect, useRef } from 'react';
import { useAuth, STORAGE_KEY } from '../context/AuthContext';
import { ARCHETYPES } from '../data/archetypes';
import { MOCK_RAW_STATS, MOCK_RAW_USER_PROFILE } from '../data/mockSpotifyData';
import { getMockGeminiReport } from '../data/mockGeminiData';
import { formatSpotifyItem } from '../services/spotifyService';

export const DevConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'logs' | 'map'>('config');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { 
    isConnected, reportData,
    disconnect, useDummy, setUseDummy,
    devLogs, clearDevLogs, addDevLog,
    lastStatsRefresh, lastReportGeneration, syncTelemetry
  } = useAuth();

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current && activeTab === 'logs') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [devLogs, activeTab]);

  const handleToggleAuth = async () => {
    if (isConnected) {
      disconnect();
    } else {
      // Force dummy load through context
      setUseDummy(true);
      await syncTelemetry(true);
      addDevLog("Mock Session Injected via DevConsole", 'system');
    }
  };

  const handleArchetypeSwap = (id: string) => {
    if (!reportData) return;
    const updatedReport = {
      ...getMockGeminiReport(id),
      lastGenerated: reportData.lastGenerated || new Date().toISOString()
    };
    // Update both context and localStorage
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const current = JSON.parse(cached);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, reportData: updatedReport }));
    }
    window.location.reload(); // Quickest way to sync all state
  };

  const handleResetTime = () => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.spotifyData) delete parsed.spotifyData.lastFetched;
        if (parsed.reportData) delete parsed.reportData.lastGenerated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        addDevLog("Cache Timestamps Reset", 'system');
        window.location.reload();
      }
    } catch (e) { console.error("Reset Failed:", e); }
  };

  const handleNukeAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    addDevLog("System Reset", 'system');
    window.location.href = window.location.origin + window.location.pathname;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-mono">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-2xl border-2 ${isOpen ? 'bg-accent text-white border-accent' : 'bg-black text-white border-black hover:bg-accent hover:border-accent'}`}
      >
        <span className="material-symbols-sharp">{isOpen ? 'close' : 'terminal'}</span>
      </button>

      <div className={`absolute bottom-16 right-0 w-80 md:w-[400px] glass bg-black/95 text-white p-0 transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}`}>
        {/* Header Tabs */}
        <div className="flex bg-white/5 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'config' ? 'text-accent border-b border-accent' : 'text-white/40 hover:text-white'}`}
          >
            Config
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'map' ? 'text-accent border-b border-accent' : 'text-white/40 hover:text-white'}`}
          >
            Map
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-3 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'logs' ? 'text-accent border-b border-accent' : 'text-white/40 hover:text-white'}`}
          >
            Logs
            {devLogs.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>}
          </button>
        </div>

        <div className="p-6 max-h-[450px] overflow-y-auto custom-scrollbar">
          {activeTab === 'config' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <label className="text-[8px] uppercase tracking-widest text-white/40 block">Data Mode</label>
                <div className="flex gap-1">
                  <SimulationToggle label="Use Dummy" active={useDummy} onClick={() => setUseDummy(true)} className="flex-1" />
                  <SimulationToggle label="Use API" active={!useDummy} onClick={() => setUseDummy(false)} className="flex-1" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px]">AUTH: <span className={isConnected ? 'text-spotify' : 'text-accent'}>{isConnected ? 'CONNECTED' : 'IDLE'}</span></span>
                <button onClick={handleToggleAuth} className="text-[9px] font-bold uppercase bg-white/10 px-2 py-1 hover:bg-white/20">Toggle Session</button>
              </div>

              {reportData && isConnected && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <label className="text-[8px] uppercase tracking-widest text-white/40 block">Archetype Override</label>
                  <select 
                    value={reportData.archetype.id}
                    onChange={(e) => handleArchetypeSwap(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 text-[10px] p-2 focus:border-accent outline-none"
                  >
                    {ARCHETYPES.map(arch => (
                      <option key={arch.id} value={arch.id}>{arch.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <button onClick={handleResetTime} className="p-2 bg-white/5 border border-white/10 text-[8px] uppercase hover:bg-white/10">Bypass Throttles</button>
                <button onClick={handleNukeAll} className="p-2 bg-accent/20 border border-accent/40 text-accent text-[8px] uppercase hover:bg-accent/30">Nuke Cache</button>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="animate-in fade-in duration-300 space-y-4">
              <div className="bg-white/5 p-4 border border-white/10 rounded-sm">
                 <h4 className="text-[9px] font-bold uppercase tracking-widest text-accent mb-4">Architecture Map</h4>
                 <div className="space-y-2 text-[10px]">
                    <div className="flex justify-between"><span>Spotify Refresh</span><span>12H Policy</span></div>
                    <div className="flex justify-between"><span>Gemini Refresh</span><span>24H Policy</span></div>
                    {/* Update AI Model display name */}
                    <div className="flex justify-between"><span>AI Model</span><span className="text-accent">Gemini 3 Flash</span></div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="animate-in fade-in duration-300">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">Network Trace</span>
                  <button onClick={clearDevLogs} className="text-[8px] uppercase text-accent hover:underline">Clear</button>
               </div>
               <div ref={scrollRef} className="space-y-1.5 h-[300px] overflow-y-auto pr-2 custom-scrollbar text-[10px]">
                  {devLogs.length === 0 ? (
                    <p className="text-white/20 italic text-center py-10 uppercase tracking-widest text-[9px]">Listening for activity...</p>
                  ) : (
                    devLogs.map((log) => (
                      <div key={log.id} className="flex gap-2 font-mono leading-tight">
                        <span className="text-white/20">[{log.time}]</span>
                        <span className={`font-bold ${log.category === 'spotify' ? 'text-spotify' : log.category === 'gemini' ? 'text-accent' : 'text-white/60'}`}>
                          {log.category.toUpperCase()}:
                        </span>
                        <span className="text-white/80">{log.msg}</span>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SimulationToggle: React.FC<{ label: string; active: boolean; onClick: () => void; className?: string }> = ({ label, active, onClick, className = '' }) => (
  <button onClick={onClick} className={`${className} flex items-center justify-between p-2 text-[9px] font-bold uppercase border transition-all ${active ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-white/60'}`}>
    <span>{label}</span>
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-white/10'}`}></div>
  </button>
);