
import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/Buttons';
import { AdPlaceholder } from '../components/AdPlaceholder';

const FAQ_ITEMS = [
  {
    q: "Is my Spotify data safe?",
    a: "Yes. I only access the data Spotify allows through their official API, and I never share it with anyone. Your data is used solely to generate your personalized insights. You can disconnect your account anytime."
  },
  {
    q: "Why do I need to connect my Spotify account?",
    a: "Rewind needs access to your listening history to analyze your music taste and generate your report. Without this data, I can't provide personalized insights."
  },
  {
    q: "How often is my data updated?",
    a: "Your stats and reports update once every 24 hours. This helps manage API costs and ensures high-quality AI analysis."
  },
  {
    q: "Can I delete my data?",
    a: "Absolutely. Disconnect your Spotify account in the Stats page and all your data will be removed from our servers and your local storage."
  }
];

export const AboutPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* The Story Section */}
      <section className="px-12 lg:px-48 pt-32 pb-12 max-w-7xl mx-auto">
        <div className="max-w-7xl">
          <SectionHeader title="Why Rewind Exists" subtitle="THE STORY" />
          <div className="space-y-8 text-gray-600 leading-relaxed text-base md:text-lg max-w-4xl">
            <p>
              I've always been curious about my music taste. Like, why do I keep coming back to certain songs? What does my Spotify say about me beyond just 'you listened to this artist 47 times'? I couldn't find anything that actually answered those questions, so I built Rewind.
            </p>
            <p>
              Most stats apps just throw numbers at you. Rewind digs deeper. It looks at your listening data and tries to make sense of it. What your habits say about you? How your taste has evolved? What kind of listener you actually are?
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-12 lg:px-48 py-20 max-w-7xl mx-auto">
        <SectionHeader title="Under the Hood" subtitle="Technology" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-black/[0.03]">
            <span className="material-symbols-sharp text-accent text-3xl mb-6">api</span>
            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs">Spotify Integration</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              We connect to your Spotify account to access your listening history, top tracks, and favorite artists. This data is cached locally and refreshed once every 24 hours.
            </p>
          </Card>
          <Card className="border-black/[0.03]">
            <span className="material-symbols-sharp text-accent text-3xl mb-6">psychology</span>
            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs">AI Analysis</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Using Gemini AI, we analyze your listening patterns and preferences. AI analysis is resource-intensive, so reports are limited to once per 24 hours. This helps keep Rewind free for everyone.
            </p>
          </Card>
          <Card className="border-black/[0.03]">
            <span className="material-symbols-sharp text-accent text-3xl mb-6">fingerprint</span>
            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs">Your Archetype</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Based on your data, we assign you one of eight listening archetypes. These personality types tell your sonic story and are refreshed daily with your report.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-12 lg:px-48 py-20 max-w-7xl mx-auto border-t border-black/[0.05]">
        <SectionHeader title="Common Questions" subtitle="FAQ" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FAQ_ITEMS.map((item, i) => (
            <Card key={i} className="border-black/[0.03]">
              <h4 className="font-bold text-sm mb-3 uppercase tracking-tight">{item.q}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Ad Section */}
      <section className="px-12 lg:px-48 py-8">
         <AdPlaceholder size="leaderboard" slot="about-page-mid" />
      </section>

      {/* Creator Section */}
      <section className="px-12 lg:px-48 py-20 max-w-7xl mx-auto pb-32">
        <div className="bg-black text-white p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h4 className="font-playfair text-4xl mb-6">The Creator</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              Built by a solo developer and designer who wanted better tools to understand listening habits. If you have feedback, questions, or just want to say hi, reach out on Instagram.
            </p>
          </div>
          <button 
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-accent transition-colors"
            onClick={() => window.open('https://www.instagram.com/kedarr0/', '_blank')}
          >
            @kedarr0
          </button>
        </div>
      </section>
    </div>
  );
};
