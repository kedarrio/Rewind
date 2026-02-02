
/**
 * SPOTIFY TELEMETRY SERVICE
 * ---------------------------------------------------------------------------
 * Handles all direct communication with the Spotify Web API.
 * Responsible for Auth redirection, Token retrieval, and data fetching.
 */

// NOTE: If you are running this locally, ensure this Client ID matches your 
// Spotify Developer Dashboard project.
const CLIENT_ID = '5b441f577c3b41098936e83c30e28a89';

/**
 * REDIRECT URI NORMALIZATION
 * Spotify requires an EXACT match. We strip trailing slashes and hashes 
 * to ensure the URI matches the one configured in your dashboard.
 */
const getRedirectUri = () => {
  const url = new URL(window.location.href);
  // Remove hash and search params for the redirect identity
  return `${url.origin}${url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '')}`;
};

const REDIRECT_URI = getRedirectUri();

// Defined scopes required for stats analysis
const SCOPES = [
  'user-top-read',    // Access top tracks/artists
  'user-read-private', // Get basic profile info
  'user-read-email'    // Identifier
];

export const spotifyAuth = {
  /**
   * Builds the Spotify Authorization URL
   * We use Implicit Grant flow (response_type=token) for a serverless frontend.
   * 
   * TROUBLESHOOTING "unsupported_response_type":
   * 1. Go to your Spotify Developer Dashboard.
   * 2. Open your App settings.
   * 3. Ensure "Implicit Grant" is checked/enabled.
   * 4. Ensure the Redirect URI matches: ${REDIRECT_URI}
   */
  getLoginUrl: () => {
    const url = new URL('https://accounts.spotify.com/authorize');
    url.searchParams.append('client_id', CLIENT_ID);
    url.searchParams.append('response_type', 'token');
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('scope', SCOPES.join(' '));
    url.searchParams.append('show_dialog', 'true');
    return url.toString();
  },
  
  /**
   * Parses the URL hash to extract the access_token or errors.
   */
  getTokenFromUrl: () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    // Check for Spotify-returned errors in the hash
    const error = params.get('error');
    if (error) {
      return { error };
    }

    const token = params.get('access_token');
    if (token) {
      // Clean URL for a better user experience
      window.history.replaceState(null, '', window.location.pathname);
      return { token };
    }
    return null;
  }
};

/**
 * GENERIC FETCH WRAPPER
 * Handles 401 (Expired), 429 (Throttled), and other error states.
 */
async function spotifyFetch(endpoint: string, token: string, onLog?: (msg: string) => void) {
  if (onLog) onLog(`HTTP GET: /v1/${endpoint.split('?')[0]}`);
  
  const resp = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!resp.ok) {
    if (resp.status === 401) {
      localStorage.removeItem('spotify_token');
      throw new Error('AUTH_EXPIRED');
    }
    if (resp.status === 429) {
      throw new Error('QUOTA_EXCEEDED');
    }
    const errorData = await resp.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API_ERROR_${resp.status}`);
  }

  return resp.json();
}

/**
 * DATA NORMALIZER
 */
export function formatSpotifyItem(item: any, rank: number) {
  return {
    id: item.id,
    name: item.name,
    title: item.name,
    artist: item.artists?.[0]?.name || "Various Artists",
    imageUrl: item.images?.[0]?.url || item.album?.images?.[0]?.url || "",
    albumArt: item.album?.images?.[0]?.url || "",
    rank: rank + 1,
    spotifyUrl: item.external_urls?.spotify || "",
    genres: item.genres || [] 
  };
}

/**
 * COMPREHENSIVE STATS SYNC
 */
export async function getFullMusicStats(token: string, onLog?: (msg: string) => void) {
  try {
    const [profile, topArt4w, topTrk4w, topArt6m, topTrk6m, topArt12m, topTrk12m] = await Promise.all([
      spotifyFetch('me', token, onLog),
      spotifyFetch('me/top/artists?time_range=short_term&limit=50', token, onLog),
      spotifyFetch('me/top/tracks?time_range=short_term&limit=50', token, onLog),
      spotifyFetch('me/top/artists?time_range=medium_term&limit=50', token, onLog),
      spotifyFetch('me/top/tracks?time_range=medium_term&limit=50', token, onLog),
      spotifyFetch('me/top/artists?time_range=long_term&limit=50', token, onLog),
      spotifyFetch('me/top/tracks?time_range=long_term&limit=50', token, onLog),
    ]);

    const recentTrackIds = topTrk4w.items.slice(0, 50).map((t: any) => t.id);
    let audioFeaturesRaw = { audio_features: [] };
    if (recentTrackIds.length > 0) {
      audioFeaturesRaw = await spotifyFetch(`audio-features?ids=${recentTrackIds.join(',')}`, token, onLog);
    }

    const validFeatures = audioFeaturesRaw.audio_features.filter((f: any) => f !== null);
    const getAvg = (key: string) => 
      validFeatures.length > 0 
        ? validFeatures.reduce((acc: number, cur: any) => acc + cur[key], 0) / validFeatures.length 
        : 0;

    return {
      user: {
        displayName: profile.display_name,
        username: profile.id,
        imageUrl: profile.images?.[0]?.url || null,
        country: profile.country
      },
      stats: {
        '4w': { 
          artists: topArt4w.items.map((it: any, i: number) => formatSpotifyItem(it, i)),
          tracks: topTrk4w.items.map((it: any, i: number) => formatSpotifyItem(it, i))
        },
        '6m': { 
          artists: topArt6m.items.map((it: any, i: number) => formatSpotifyItem(it, i)),
          tracks: topTrk6m.items.map((it: any, i: number) => formatSpotifyItem(it, i))
        },
        '12m': { 
          artists: topArt12m.items.map((it: any, i: number) => formatSpotifyItem(it, i)),
          tracks: topTrk12m.items.map((it: any, i: number) => formatSpotifyItem(it, i))
        },
        audioFeatures: {
          energy: getAvg('energy'),
          danceability: getAvg('danceability'),
          valence: getAvg('valence'),
          acousticness: getAvg('acousticness'),
          instrumentalness: getAvg('instrumentalness'),
          speechiness: getAvg('speechiness')
        }
      }
    };
  } catch (error) {
    throw error;
  }
}
