
export interface Archetype {
  id: string;
  name: string;
  trait: string;
  description: string;
  oneliner: string;
  icon: string;
  bgText: string;
}

export const ARCHETYPES: Archetype[] = [
  { 
    id: '01', 
    name: 'The Time Traveler', 
    trait: 'Nostalgic', 
    description: 'Your heart beats for the classics. You find comfort in the melodies of decades past.', 
    oneliner: 'Revisiting the golden eras of sound.',
    icon: 'history', 
    bgText: 'TIME_TVL' 
  },
  { 
    id: '02', 
    name: 'The Trendsetter', 
    trait: 'Forward-thinking', 
    description: 'You are the first to find the next big hit. Your library is a preview of next year\'s charts.', 
    oneliner: 'Defining the future, one track at a time.',
    icon: 'trending_up', 
    bgText: 'TREND_ST' 
  },
  { 
    id: '03', 
    name: 'The Deep Diver', 
    trait: 'Completionist', 
    description: 'You don\'t just listen; you study. Discographies are your playground, B-sides are your gems.', 
    oneliner: 'Exploring the depths beyond the surface.',
    icon: 'water', 
    bgText: 'DEPTH_DV' 
  },
  { 
    id: '04', 
    name: 'The Mood Architect', 
    trait: 'Atmospheric', 
    description: 'Music is your environment. You curate specific soundtracks for every feeling and moment.', 
    oneliner: 'Crafting sonic atmospheres for every waking moment.',
    icon: 'architecture', 
    bgText: 'MOOD_ARC' 
  },
  { 
    id: '05', 
    name: 'The Soul Seeker', 
    trait: 'Emotional', 
    description: 'Vulnerability is your strength. You gravitate towards music that echoes the depths of the human heart.', 
    oneliner: 'Searching for meaning in every melody.',
    icon: 'favorite', 
    bgText: 'SOUL_SK' 
  },
  { 
    id: '06', 
    name: 'The Rhythm Rebel', 
    trait: 'Energetic', 
    description: 'Beat is your language. You live for high-energy drops, syncopated patterns, and unstoppable grooves.', 
    oneliner: 'Driven by the power of the pulse.',
    icon: 'bolt', 
    bgText: 'RHYM_RB' 
  },
  { 
    id: '07', 
    name: 'The Genre Bender', 
    trait: 'Eclectic', 
    description: 'Borders don\'t exist for you. Your taste spans continents and eras in a single sitting.', 
    oneliner: 'Defying categories across the sonic spectrum.',
    icon: 'category', 
    bgText: 'GENR_BD' 
  },
  { 
    id: '08', 
    name: 'The Lyric Legend', 
    trait: 'Poetic', 
    description: 'Every word matters. You value songwriting craftsmanship and stories that linger long after the track ends.', 
    oneliner: 'Finding poetry in the space between notes.',
    icon: 'auto_stories', 
    bgText: 'LYRC_LG' 
  }
];
