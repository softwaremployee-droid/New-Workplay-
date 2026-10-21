import React from 'react';
import { SectionPartWrapper } from './SectionPartWrapper';
import { EditableText } from './EditableText';
import { useStudioBuilder } from '../context/StudioBuilderContext';

interface FooterProps {
  onScrollTo: (id: string) => void;
  onOpenShortlist: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo, onOpenShortlist }) => {
  const { config, updateConfig } = useStudioBuilder();

  return (
    <SectionPartWrapper partId="footer-section" sectionId="footer">
      <footer className="bg-[#0A0A0A] text-white pt-20 pb-12 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
            {/* Big Brand & Statement */}
            <div className="md:col-span-6 space-y-4">
              <div className="inline-block text-xs font-mono-numbers font-bold uppercase tracking-widest text-emerald-400">
                <EditableText
                  value={config.footerTagline || 'Turn your apps into employees.'}
                  onChange={(val) => updateConfig('footerTagline', val)}
                  label="Footer Tagline"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-brand text-3xl sm:text-4xl font-black tracking-tight text-white">
                  <EditableText
                    value={config.footerBrandTitle || 'WorkPlay Studio'}
                    onChange={(val) => updateConfig('footerBrandTitle', val)}
                    label="Footer Brand Title"
                  />
                </div>
                <span className="text-[10px] font-mono-numbers font-bold uppercase px-3 py-1 rounded-full bg-white text-[#111111] tracking-widest">
                  <EditableText
                    value={config.footerBadge || 'Software Employees'}
                    onChange={(val) => updateConfig('footerBadge', val)}
                    label="Footer Badge"
                  />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed font-mono-numbers">
                <EditableText
                  multiline
                  value={
                    config.footerDescription ||
                    'Build, Hire, and Launch Software Employees powered by Software Apps. Stop funding bloated six-figure payrolls for manual app-switching—multiply capacity 15× and cut salary overhead by 82%.'
                  }
                  onChange={(val) => updateConfig('footerDescription', val)}
                  label="Footer Description"
                />
              </p>
              <div className="text-xs font-mono-numbers text-neutral-500">
                Operating 24/7 inside Typeform · HubSpot · Stripe · Slack · Google Sheets · Mailchimp · AirCall · Salesforce · Intercom
              </div>
            </div>

            {/* Directory Links */}
            <div className="md:col-span-3 space-y-3 font-mono-numbers text-xs">
              <h4 className="text-neutral-500 uppercase tracking-widest font-bold">
                Software Employees (06)
              </h4>
              <ul className="space-y-2 text-neutral-300">
                <li>Onboarding Manager ($24k vs $135k)</li>
                <li>Sales Manager ($28k vs $165k)</li>
                <li>Funnel Manager ($22k vs $130k)</li>
                <li>Operations Manager ($26k vs $145k)</li>
                <li>Team Manager ($26k vs $155k)</li>
                <li>Support Manager ($20k vs $120k)</li>
              </ul>
            </div>

            {/* Build Workshops & Direct Inquiries */}
            <div className="md:col-span-3 space-y-3 font-mono-numbers text-xs">
              <h4 className="text-neutral-500 uppercase tracking-widest font-bold">
                Build & Deploy
              </h4>
              <ul className="space-y-2.5 text-neutral-300">
                <li>
                  <button
                    onClick={() => onScrollTo('workshops')}
                    className="text-emerald-400 hover:underline font-bold cursor-pointer"
                  >
                    Join Live Build Workshop →
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onScrollTo('workflow')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    See Apps Run Autonomously
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenShortlist}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Open Hiring Squad (Save $704k/yr)
                  </button>
                </li>
                <li className="pt-2 text-neutral-500">Studio Dispatch:</li>
                <li className="font-bold text-white">
                  <EditableText
                    value={config.footerEmail || 'build@workplaystudio.com'}
                    onChange={(val) => updateConfig('footerEmail', val)}
                    label="Dispatch Email"
                  />
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-numbers text-neutral-500">
            <div>
              © {new Date().getFullYear()} WorkPlay Studio · Software Employees. Zero Burnout. Infinite Capacity.
            </div>
            <div className="flex items-center gap-6">
              <span>15× Capacity</span>
              <span aria-hidden="true">·</span>
              <span>-82% Salary</span>
              <span aria-hidden="true">·</span>
              <span>09 Connected Apps</span>
            </div>
          </div>
        </div>
      </footer>
    </SectionPartWrapper>
  );
};
