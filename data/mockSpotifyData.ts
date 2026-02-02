
/**
 * MOCK RAW SPOTIFY API DATA
 * ---------------------------------------------------------------------------
 * This file provides dummy data structures that exactly mirror the 
 * raw JSON responses from the Spotify Web API (v1).
 */

export const MOCK_RAW_USER_PROFILE = {
  display_name: "Sonic Nomad",
  id: "sonic_nomad_88",
  images: [
    { url: "https://picsum.photos/seed/sonic/300/300", height: 300, width: 300 }
  ],
  country: "US",
  email: "nomad@rewind.app",
  external_urls: { spotify: "https://open.spotify.com/user/sonic_nomad_88" }
};

const ARTIST_NAMES = [
  "The Weeknd", "Lana Del Rey", "Tame Impala", "Arctic Monkeys", "Mitski",
  "Frank Ocean", "Daft Punk", "Beach House", "Radiohead", "SZA",
  "Kendrick Lamar", "Dua Lipa", "Tyler, The Creator", "Grimes", "Slowdive",
  "Bon Iver", "Fred again..", "Khruangbin", "NewJeans", "PinkPantheress"
];

const GENRE_POOL = [
  "indie pop", "synth-pop", "neo-psychedelia", "art pop", "indie rock",
  "contemporary r&b", "dream pop", "experimental pop", "post-punk", "house",
  "garage rock", "modern rock", "chamber pop", "lo-fi indie", "ambient",
  "liquid funk", "hyperpop", "neo-soul", "jazz fusion", "afrobeats"
];

const TRACK_NAMES = [
  { name: "Blinding Lights", artist: "The Weeknd" },
  { name: "Summertime Sadness", artist: "Lana Del Rey" },
  { name: "The Less I Know The Better", artist: "Tame Impala" },
  { name: "Do I Wanna Know?", artist: "Arctic Monkeys" },
  { name: "My Love Mine All Mine", artist: "Mitski" },
  { name: "Pink + White", artist: "Frank Ocean" },
  { name: "Instant Crush", artist: "Daft Punk" },
  { name: "Space Song", artist: "Beach House" },
  { name: "Everything in its Right Place", artist: "Radiohead" },
  { name: "Snooze", artist: "SZA" },
  { name: "Not Like Us", artist: "Kendrick Lamar" },
  { name: "Levitating", artist: "Dua Lipa" },
  { name: "EARFQUAKE", artist: "Tyler, The Creator" },
  { name: "Genesis", artist: "Grimes" },
  { name: "When the Sun Hits", artist: "Slowdive" }
];

/**
 * Generates raw-formatted top items (Artists)
 */
const generateRawArtists = (seed: number) => ({
  items: Array.from({ length: 50 }, (_, i) => ({
    id: `art_${i}_s${seed}`,
    name: ARTIST_NAMES[(i + seed) % ARTIST_NAMES.length],
    images: [{ url: `https://picsum.photos/seed/art_${i + seed}/400/400` }],
    // Assign 2-3 random genres from pool for variety
    genres: [
      GENRE_POOL[(i + seed) % GENRE_POOL.length],
      GENRE_POOL[(i + seed + 5) % GENRE_POOL.length]
    ],
    external_urls: { spotify: "https://open.spotify.com" },
    popularity: 85 - i
  }))
});

/**
 * Generates raw-formatted top items (Tracks)
 */
const generateRawTracks = (seed: number) => ({
  items: Array.from({ length: 50 }, (_, i) => {
    const track = TRACK_NAMES[(i + seed) % TRACK_NAMES.length];
    return {
      id: `trk_${i}_s${seed}`,
      name: track.name,
      artists: [{ name: track.artist }],
      album: {
        images: [{ url: `https://picsum.photos/seed/alb_${i + seed}/400/400` }],
        name: "Mock Album"
      },
      external_urls: { spotify: "https://open.spotify.com" },
      duration_ms: 215000,
      popularity: 90 - i
    };
  })
});

/**
 * Generates raw-formatted audio features
 */
const generateRawAudioFeatures = () => ({
  audio_features: Array.from({ length: 50 }, (_, i) => ({
    id: `trk_${i}_10`,
    danceability: 0.4 + Math.random() * 0.4,
    energy: 0.5 + Math.random() * 0.4,
    valence: 0.3 + Math.random() * 0.5,
    acousticness: Math.random() * 0.3,
    instrumentalness: Math.random() * 0.2,
    speechiness: Math.random() * 0.1,
    tempo: 120,
    liveness: 0.1
  }))
});

export const MOCK_RAW_STATS = {
  '4w': {
    artists: generateRawArtists(1),
    tracks: generateRawTracks(1)
  },
  '6m': {
    artists: generateRawArtists(3),
    tracks: generateRawTracks(3)
  },
  '12m': {
    artists: generateRawArtists(7),
    tracks: generateRawTracks(7)
  },
  audioFeatures: generateRawAudioFeatures()
};
