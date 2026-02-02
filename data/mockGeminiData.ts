
import { ARCHETYPES } from './archetypes';

/**
 * MOCK GEMINI AI RESPONSES
 * ---------------------------------------------------------------------------
 * This file provides structured dummy data that mimics the output of the
 * Gemini 2.5 Flash model. 
 */

export const getMockGeminiReport = (archetypeId: string = '04') => {
  const archetype = ARCHETYPES.find(a => a.id === archetypeId) || ARCHETYPES[3];

  const baseData = {
    user: "Sonic Nomad",
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase(),
    website: "REWIND.APP",
    archetype: archetype,
    topArtists: [
      "The Weeknd", "Lana Del Rey", "Tame Impala", "Arctic Monkeys", "Mitski",
      "Frank Ocean", "Daft Punk", "Beach House", "Radiohead", "SZA"
    ],
    topTracks: [
      "Blinding Lights", "Summertime Sadness", "The Less I Know The Better", "Do I Wanna Know?", "My Love Mine All Mine",
      "Pink + White", "Instant Crush", "Space Song", "Everything in its Right Place", "Snooze"
    ]
  };

  const variations: Record<string, any> = {
    '01': { // Time Traveler
      audioFeatures: { energy: 0.35, danceability: 0.42, valence: 0.45, acousticness: 0.78, instrumentalness: 0.22, speechiness: 0.12 },
      emotional: { bias: "Nostalgic", maxValence: 62 },
      aiGeneratedText: {
        whyArchetype: "Your listening habits are heavily anchored in acoustic textures and timeless melodies. You bypass modern synthetic trends in favor of the organic warmth found in classic eras, making you a true guardian of musical history.",
        musicalDNA: "Your library is a living museum. You prioritize organic textures and the warmth of acoustic instruments over synthetic polish.",
        emotionalLandscape: "You seek comfort in the familiar. Your listening trends suggest music serves as a bridge to specific memories and a sense of enduring emotional stability.",
        sonicSignature: "Warm, acoustic, and timeless storytelling.",
        genreAnalysis: "A strong preference for classic rock, folk revival, and early soul indicates a grounded personality with a deep appreciation for the history of songwriting.",
        listeningHabits: "You are an album listener. You prefer the intentional flow of a curated project over the randomness of generated playlists, savoring every transition."
      }
    },
    '02': { // Trendsetter
      audioFeatures: { energy: 0.85, danceability: 0.78, valence: 0.65, acousticness: 0.12, instrumentalness: 0.35, speechiness: 0.18 },
      emotional: { bias: "Hyperactive", maxValence: 88 },
      aiGeneratedText: {
        whyArchetype: "You are always looking for the next sonic frontier. High energy levels combined with a rejection of traditional acoustic forms place you squarely in the role of a pioneer who shapes what's next.",
        musicalDNA: "You live on the bleeding edge. Your taste is defined by high-intensity synthetic textures, sharp edges, and experimental production techniques.",
        emotionalLandscape: "Optimized for dopamine and excitement. Your library suggests a constant need for sonic novelty and a relentless forward momentum in life.",
        sonicSignature: "Electric, abrasive, and ahead of its time.",
        genreAnalysis: "Hyperpop, glitch-hop, and avant-garde electronic music dominate your rotation, showing a sophisticated appetite for complexity and disruption.",
        listeningHabits: "You are a seeker. You rarely repeat tracks, always hunting for the next sonic shock to keep your creative inspiration high."
      }
    },
    '03': { // Deep Diver
      audioFeatures: { energy: 0.45, danceability: 0.38, valence: 0.48, acousticness: 0.35, instrumentalness: 0.82, speechiness: 0.05 },
      emotional: { bias: "Immersive", maxValence: 55 },
      aiGeneratedText: {
        whyArchetype: "Your high instrumentalness and low speechiness scores indicate a listener who values structure and atmosphere over literal narrative. You dive into the technical mastery of your favorite artists.",
        musicalDNA: "Complexity is your primary currency. You gravitate towards long-form compositions and intricate, layered arrangements that reveal more with every listen.",
        emotionalLandscape: "You use music as a meditative space. High instrumental density suggests you prefer abstract soundscapes that allow your own thoughts to fill the gaps.",
        sonicSignature: "Expansive, layered, and profoundly atmospheric.",
        genreAnalysis: "Ambient, progressive house, and neoclassical layers suggest a highly analytical mind that enjoys mapping out vast sonic territories.",
        listeningHabits: "You are a completionist. When you find an artist, you explore their entire discography, finding hidden gems in the deep cuts that others miss."
      }
    },
    '04': { // Mood Architect
      audioFeatures: { energy: 0.72, danceability: 0.65, valence: 0.58, acousticness: 0.23, instrumentalness: 0.15, speechiness: 0.08 },
      emotional: { bias: "Atmospheric", maxValence: 75 },
      aiGeneratedText: {
        whyArchetype: "You demonstrate a balanced profile that optimizes for rhythm and energy. You don't just listen to music; you use it to construct the perfect environment for your activities.",
        musicalDNA: "Your musical journey shows a fascinating balance between energetic anthems and mellow introspection, tailored to your daily flow.",
        emotionalLandscape: "Your emotional palette is remarkably varied. Your library is optimized for rhythmic movement and environmental focus, keeping you in the zone.",
        sonicSignature: "High-energy electronic music with a polished, professional finish.",
        genreAnalysis: "Indie pop and melodic techno create a versatile landscape that reflects your ability to adapt to any environment with grace.",
        listeningHabits: "You curate your life. Music is never just background noise; it is a vital layer of your daily environment, selected with surgical precision."
      }
    },
    '05': { // Soul Seeker
      audioFeatures: { energy: 0.25, danceability: 0.32, valence: 0.22, acousticness: 0.88, instrumentalness: 0.05, speechiness: 0.25 },
      emotional: { bias: "Melancholic", maxValence: 35 },
      aiGeneratedText: {
        whyArchetype: "Low energy and high acousticness paired with raw vocal delivery define your taste. You seek connection above all else, looking for artists who aren't afraid to be vulnerable.",
        musicalDNA: "Raw vulnerability is your core. You seek out the human voice in its most honest, unadorned state, valuing truth over production sheen.",
        emotionalLandscape: "You lean heavily into the minor keys. Your library suggests music is your primary vehicle for emotional processing and catharsis.",
        sonicSignature: "Intimate, vocal-heavy, and deeply felt narratives.",
        genreAnalysis: "Singer-songwriter, sad indie, and jazz vocals suggest an empathetic nature that values emotional authenticity above all else.",
        listeningHabits: "You listen with your heart. You often repeat tracks that resonate with your current mood, using music as a mirror for your internal world."
      }
    },
    '06': { // Rhythm Rebel
      audioFeatures: { energy: 0.95, danceability: 0.92, valence: 0.78, acousticness: 0.05, instrumentalness: 0.45, speechiness: 0.12 },
      emotional: { bias: "Ecstatic", maxValence: 92 },
      aiGeneratedText: {
        whyArchetype: "Your scores for energy and danceability are near maximum. You live for the drop and the drive, making you a rebel against any form of musical passivity.",
        musicalDNA: "Beat is your pulse. You favor percussive complexity and high-BPM energy that demands an immediate physical response from the listener.",
        emotionalLandscape: "Pure kinetic energy. You use music to bypass the analytical mind and speak directly to the body's natural rhythm and drive.",
        sonicSignature: "Percussive, high-velocity, and relentless grooves.",
        genreAnalysis: "Drum and Bass, Techno, and Hardcore punk highlight a high-intensity lifestyle that refuses to slow down for anyone.",
        listeningHabits: "You are the life of the party. Your listening is often social and active, driving the energy of those around you with infectious vibes."
      }
    },
    '07': { // Genre Bender
      audioFeatures: { energy: 0.62, danceability: 0.58, valence: 0.62, acousticness: 0.45, instrumentalness: 0.25, speechiness: 0.15 },
      emotional: { bias: "Universal", maxValence: 72 },
      aiGeneratedText: {
        whyArchetype: "Your data doesn't fit a single mold. You pull from so many different sources that you transcend standard categorization, embodying a truly global perspective.",
        musicalDNA: "You are a global citizen of sound. Your library is a mosaic of different cultures, eras, and languages that shouldn't work together, but do.",
        emotionalLandscape: "Open and curious. You find joy in the unexpected juxtapositions of your eclectic rotation, finding beauty in variety.",
        sonicSignature: "Diverse, vibrant, and refreshingly unpredictable.",
        genreAnalysis: "Your top genres span from K-Pop to Afrobeats and City Pop, demonstrating a world-class curiosity and a complete lack of musical prejudice.",
        listeningHabits: "You are a traveler. You treat every new song as a destination, never staying in one 'sonic country' for too long before moving on."
      }
    },
    '08': { // Lyric Legend
      audioFeatures: { energy: 0.42, danceability: 0.45, valence: 0.52, acousticness: 0.68, instrumentalness: 0.02, speechiness: 0.85 },
      emotional: { bias: "Philosophical", maxValence: 58 },
      aiGeneratedText: {
        whyArchetype: "Your extremely high speechiness score reveals a listener who is obsessed with the word. You are here for the story, the rhyme, and the message.",
        musicalDNA: "For you, the word is paramount. You value narrative clarity, clever wordplay, and the poetic weight of every single syllable delivered.",
        emotionalLandscape: "Intellectual and grounded. You use music to engage with complex stories and diverse human perspectives on a deep level.",
        sonicSignature: "Articulate, narrative, and heavy on lyrical truth.",
        genreAnalysis: "Hip-hop, spoken word, and literary folk suggest you are a person of the word, valuing substance and message over mere style.",
        listeningHabits: "You are an observer. You listen closely to lyrics, often looking up meanings and connecting deeply with the storyteller behind the microphone."
      }
    }
  };

  return {
    ...baseData,
    ...(variations[archetypeId] || variations['04'])
  };
};
