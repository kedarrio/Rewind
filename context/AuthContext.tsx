
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { generateMusicReport } from '../services/GeminiServices';
import { spotifyAuth, getFullMusicStats, formatSpotifyItem } from '../services/spotifyService';
import { MOCK_RAW_STATS, MOCK_RAW_USER_PROFILE } from '../data/mockSpotifyData';

/**
 * REWIND CORE CONTEXT
 * ---------------------------------------------------------------------------
 * This is the central brain of the application. It manages:
 * 1. Global State (Telemetry, Reports, Auth Status)
 * 2. Persistence (LocalStorage syncing)
 * 3. Rate Limiting (12h/24h cooldown logic)
 * 4. Developer Tools (DevLogs & Dummy Mode)
 */

export interface DevLog {
  id: string;
  time: string;
  msg: string;
  category: 'spotify' | 'gemini' | 'system';
}

export type AppStateStatus = 'IDLE' | 'THROTTLED' | 'TRAFFIC_ERROR' | 'SUCCESS' | 'ERROR';

interface AuthContextType {
  isConnected: boolean;
  spotifyToken: string | null;
  // Fix: changed from void to () => void to allow function call in consumers
  disconnect: () => void;
  initSession: () => Promise<void>;
  
  reportData: any;
  spotifyData: any;
  
  isProcessing: boolean;
  appStatus: AppStateStatus;
  errorMessage: string | null;
  
  syncTelemetry: (force?: boolean, tokenOverride?: string | null) => Promise<void>;
  syncReport: (force?: boolean) => Promise<void>;
  
  lastStatsRefresh: string | null;
  lastReportGeneration: string | null;
  
  useDummy: boolean;
  setUseDummy: (val: boolean) => void;
  
  devLogs: DevLog[];
  addDevLog: (msg: string, category: DevLog['category']) => void;
  clearDevLogs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Persistence & Cooldown Constants
export const STORAGE_KEY = 'rewind_production_storage_v3';
const COOLDOWN_TELEMETRY = 12 * 60 * 60 * 1000; // 12 Hours for Spotify data
const COOLDOWN_REPORT = 24 * 60 * 60 * 1000;    // 24 Hours for AI Intelligence

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [spotifyData, setSpotifyData] = useState<any>(null);
  const [lastStatsRefresh, setLastStatsRefresh] = useState<string | null>(null);
  const [lastReportGeneration, setLastReportGeneration] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [appStatus, setAppStatus] = useState<AppStateStatus>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [useDummy, setUseDummyState] = useState(false);
  const [devLogs, setDevLogs] = useState<DevLog[]>([]);
  
  const initRef = useRef(false);

  // --- INTERNAL UTILITIES ---
  const addDevLog = useCallback((msg: string, category: DevLog['category']) => {
    setDevLogs(prev => [...prev.slice(-49), {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      msg,
      category
    }]);
  }, []);

  // Define clearDevLogs implementation to fix shorthand property error in context provider
  const clearDevLogs = useCallback(() => {
    setDevLogs([]);
  }, []);

