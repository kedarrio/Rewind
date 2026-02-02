import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DangerButton } from '../components/Buttons';

export const PrivacyPolicyPage: React.FC = () => {
  const { isConnected, disconnect } = useAuth();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="px-12 lg:px-48 pt-24 pb-12 max-w-7xl mx-auto">
        <SectionHeader title="Privacy Policy" subtitle="Last updated: January 2024" />
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
          Your privacy matters. Here's how I handle your data.
        </p>
      </section>

      {/* Plain Language Summary */}
      <section className="px-12 lg:px-48 py-8 max-w-7xl mx-auto">
        <Card className="bg-surface border-success shadow-[8px_8px_0px_0px_rgba(16,185,129,0.05)]">
          <h3 className="font-bold uppercase tracking-widest text-xs text-success mb-6">The Short Version</h3>
          <ul className="space-y-4 text-gray-600 text-sm md:text-base">
            <li className="flex gap-3">
              <span className="text-success material-symbols-sharp text-sm">check_circle</span>
              <span>I only collect data from Spotify that you explicitly authorize me to access</span>
            </li>
            <li className="flex gap-3">
              <span className="text-success material-symbols-sharp text-sm">check_circle</span>
              <span>I use this data solely to generate your personalized music insights</span>
            </li>
            <li className="flex gap-3">
              <span className="text-success material-symbols-sharp text-sm">check_circle</span>
              <span>I never sell, share, or give your data to anyone</span>
            </li>
            <li className="flex gap-3">
              <span className="text-success material-symbols-sharp text-sm">check_circle</span>
              <span>You can disconnect your account and delete all your data anytime</span>
            </li>
            <li className="flex gap-3">
              <span className="text-success material-symbols-sharp text-sm">check_circle</span>
              <span>I use localStorage to cache your stats and reports for 24 hours</span>
            </li>
            <li className="flex gap-3">
              <span className="text-success material-symbols-sharp text-sm">check_circle</span>
              <span>I display Google ads to keep Rewind free. These are NOT based on your music preferences</span>
            </li>
          </ul>
        </Card>
      </section>

      {/* Detailed Sections */}
      <section className="px-12 lg:px-48 py-20 max-w-7xl mx-auto pb-48">
        <div className="space-y-4">
          <PolicySection title="Information I Collect">
            <p>When you connect your Spotify account, I collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your Spotify username and profile information</li>
              <li>Your top artists and tracks</li>
              <li>Your recently played songs</li>
              <li>Audio features of your music (tempo, energy, mood, etc.)</li>
              <li>Your listening history for selected time periods</li>
            </ul>
            <p className="mt-4">I also collect basic usage data, device information, and cookies for site functionality.</p>
          </PolicySection>

          <PolicySection title="Data Storage and Caching">
            <p>To provide you with a smooth experience and manage server costs, Rewind stores some data locally in your browser's localStorage:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Your Spotify stats and generated AI reports are cached locally</li>
              <li>Timestamps track when you last refreshed stats or generated a report</li>
              <li>Rate Limits: Spotify stats and AI reports can be refreshed once every 24 hours</li>
            </ul>
            <p className="mt-4">If you clear your browser cache, you can refetch your Spotify stats once, but report generation limits still apply server-side.</p>
          </PolicySection>

          <PolicySection title="How I Use Your Information">
            <p>I use your data to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Generate your personalized music insights and reports</li>
              <li>Assign you a listening archetype</li>
              <li>Display stats across different time periods</li>
              <li>Improve analysis accuracy</li>
              <li>Maintain your logged-in session</li>
            </ul>
            <p className="mt-4 font-bold text-black">I do not use your music listening data for advertising purposes.</p>
          </PolicySection>

          <PolicySection title="Advertising and Google AdSense">
            <p>To keep Rewind free, I display advertisements through Google AdSense. Important facts:</p>
            <ul className="list-disc pl-5 mt-4 space-y-3">
              <li><strong>How it works:</strong> Google uses cookies to show personalized ads based on your browsing activity across the web.</li>
              <li><strong>Separation of Data:</strong> These ads are NOT based on your Spotify listening data or music preferences.</li>
              <li><strong>Opt-out:</strong> You can opt out of personalized ads at <a href="https://www.google.com/settings/ads" target="_blank" className="underline text-accent">Google's Ads Settings</a>.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Data Sharing">
            <p>I do not sell, trade, or share your personal data with third parties.</p>
            <p className="mt-4">Exception: I use Gemini AI to analyze your music data. This data is processed securely and is not stored by Google beyond what's necessary for analysis.</p>
          </PolicySection>

          <PolicySection title="Data Security">
            <p>I take reasonable measures to protect your data from unauthorized access, including encrypted connections and secure authentication through Spotify's official OAuth system.</p>
            {isConnected ? (
              <div className="mt-8 pt-6 border-t border-black/5 flex flex-col items-start gap-4">
                <p className="text-xs text-gray-500 mb-2">You are currently connected to Spotify. You can revoke access and delete all locally stored data below.</p>
                <DangerButton 
                  label="Disconnect Spotify" 
                  icon="logout" 
                  onClick={handleDisconnect}
                />
              </div>
            ) : (
              <p className="mt-4 text-xs italic text-gray-400">You are not currently connected to Spotify.</p>
            )}
          </PolicySection>

          <PolicySection title="Your Rights">
            <p>You have the right to access your data, request deletion by disconnecting, and opt out of personalized advertising. Contact me at @kedarr0 on Instagram with questions.</p>
          </PolicySection>
        </div>
      </section>
    </div>
  );
};

const PolicySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group border-b border-black/5 last:border-0">
    <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
      <h4 className="font-bold text-sm uppercase tracking-widest">{title}</h4>
      <span className="material-symbols-sharp group-open:rotate-180 transition-transform duration-300">expand_more</span>
    </summary>
    <div className="pb-8 text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-300">
      {children}
    </div>
  </details>
);