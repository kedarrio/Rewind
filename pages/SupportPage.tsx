
import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';

export const SupportPage: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Support Section */}
      <section className="px-12 lg:px-48 pt-32 pb-16 max-w-7xl mx-auto">
        <SectionHeader title="Support Rewind" subtitle="Contributions" />
        <div className="max-w-3xl">
          <p className="text-gray-600 mb-6 leading-relaxed">
            Rewind is free to use and always will be. To keep it that way, we limit report generation to once per 24 hours to manage AI costs.
          </p>
          <p className="text-gray-600 mb-10 leading-relaxed">
            If you find Rewind valuable and want to help cover server and AI costs, consider buying me a coffee. Every contribution helps keep the app running and allows us to potentially offer more frequent updates for supporters in the future.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <PrimaryButton 
                label="Buy Me a Coffee" 
                className="w-full"
                onClick={() => window.open('https://buymeacoffee.com/kedarr', '_blank')}
              />
              <p className="text-[9px] font-bold text-center uppercase tracking-widest text-black/30">International Supporters</p>
            </div>
            <div className="space-y-4">
              <SecondaryButton 
                label="OnlyChai" 
                className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                onClick={() => window.open('https://onlychai.neocities.org/support.html?name=Kedar&upi=kedarmulay@upi#', '_blank')}
              />
              <p className="text-[9px] font-bold text-center uppercase tracking-widest text-black/30">For Indian Supporters (UPI)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-12 lg:px-48 py-12 max-w-7xl mx-auto pb-48">
        <Card className="border-black/[0.05]">
          <h3 className="font-playfair text-4xl mb-6">Reach Out</h3>
          <p className="text-gray-600 mb-8 max-w-2xl leading-relaxed">
            Have a question about how Rewind works? Running into issues? Want to share feedback or suggest a feature? The best way to reach me is on Instagram. DM me anytime.
          </p>
          <div className="flex items-center gap-6">
            <PrimaryButton 
              label="DM @kedarr0" 
              icon="send"
              onClick={() => window.open('https://www.instagram.com/kedarr0/', '_blank')}
            />
          </div>
        </Card>
      </section>
    </div>
  );
};