  const commitToCache = (data: any) => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
  };

  const setUseDummy = (val: boolean) => {
    setUseDummyState(val);
    localStorage.setItem('rewind_dummy_mode', String(val));
    addDevLog(`Mode switched: ${val ? 'DUMMY' : 'API'}`, 'system');
  };

  /**
   * TELEMETRY SYNC PIPELINE
   * Resolves the user's music stats from either Mock data or Live API.
   * Checks for cooldowns unless 'force' is passed.
   */
  const syncTelemetry = async (force: boolean = false, tokenOverride?: string | null) => {
    if (isProcessing) return;

    const activeToken = tokenOverride || spotifyToken;

    // Throttle check
    if (!force && lastStatsRefresh) {
      const diff = Date.now() - new Date(lastStatsRefresh).getTime();
      if (diff < COOLDOWN_TELEMETRY && spotifyData) {
        addDevLog("Telemetry: Using fresh cached session.", 'system');
        setIsConnected(true);
        return;
      }
    }

    setIsProcessing(true);
    setAppStatus('IDLE');
    setErrorMessage(null);

    let finalTelemetryJSON: any = null;

    try {
      if (useDummy) {
        addDevLog("Telemetry: Simulating sync...", 'system');
        await new Promise(r => setTimeout(r, 1000));
        const raw = MOCK_RAW_STATS;
        finalTelemetryJSON = {
          user: { 
            displayName: MOCK_RAW_USER_PROFILE.display_name, 
            imageUrl: MOCK_RAW_USER_PROFILE.images[0].url 
          },
          stats: {
            '4w': { artists: raw['4w'].artists.items.map(formatSpotifyItem), tracks: raw['4w'].tracks.items.map(formatSpotifyItem) },
            '6m': { artists: raw['6m'].artists.items.map(formatSpotifyItem), tracks: raw['6m'].tracks.items.map(formatSpotifyItem) },
            '12m': { artists: raw['12m'].artists.items.map(formatSpotifyItem), tracks: raw['12m'].tracks.items.map(formatSpotifyItem) },
            audioFeatures: { energy: 0.7, danceability: 0.6, valence: 0.5, acousticness: 0.2, instrumentalness: 0.1, speechiness: 0.1 }
          }
        };
      } else if (activeToken) {
        addDevLog("Telemetry: Fetching live stats...", 'spotify');
        finalTelemetryJSON = await getFullMusicStats(activeToken, (msg) => addDevLog(msg, 'spotify'));
      } else {
        throw new Error("NOT_AUTHENTICATED");
      }

      const timestamp = new Date().toISOString();
      finalTelemetryJSON.lastFetched = timestamp;

      setSpotifyData(finalTelemetryJSON);
      setLastStatsRefresh(timestamp);
      setIsConnected(true);
      setAppStatus('SUCCESS');

      commitToCache({ spotifyData: finalTelemetryJSON });
      
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setAppStatus('TRAFFIC_ERROR');
        setErrorMessage("Spotify is facing high traffic. Try again shortly.");
      } else {
        setAppStatus('ERROR');
        setErrorMessage("Sync failed. Check your connection.");
      }
      addDevLog(`Error: ${err.message}`, 'spotify');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * REPORT SYNC PIPELINE
   * Feeds the collected Telemetry into Gemini for analysis.
   * This is strictly throttled to 24h to avoid hitting AI token limits.
   */
  const syncReport = async (force: boolean = false) => {
    if (isProcessing) return;

    if (!force && lastReportGeneration) {
      const diff = Date.now() - new Date(lastReportGeneration).getTime();
      if (diff < COOLDOWN_REPORT) {
        setAppStatus('THROTTLED');
        addDevLog("Intelligence: Cooldown active.", 'system');
        return;
      }
    }

    setIsProcessing(true);
    setAppStatus('IDLE');
    setErrorMessage(null);

    try {
      addDevLog(`Intelligence: Generating narrative...`, 'gemini');
      
      const finalReportJSON = await generateMusicReport({ 
        useDummy, 
        spotifyStats: spotifyData,
        onLog: (msg) => addDevLog(msg, 'gemini')
      });
      
      const timestamp = new Date().toISOString();
      finalReportJSON.lastGenerated = timestamp;

      setReportData(finalReportJSON);
      setLastReportGeneration(timestamp);
      setAppStatus('SUCCESS');

      commitToCache({ reportData: finalReportJSON });

    } catch (err: any) {
      setAppStatus('ERROR');
      setErrorMessage("Intelligence sequence failed.");
      addDevLog(`Error: ${err.message}`, 'gemini');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * SESSION INITIALIZATION
   * Hydrates the app from LocalStorage and processes incoming Auth tokens.
   */
  const initSession = async () => {
    if (initRef.current) return;
    initRef.current = true;

    // Load preferences
    const dummyStored = localStorage.getItem('rewind_dummy_mode');
    const isDummy = dummyStored === 'true';
    if (dummyStored !== null) setUseDummyState(isDummy);

    // Sync Token
    // Fix: Properly handle result from getTokenFromUrl which can be null, error object or token object
    const authResult = spotifyAuth.getTokenFromUrl();
    let tokenValue: string | null = null;
    
    if (authResult && 'token' in authResult) {
      tokenValue = authResult.token;
    } else if (!authResult) {
      tokenValue = localStorage.getItem('spotify_token');
    }

    if (tokenValue) {
      setSpotifyToken(tokenValue);
      localStorage.setItem('spotify_token', tokenValue);
    }

    // Hydrate Data Cache
    const cache = localStorage.getItem(STORAGE_KEY);
    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        if (parsed.spotifyData) {
          setSpotifyData(parsed.spotifyData);
          setLastStatsRefresh(parsed.spotifyData.lastFetched || null);
          setIsConnected(true);
        }
        if (parsed.reportData) {
          setReportData(parsed.reportData);
          setLastReportGeneration(parsed.reportData.lastGenerated || null);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Auto-Sync if possible
    if (tokenValue || isDummy) {
      await syncTelemetry(false, tokenValue);
    }
  };

  useEffect(() => {
    initSession();
  }, []);

  const disconnect = () => {
    setIsConnected(false);
    setReportData(null);
    setSpotifyData(null);
    setSpotifyToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('spotify_token');
    addDevLog("Session terminated.", 'system');
  };

  return (
    <AuthContext.Provider value={{ 
      isConnected, spotifyToken, disconnect, initSession,
      reportData, spotifyData,
      isProcessing, appStatus, errorMessage,
      syncTelemetry, syncReport,
      lastStatsRefresh, lastReportGeneration,
      useDummy, setUseDummy,
      devLogs, addDevLog, clearDevLogs
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
