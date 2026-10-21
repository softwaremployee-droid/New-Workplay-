import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Candidate, CANDIDATES } from '../data/talent';
import { PlatformType } from '../components/PlatformLogo';
import { soundFx } from '../utils/sound';
import {
  idbGet,
  idbSet,
  loadAllEmployeeMediaFromVault,
  recoverCandidateMediaSync,
  safeLocalStorageSet,
  saveEmployeeMediaToVault,
} from '../utils/persistentStorage';

export type SectionId = 'lineup' | 'workflow' | 'workshops' | 'faq';

export type PartId =
  | 'header-brand'
  | 'lineup-headline'
  | 'lineup-subheadline'
  | 'lineup-apps-marquee'
  | 'lineup-employees-runway'
  | 'workflow-header'
  | 'workflow-stages-grid'
  | 'workflow-roi-console'
  | 'workflow-playbook-card'
  | 'workflow-roi-card'
  | 'workshops-header'
  | 'workshops-tracks-grid'
  | 'workshops-build-card'
  | 'faq-header'
  | 'faq-accordion-list'
  | 'faq-guarantee-banner'
  | 'footer-section';

export interface PartDefinition {
  id: PartId;
  sectionId: SectionId | 'header' | 'footer';
  label: string;
  description: string;
}

export const PART_DEFINITIONS: Record<PartId, PartDefinition> = {
  'header-brand': {
    id: 'header-brand',
    sectionId: 'header',
    label: 'Header Brand Pill',
    description: 'WorkPlay Studio floating company brand pill.',
  },
  'lineup-headline': {
    id: 'lineup-headline',
    sectionId: 'lineup',
    label: 'Hero Headline & Tagline',
    description: 'Main header ("Turn your apps into employees") and 90% savings tagline.',
  },
  'lineup-subheadline': {
    id: 'lineup-subheadline',
    sectionId: 'lineup',
    label: 'Hero Subheadline Copy',
    description: 'Tagline copy directly below the main hero headline.',
  },
  'lineup-apps-marquee': {
    id: 'lineup-apps-marquee',
    sectionId: 'lineup',
    label: 'Software Apps Marquee',
    description: 'Animated showcase of the 9 connected software applications.',
  },
  'lineup-employees-runway': {
    id: 'lineup-employees-runway',
    sectionId: 'lineup',
    label: 'Software Employees Runway',
    description: 'Corporate headshot cutouts with roles, salaries, and resumes.',
  },
  'workflow-header': {
    id: 'workflow-header',
    sectionId: 'workflow',
    label: 'Workflow Header & Trigger',
    description: 'Section title, subheadline, and Execute Full App Workflow button.',
  },
  'workflow-stages-grid': {
    id: 'workflow-stages-grid',
    sectionId: 'workflow',
    label: '6-Stage Pipeline Grid',
    description: 'Interactive stage cards with assigned employees and operated apps.',
  },
  'workflow-roi-console': {
    id: 'workflow-roi-console',
    sectionId: 'workflow',
    label: 'Live Playbook & Squad ROI Console',
    description: 'Active stage trigger/execution breakdown and payroll savings card.',
  },
  'workflow-playbook-card': {
    id: 'workflow-playbook-card',
    sectionId: 'workflow',
    label: 'Live App Playbook Card',
    description: 'Left console card showing active stage trigger and execution.',
  },
  'workflow-roi-card': {
    id: 'workflow-roi-card',
    sectionId: 'workflow',
    label: 'Full Squad ROI Card',
    description: 'Right console card showing traditional vs software payroll savings.',
  },
  'workshops-header': {
    id: 'workshops-header',
    sectionId: 'workshops',
    label: 'Workshops Section Header',
    description: 'Live Workshops headline, description, and anchor button.',
  },
  'workshops-tracks-grid': {
    id: 'workshops-tracks-grid',
    sectionId: 'workshops',
    label: '3 Live Workshop Tracks',
    description: 'Funnel & Onboarding, Sales & RevOps, and Support & Team workshop cards.',
  },
  'workshops-build-card': {
    id: 'workshops-build-card',
    sectionId: 'workshops',
    label: 'Build Call-to-Action & Registration',
    description: 'Interactive 9-app stack selector and live workshop seat reservation form.',
  },
  'faq-header': {
    id: 'faq-header',
    sectionId: 'faq',
    label: 'FAQ Text Header & Filters',
    description: 'FAQ text header, headline, search bar, and category filter pills.',
  },
  'faq-accordion-list': {
    id: 'faq-accordion-list',
    sectionId: 'faq',
    label: 'FAQ Questions & Answers List',
    description: 'Expandable questions and answers with highlight tags.',
  },
  'faq-guarantee-banner': {
    id: 'faq-guarantee-banner',
    sectionId: 'faq',
    label: '14-Day Guarantee Banner',
    description: 'Bottom zero-risk performance guarantee callout box.',
  },
  'footer-section': {
    id: 'footer-section',
    sectionId: 'footer',
    label: 'Site Footer',
    description: 'Bottom navigation and copyright footer.',
  },
};

export type CustomBlockType =
  | 'kpi-strip'
  | 'cta-banner'
  | 'app-strip'
  | 'roi-comparison'
  | 'text-callout';

export interface CustomBlockMetric {
  value: string;
  label: string;
  subtext: string;
}

export interface CustomBlockItem {
  id: string;
  sectionId: SectionId;
  type: CustomBlockType;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaTarget: 'workshops' | 'workflow' | 'lineup' | 'faq';
  apps: PlatformType[];
  metrics: CustomBlockMetric[];
}

export type SelectedTarget =
  | { kind: 'part'; sectionId: SectionId | 'header' | 'footer'; partId: PartId }
  | { kind: 'employee'; candidateId: string; index: number }
  | { kind: 'stage'; stageIndex: number }
  | { kind: 'workshop'; workshopIndex: number }
  | { kind: 'faq'; faqIndex: number }
  | { kind: 'custom-block'; blockId: string; sectionId: SectionId };

export type EntranceEffect =
  | 'none'
  | 'fade-up'
  | 'scale-in'
  | 'slide-left'
  | 'slide-right'
  | 'spring-pop';

export type HoverEffect =
  | 'none'
  | 'lift'
  | 'scale'
  | 'glow-emerald'
  | 'border-highlight';

export type ClickInteraction =
  | 'none'
  | 'scroll-workshops'
  | 'scroll-workflow'
  | 'scroll-faq'
  | 'scroll-top'
  | 'pulse-highlight';

export type SurfaceStyle =
  | 'default'
  | 'card-white'
  | 'glass'
  | 'emerald-tint'
  | 'dark-contrast';

export type PaddingScale = 'default' | 'compact' | 'spacious';
export type TextAlignOption = 'default' | 'left' | 'center' | 'right';
export type DeviceVisibility = 'all' | 'desktop-only' | 'mobile-only';
export type FontScaleOption = 'default' | 'compact' | 'large';

export interface ComponentInteractionConfig {
  entrance: EntranceEffect;
  hover: HoverEffect;
  clickAction: ClickInteraction;
  duration: number;
  surface: SurfaceStyle;
  paddingScale?: PaddingScale;
  textAlign?: TextAlignOption;
  deviceVisibility?: DeviceVisibility;
  fontScale?: FontScaleOption;
  locked?: boolean;
}

export const DEFAULT_INTERACTION_CONFIG: ComponentInteractionConfig = {
  entrance: 'none',
  hover: 'none',
  clickAction: 'none',
  duration: 0.45,
  surface: 'default',
  paddingScale: 'default',
  textAlign: 'default',
  deviceVisibility: 'all',
  fontScale: 'default',
  locked: false,
};

export interface WorkflowStageItem {
  id: string;
  stageNumber: string;
  candidateId: string;
  title: string;
  trigger: string;
  action: string;
  outcome: string;
  apps: PlatformType[];
}

export interface WorkshopTrackItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  schedule: string;
  duration: string;
  seatsLeft: number;
  apps: PlatformType[];
  outcomes: string[];
  employeeRoleBuilt: string;
}

export interface FaqItemData {
  id: string;
  q: string;
  a: string;
  category: 'savings' | 'apps' | 'operations' | 'guarantee';
  highlight?: string;
}

export interface SectionConfig {
  showHeroBadge: boolean;
  heroBadgeText: string;
  heroHeadline: string;
  showHeroTab: boolean;
  heroTabText: string;
  showHeroSubheadline: boolean;
  heroSubheadline: string;
  showHeroAppMarquee: boolean;
  showHeaderBrandPill: boolean;
  headerBrandText: string;
  workflowBadge: string;
  workflowHeadline: string;
  workflowSubheadline: string;
  workflowRoiTitle: string;
  workflowRoiBadge: string;
  workshopsBadge: string;
  workshopsHeadline: string;
  workshopsSubheadline: string;
  buildCardBadge: string;
  buildCardHeadline: string;
  buildCardSubheadline: string;
  buildFormTitle: string;
  faqTitle: string;
  faqBadge: string;
  faqHeadline: string;
  faqSubheadline: string;
  faqGuaranteeTitle: string;
  faqGuaranteeText: string;
  faqGuaranteeCta: string;
  footerTagline: string;
  footerBrandTitle: string;
  footerBadge: string;
  footerDescription: string;
  footerEmail: string;
}

export type DraggedPayload =
  | { type: 'app'; appId: PlatformType }
  | { type: 'employee'; candidateId: string; fromIndex?: number }
  | { type: 'stage'; stageIndex: number }
  | { type: 'workshop'; workshopIndex: number }
  | { type: 'section'; sectionId: SectionId; fromIndex: number }
  | { type: 'part'; sectionId: SectionId; partId: PartId; fromIndex: number }
  | { type: 'faq'; faqIndex: number };

export interface StudioStateSnapshot {
  id: string;
  label: string;
  timestamp: string;
  sectionOrder: SectionId[];
  hiddenSections: SectionId[];
  sectionParts: Record<SectionId, PartId[]>;
  hiddenParts: PartId[];
  config: SectionConfig;
  candidates: Candidate[];
  workflowStages: WorkflowStageItem[];
  workshopTracks: WorkshopTrackItem[];
  faqs: FaqItemData[];
  interactions: Record<string, ComponentInteractionConfig>;
  customBlocks: CustomBlockItem[];
}

export interface SavedVersionCheckpoint {
  id: string;
  name: string;
  savedAt: string;
  isPinnedBaseline?: boolean;
  snapshot: StudioStateSnapshot;
}

const DEFAULT_SECTION_PARTS: Record<SectionId, PartId[]> = {
  lineup: ['lineup-headline', 'lineup-apps-marquee', 'lineup-employees-runway'],
  workflow: ['workflow-header', 'workflow-stages-grid', 'workflow-roi-console'],
  workshops: ['workshops-header', 'workshops-tracks-grid', 'workshops-build-card'],
  faq: ['faq-header', 'faq-accordion-list', 'faq-guarantee-banner'],
};

const DEFAULT_WORKFLOW_STAGES: WorkflowStageItem[] = [
  {
    id: 'stage-1',
    stageNumber: 'STAGE 01',
    candidateId: 'employee-1-onboarding',
    title: 'Instant Client Intake & Provisioning',
    trigger: 'Client submits Typeform onboarding survey',
    action:
      'Auto-creates HubSpot deal room, spins up dedicated Slack channel & logs milestones in Google Sheets.',
    outcome: '90-second zero-touch onboarding (14× capacity)',
    apps: ['typeform', 'hubspot', 'slack', 'google-sheets'],
  },
  {
    id: 'stage-2',
    stageNumber: 'STAGE 02',
    candidateId: 'employee-2-sales',
    title: 'Autonomous Speed-to-Lead & Closing',
    trigger: 'High-intent enterprise lead captured',
    action:
      'Dials in 8 seconds via AirCall, updates Salesforce & HubSpot pipeline, and dispatches Stripe checkout link.',
    outcome: '41% win-rate lift with $0 sales commission (18× capacity)',
    apps: ['aircall', 'salesforce', 'hubspot', 'stripe'],
  },
  {
    id: 'stage-3',
    stageNumber: 'STAGE 03',
    candidateId: 'employee-6-support',
    title: '24/7 Omnichannel Support Triage',
    trigger: 'Customer opens Intercom chat or VIP AirCall line',
    action:
      'Resolves 94% of tier-1/2 tickets in 12 seconds inside Intercom, routes VIP calls on AirCall & posts CSAT to Slack.',
    outcome: '12-second response SLA & 99.6% CSAT (25× capacity)',
    apps: ['intercom', 'aircall', 'slack', 'hubspot'],
  },
  {
    id: 'stage-4',
    stageNumber: 'STAGE 04',
    candidateId: 'employee-3-funnel',
    title: 'Full-Funnel Conversion & Nurture',
    trigger: 'Prospect lands on acquisition flow',
    action:
      'Adapts Typeform branching logic, segments HubSpot lifecycle lists, fires Mailchimp drips & converts on Stripe.',
    outcome: '+54% trial-to-paid conversion lift (15× capacity)',
    apps: ['typeform', 'mailchimp', 'hubspot', 'stripe'],
  },
  {
    id: 'stage-5',
    stageNumber: 'STAGE 05',
    candidateId: 'employee-4-operations',
    title: 'Zero-Leakage RevOps & Billing Audit',
    trigger: 'Stripe invoice webhook or Salesforce contract update',
    action:
      'Reconciles Stripe subscriptions against Salesforce terms, updates live Google Sheets P&L & alerts finance in Slack.',
    outcome: '$240k/yr recovered revenue & zero manual spreadsheets (20× capacity)',
    apps: ['stripe', 'google-sheets', 'salesforce', 'slack'],
  },
  {
    id: 'stage-6',
    stageNumber: 'STAGE 06',
    candidateId: 'employee-5-team',
    title: 'Async Standups & Executive SLA Control',
    trigger: 'Daily 9:00 AM sprint check & live queue telemetry',
    action:
      'Runs async standups in Slack, clears HubSpot & Intercom bottlenecks, and publishes live KPIs to Google Sheets.',
    outcome: 'Zero status meetings & 100% SLA adherence (12× capacity)',
    apps: ['slack', 'google-sheets', 'hubspot', 'intercom'],
  },
];

const DEFAULT_WORKSHOP_TRACKS: WorkshopTrackItem[] = [
  {
    id: 'workshop-funnel-onboarding',
    code: 'WORKSHOP 01',
    title: 'Funnel & Onboarding Build',
    subtitle: 'Build an autonomous acquisition & client activation Software Employee.',
    schedule: 'Tuesdays & Thursdays · 1:00 PM EST',
    duration: '90 Min Hands-On Build',
    seatsLeft: 4,
    apps: ['typeform', 'hubspot', 'mailchimp'],
    employeeRoleBuilt: 'Funnel & Onboarding Manager',
    outcomes: [
      'Connect Typeform qualification flows directly into HubSpot CRM lifecycle stages.',
      'Trigger personalized Mailchimp onboarding sequences based on user responses.',
      'Launch a self-driving Onboarding Employee that activates accounts in under 6 days.',
    ],
  },
  {
    id: 'workshop-sales-revops',
    code: 'WORKSHOP 02',
    title: 'Sales & Revenue Ops Build',
    subtitle: 'Build a high-velocity deal closing & automated billing Software Employee.',
    schedule: 'Wednesdays · 2:00 PM EST',
    duration: '90 Min Hands-On Build',
    seatsLeft: 3,
    apps: ['aircall', 'salesforce', 'stripe'],
    employeeRoleBuilt: 'Sales & Operations Manager',
    outcomes: [
      'Orchestrate instant AirCall cloud voice dialing for high-intent inbound leads.',
      'Automate multi-threaded enterprise pipeline updates inside Salesforce.',
      'Sync closed-won contracts to Stripe for zero-touch subscription invoicing.',
    ],
  },
  {
    id: 'workshop-support-team',
    code: 'WORKSHOP 03',
    title: 'Support & Team Delivery Build',
    subtitle: 'Build a 24/7 customer triage & daily sprint coordination Software Employee.',
    schedule: 'Fridays · 12:00 PM EST',
    duration: '90 Min Hands-On Build',
    seatsLeft: 5,
    apps: ['intercom', 'slack', 'google-sheets'],
    employeeRoleBuilt: 'Support & Team Manager',
    outcomes: [
      'Deploy sub-5-minute SLA customer triage and guided resolutions in Intercom.',
      'Automate daily async team standups and escalation routing in Slack.',
      'Maintain live executive KPI scorecards and capacity ledgers in Google Sheets.',
    ],
  },
];

const DEFAULT_FAQS: FaqItemData[] = [
  {
    id: 'faq-1',
    category: 'savings',
    q: 'How do we build a software employee at a 90% savings compared to traditional hiring?',
    a: 'A traditional mid-to-senior operations or sales manager costs $120,000 to $175,000 annually in base salary, plus 25% overhead in payroll taxes, healthcare, equipment, SaaS seats, and recruitment fees. A WorkPlay Studio Software Employee performs the identical operational, sales, or support role for an average of $16,800/yr—delivering an immediate 82% to 90% net savings while operating 24/7/365 with zero downtime.',
    highlight: '90% Cost Reduction & Zero Overhead',
  },
  {
    id: 'faq-2',
    category: 'apps',
    q: 'How do Software Employees actually operate inside our existing software applications?',
    a: 'Software Employees live natively inside your existing software stack: Typeform, HubSpot, Stripe, Slack, Google Sheets, Mailchimp, AirCall, Salesforce, and Intercom. When an event occurs—such as a Typeform lead submission, an AirCall incoming call, an Intercom support ticket, or a Stripe invoice webhook—your Software Employee executes the entire multi-app playbook in seconds through authorized API integrations.',
    highlight: 'Native API & Webhook Execution',
  },
  {
    id: 'faq-3',
    category: 'operations',
    q: 'How much execution capacity does a single Software Employee add to our team?',
    a: 'A single Software Employee operates at 12× to 25× the volume of a traditional human hire. They can simultaneously manage 500 concurrent client onboarding tracks, resolve 1,000 tier-1/2 Intercom and AirCall support requests in under 12 seconds, or reconcile 50,000 Stripe transactions against Google Sheets and Salesforce without manual copy-pasting or clerical fatigue.',
    highlight: '12× to 25× Real-World Output',
  },
  {
    id: 'faq-4',
    category: 'operations',
    q: 'Do we need a technical or engineering team to build and maintain Software Employees?',
    a: 'No engineering required. WorkPlay Studio handles the full architectural wiring, prompt orchestration, state persistence, and cross-application handshakes. You can deploy pre-configured roles in minutes or participate in a 90-minute Live Workshop to wire your exact internal workflows.',
    highlight: 'Zero Engineering Overhead',
  },
  {
    id: 'faq-5',
    category: 'apps',
    q: 'Can we clone an existing Software Employee or customize them for our bespoke workflows?',
    a: 'Yes. Every Software Employee in the studio roster can be cloned with custom operational parameters, customized app credentials, dedicated Slack channels, and proprietary SOP playbooks. You can clone an employee to run a specialized regional desk, a specific enterprise customer tier, or a new brand division.',
    highlight: 'Instant 1-Click Role Cloning',
  },
  {
    id: 'faq-6',
    category: 'operations',
    q: 'What happens inside a live 90-minute Build Workshop?',
    a: 'In a 90-minute live interactive session, our enterprise architects work directly with your team to connect your actual business apps (Typeform, HubSpot, Stripe, Slack, etc.). By the time the workshop concludes, your custom Software Employee is fully configured, tested, and live in your production environment.',
    highlight: 'Live Production Deployment in 90 Min',
  },
  {
    id: 'faq-7',
    category: 'guarantee',
    q: 'What is your 14-day zero-risk trial and performance guarantee?',
    a: 'Every Software Employee comes with an unconditional 14-day performance guarantee. Deploy them in your live production environment. If they do not immediately increase team capacity and eliminate operational bottlenecks, you can cancel with one click. No contracts, no severance packages, and no awkward HR exit interviews.',
    highlight: '14-Day Performance Guarantee',
  },
  {
    id: 'faq-8',
    category: 'guarantee',
    q: 'How do you protect our company data, API credentials, and client privacy?',
    a: 'Your security is paramount. Software Employees connect directly to your applications via scoped, least-privilege OAuth tokens and API secrets stored in your dedicated environment. We never train public foundation models on your proprietary company data, client rosters, or transaction ledgers.',
    highlight: 'Enterprise-Grade Security & Scoped OAuth',
  },
];

const DEFAULT_SECTION_CONFIG: SectionConfig = {
  showHeroBadge: false,
  heroBadgeText: 'Turn your apps into employees.',
  heroHeadline: 'Turn your apps into employees',
  showHeroTab: false,
  heroTabText: 'Software Employees',
  showHeroSubheadline: true,
  heroSubheadline:
    'Reduce salaries by 90% with autonomous software employees powered by your apps.',
  showHeroAppMarquee: true,
  showHeaderBrandPill: true,
  headerBrandText: 'WorkPlay Studio',
  workflowBadge: '6 SOFTWARE EMPLOYEES · 9 CONNECTED APPS · LIVE EXECUTION',
  workflowHeadline: 'Build a software employee at a 90% savings',
  workflowSubheadline:
    'Every Software Employee operates directly inside the software applications your company already uses—multiplying team capacity up to 25× and cutting six-figure salaries by 82%.',
  workflowRoiTitle: 'Full 6-Employee Squad ROI',
  workflowRoiBadge: '-82% Payroll',
  workshopsBadge: 'WORKPLAY STUDIO WORKSHOPS · CALL TO ACTION FOR BUILD',
  workshopsHeadline: 'Live Workshops',
  workshopsSubheadline:
    'Turn your apps into employees. Join our live interactive workshops to learn how to Build, Hire, and Launch Software Employees powered by Software Apps—connecting Typeform, HubSpot, Stripe, Slack, Google Sheets, Mailchimp, AirCall, Salesforce, and Intercom in 90 minutes.',
  buildCardBadge: 'BUILD · WORKPLAY STUDIO WORKSHOP',
  buildCardHeadline: 'Ready to Build Your Own Software Employees?',
  buildCardSubheadline:
    'Select the Software Apps in your stack below and reserve your seat in the next WorkPlay Studio Build Workshop. Turn your apps into employees running 24/7 inside your existing tools.',
  buildFormTitle: 'Start with Build',
  faqTitle: 'FAQ',
  faqBadge: 'MORE CAPACITY · 90% SALARY SAVINGS · ZERO CORPORATE FLUFF',
  faqHeadline: 'Hard Questions. Zero Corporate Fluff.',
  faqSubheadline:
    'Direct, transparent answers on cost structure, application integration, execution capacity, and our 14-day performance guarantee.',
  faqGuaranteeTitle: '14-Day Zero-Risk Performance Guarantee',
  faqGuaranteeText:
    'Every Software Employee executes inside your live workflow risk-free for two weeks. If they don’t save at least 20 hours/week, terminate with one click.',
  faqGuaranteeCta: 'Review Software Employees',
  footerTagline: 'Turn your apps into employees.',
  footerBrandTitle: 'WorkPlay Studio',
  footerBadge: 'Software Employees',
  footerDescription:
    'Build, Hire, and Launch Software Employees powered by Software Apps. Stop funding bloated six-figure payrolls for manual app-switching—multiply capacity 15× and cut salary overhead by 82%.',
  footerEmail: 'build@workplaystudio.com',
};

export const getTargetInteractionKey = (target: SelectedTarget | null): string => {
  if (!target) return '';
  if (target.kind === 'part') return `part:${target.partId}`;
  if (target.kind === 'employee') return `employee:${target.candidateId}`;
  if (target.kind === 'stage') return `stage:${target.stageIndex}`;
  if (target.kind === 'workshop') return `workshop:${target.workshopIndex}`;
  if (target.kind === 'faq') return `faq:${target.faqIndex}`;
  if (target.kind === 'custom-block') return `block:${target.blockId}`;
  return '';
};

interface StudioBuilderContextValue {
  isBuilderMode: boolean;
  setIsBuilderMode: (val: boolean) => void;
  isBarVisible: boolean;
  setIsBarVisible: (val: boolean) => void;
  hidePreviewBar: () => void;
  showPreviewBar: () => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (val: boolean) => void;
  activeSection: SectionId | 'header' | 'footer' | null;
  setActiveSection: (sec: SectionId | 'header' | 'footer' | null) => void;
  selectedTarget: SelectedTarget | null;
  setSelectedTarget: (target: SelectedTarget | null) => void;
  selectAndEditTarget: (target: SelectedTarget) => void;
  sectionOrder: SectionId[];
  moveSection: (fromIndex: number, toIndex: number) => void;
  hiddenSections: SectionId[];
  toggleSectionVisibility: (sec: SectionId) => void;
  sectionParts: Record<SectionId, PartId[]>;
  movePartInSection: (sectionId: SectionId, fromIndex: number, toIndex: number) => void;
  hiddenParts: PartId[];
  togglePartVisibility: (partId: PartId) => void;
  deletePart: (partId: PartId) => void;
  config: SectionConfig;
  updateConfig: <K extends keyof SectionConfig>(key: K, value: SectionConfig[K]) => void;
  candidates: Candidate[];
  updateCandidate: (id: string, patch: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  duplicateCandidate: (id: string) => void;
  reorderCandidates: (fromIndex: number, toIndex: number) => void;
  replaceAllCandidatePhotos: (photoUrls: string[]) => void;
  workflowStages: WorkflowStageItem[];
  updateWorkflowStage: (index: number, patch: Partial<WorkflowStageItem>) => void;
  deleteWorkflowStage: (index: number) => void;
  duplicateWorkflowStage: (index: number) => void;
  addWorkflowStage: () => void;
  reorderWorkflowStages: (fromIndex: number, toIndex: number) => void;
  dropAppOnStage: (stageIndex: number, appId: PlatformType) => void;
  removeAppFromStage: (stageIndex: number, appId: PlatformType) => void;
  dropEmployeeOnStage: (stageIndex: number, candidateId: string) => void;
  workshopTracks: WorkshopTrackItem[];
  updateWorkshopTrack: (index: number, patch: Partial<WorkshopTrackItem>) => void;
  deleteWorkshopTrack: (index: number) => void;
  duplicateWorkshopTrack: (index: number) => void;
  addWorkshopTrack: () => void;
  reorderWorkshopTracks: (fromIndex: number, toIndex: number) => void;
  dropAppOnWorkshop: (workshopIndex: number, appId: PlatformType) => void;
  removeAppFromWorkshop: (workshopIndex: number, appId: PlatformType) => void;
  faqs: FaqItemData[];
  updateFaq: (index: number, patch: Partial<FaqItemData>) => void;
  reorderFaqs: (fromIndex: number, toIndex: number) => void;
  addFaq: () => void;
  duplicateFaq: (index: number) => void;
  deleteFaq: (index: number) => void;
  // Custom Blocks Builder
  customBlocks: CustomBlockItem[];
  addCustomBlock: (sectionId: SectionId, type: CustomBlockType) => void;
  updateCustomBlock: (blockId: string, patch: Partial<CustomBlockItem>) => void;
  duplicateCustomBlock: (blockId: string) => void;
  deleteCustomBlock: (blockId: string) => void;
  moveCustomBlock: (blockId: string, direction: 'up' | 'down') => void;
  // Interactions & Style Copy/Paste
  interactions: Record<string, ComponentInteractionConfig>;
  getInteractionForKey: (key: string) => ComponentInteractionConfig;
  updateInteractionForKey: (
    key: string,
    patch: Partial<ComponentInteractionConfig>
  ) => void;
  copiedInteractionStyle: ComponentInteractionConfig | null;
  copyStyleFromKey: (key: string) => void;
  pasteStyleToKey: (key: string) => void;
  previewPulseKey: Record<string, number>;
  triggerInteractionPreview: (key: string) => void;
  // Undo / Redo / Version History (Command-Z)
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyPast: StudioStateSnapshot[];
  historyFuture: StudioStateSnapshot[];
  revertToSnapshot: (index: number) => void;
  // Explicit Save Version Checkpoints (Command-S)
  savedVersions: SavedVersionCheckpoint[];
  saveCurrentVersion: (customName?: string) => void;
  restoreSavedVersion: (versionId: string) => void;
  deleteSavedVersion: (versionId: string) => void;
  renameSavedVersion: (versionId: string, newName: string) => void;
  exportCurrentVersionJson: () => void;
  importVersionJson: (jsonString: string) => boolean;
  draggedItem: DraggedPayload | null;
  setDraggedItem: (item: DraggedPayload | null) => void;
  resetAllToDefaults: () => void;
  lastSavedMessage: string | null;
  notifySaved: (msg: string) => void;
}

const StudioBuilderContext = createContext<StudioBuilderContextValue | null>(null);

const STORAGE_KEY = 'workplay_studio_modular_parts_v6';
const SAVED_VERSIONS_STORAGE_KEY = 'workplay_studio_saved_versions_v1';
const MAX_HISTORY = 45;

const LEGACY_DEFAULT_NAMES = [
  'Marcus Vance',
  'Julian Vance',
  'Sophie Laurent',
  'Linnea Lindqvist',
  'Maya Lin',
  'David Kim',
];
const LEGACY_DEFAULT_SALARIES = [24000, 28000, 20000, 22000, 26000, 16800];

function normalizeCandidatesList(rawList: Candidate[] | undefined): Candidate[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return recoverCandidateMediaSync(CANDIDATES);
  }
  const migrated = rawList.map((c) => {
    const defaultMatch = CANDIDATES.find((d) => d.id === c.id);
    if (!defaultMatch) return c;

    const hasLegacySalary = LEGACY_DEFAULT_SALARIES.includes(c.annualSalaryUsd);
    const hasLegacyName = LEGACY_DEFAULT_NAMES.includes(c.name);
    const hasLegacyRole =
      c.role === 'Funnel Manager' || c.role === 'Team Manager';

    return {
      ...defaultMatch,
      ...c,
      name: hasLegacyName ? defaultMatch.name : c.name || defaultMatch.name,
      role: hasLegacyRole ? defaultMatch.role : c.role || defaultMatch.role,
      annualSalaryUsd: hasLegacySalary
        ? defaultMatch.annualSalaryUsd
        : c.annualSalaryUsd || defaultMatch.annualSalaryUsd,
      traditionalSalaryUsd: hasLegacySalary
        ? defaultMatch.traditionalSalaryUsd
        : c.traditionalSalaryUsd || defaultMatch.traditionalSalaryUsd,
      dayRateUsd: hasLegacySalary
        ? defaultMatch.dayRateUsd
        : c.dayRateUsd || defaultMatch.dayRateUsd,
      imageSrc: c.imageSrc || defaultMatch.imageSrc,
    };
  });

  return recoverCandidateMediaSync(migrated);
}

function loadInitialStudioPayloadSync() {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore storage read errors
  }
  return null;
}

export const StudioBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialSaved = useRef(loadInitialStudioPayloadSync()).current;

  const [isBuilderMode, setIsBuilderMode] = useState<boolean>(true);
  const [isBarVisible, setIsBarVisible] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<
    SectionId | 'header' | 'footer' | null
  >('lineup');
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(null);
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(['lineup']);
  const [hiddenSections, setHiddenSections] = useState<SectionId[]>(() =>
    Array.isArray(initialSaved?.hiddenSections) ? initialSaved.hiddenSections : []
  );
  const [sectionParts, setSectionParts] = useState<Record<SectionId, PartId[]>>(
    () =>
      initialSaved?.sectionParts
        ? { ...DEFAULT_SECTION_PARTS, ...initialSaved.sectionParts }
        : DEFAULT_SECTION_PARTS
  );
  const [hiddenParts, setHiddenParts] = useState<PartId[]>(() =>
    Array.isArray(initialSaved?.hiddenParts)
      ? (initialSaved.hiddenParts as PartId[]).filter((p) => p !== 'faq-header')
      : []
  );
  const [config, setConfig] = useState<SectionConfig>(() =>
    initialSaved?.config
      ? { ...DEFAULT_SECTION_CONFIG, ...initialSaved.config }
      : DEFAULT_SECTION_CONFIG
  );
  const [candidates, setCandidates] = useState<Candidate[]>(() =>
    normalizeCandidatesList(initialSaved?.candidates)
  );
  const [workflowStages, setWorkflowStages] = useState<WorkflowStageItem[]>(() =>
    Array.isArray(initialSaved?.workflowStages) &&
    initialSaved.workflowStages.length > 0
      ? initialSaved.workflowStages
      : DEFAULT_WORKFLOW_STAGES
  );
  const [workshopTracks, setWorkshopTracks] = useState<WorkshopTrackItem[]>(() =>
    Array.isArray(initialSaved?.workshopTracks) &&
    initialSaved.workshopTracks.length > 0
      ? initialSaved.workshopTracks
      : DEFAULT_WORKSHOP_TRACKS
  );
  const [faqs, setFaqs] = useState<FaqItemData[]>(() =>
    Array.isArray(initialSaved?.faqs) && initialSaved.faqs.length > 0
      ? initialSaved.faqs
      : DEFAULT_FAQS
  );
  const [customBlocks, setCustomBlocks] = useState<CustomBlockItem[]>(() =>
    Array.isArray(initialSaved?.customBlocks) ? initialSaved.customBlocks : []
  );
  const [interactions, setInteractions] = useState<
    Record<string, ComponentInteractionConfig>
  >(() =>
    initialSaved?.interactions && typeof initialSaved.interactions === 'object'
      ? initialSaved.interactions
      : {}
  );
  const [copiedInteractionStyle, setCopiedInteractionStyle] =
    useState<ComponentInteractionConfig | null>(null);
  const [previewPulseKey, setPreviewPulseKey] = useState<Record<string, number>>({});

  // History Stacks for Command-Z (Undo) & Command-Shift-Z (Redo)
  const [historyPast, setHistoryPast] = useState<StudioStateSnapshot[]>([]);
  const [historyFuture, setHistoryFuture] = useState<StudioStateSnapshot[]>([]);

  // Explicit Named Saved Versions (Command-S)
  const [savedVersions, setSavedVersions] = useState<SavedVersionCheckpoint[]>(
    () => {
      if (typeof window === 'undefined') return [];
      try {
        const raw = localStorage.getItem(SAVED_VERSIONS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
      return [];
    }
  );

  const [draggedItem, setDraggedItem] = useState<DraggedPayload | null>(null);
  const [lastSavedMessage, setLastSavedMessage] = useState<string | null>(null);
  const isHydratedRef = useRef<boolean>(false);

  // Refs to current state for synchronous snapshot creation
  const stateRef = useRef({
    sectionOrder,
    hiddenSections,
    sectionParts,
    hiddenParts,
    config,
    candidates,
    workflowStages,
    workshopTracks,
    faqs,
    interactions,
    customBlocks,
  });

  useEffect(() => {
    stateRef.current = {
      sectionOrder,
      hiddenSections,
      sectionParts,
      hiddenParts,
      config,
      candidates,
      workflowStages,
      workshopTracks,
      faqs,
      interactions,
      customBlocks,
    };
  }, [
    sectionOrder,
    hiddenSections,
    sectionParts,
    hiddenParts,
    config,
    candidates,
    workflowStages,
    workshopTracks,
    faqs,
    interactions,
    customBlocks,
  ]);

  const notifySaved = useCallback((msg: string) => {
    setLastSavedMessage(msg);
    setTimeout(() => {
      setLastSavedMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  }, []);

  const hidePreviewBar = useCallback(() => {
    soundFx.playTick();
    setIsInspectorOpen(false);
    setIsBuilderMode(false);
    setIsBarVisible(false);
    notifySaved('Preview bar hidden · Press ⌘E or hover bottom-right corner to reopen');
  }, [notifySaved]);

  const showPreviewBar = useCallback(() => {
    soundFx.playPop();
    setIsBarVisible(true);
    setIsBuilderMode(true);
    notifySaved('Editor bar restored');
  }, [notifySaved]);

  const createSnapshot = useCallback((label: string): StudioStateSnapshot => {
    const s = stateRef.current;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return {
      id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      label,
      timestamp: timeStr,
      sectionOrder: [...s.sectionOrder],
      hiddenSections: [...s.hiddenSections],
      sectionParts: JSON.parse(JSON.stringify(s.sectionParts)),
      hiddenParts: [...s.hiddenParts],
      config: { ...s.config },
      candidates: JSON.parse(JSON.stringify(s.candidates)),
      workflowStages: JSON.parse(JSON.stringify(s.workflowStages)),
      workshopTracks: JSON.parse(JSON.stringify(s.workshopTracks)),
      faqs: JSON.parse(JSON.stringify(s.faqs)),
      interactions: JSON.parse(JSON.stringify(s.interactions)),
      customBlocks: JSON.parse(JSON.stringify(s.customBlocks)),
    };
  }, []);

  const recordHistory = useCallback(
    (actionLabel: string) => {
      const snap = createSnapshot(actionLabel);
      setHistoryPast((prev) => [...prev.slice(-(MAX_HISTORY - 1)), snap]);
      setHistoryFuture([]);
    },
    [createSnapshot]
  );

  const applySnapshot = useCallback((snap: StudioStateSnapshot) => {
    setSectionOrder(snap.sectionOrder);
    setHiddenSections(snap.hiddenSections);
    setSectionParts(snap.sectionParts);
    setHiddenParts(snap.hiddenParts);
    setConfig({ ...DEFAULT_SECTION_CONFIG, ...snap.config });
    setCandidates(snap.candidates);
    setWorkflowStages(snap.workflowStages);
    setWorkshopTracks(snap.workshopTracks);
    setFaqs(snap.faqs);
    setInteractions(snap.interactions || {});
    setCustomBlocks(snap.customBlocks || []);
  }, []);

  const undo = useCallback(() => {
    setHistoryPast((prevPast) => {
      if (prevPast.length === 0) {
        notifySaved('Already at earliest version');
        return prevPast;
      }
      const previousSnap = prevPast[prevPast.length - 1];
      const currentSnap = createSnapshot(previousSnap.label);
      setHistoryFuture((prevFuture) => [
        currentSnap,
        ...prevFuture.slice(0, MAX_HISTORY - 1),
      ]);
      applySnapshot(previousSnap);
      soundFx.playTick();
      notifySaved(`⌘Z Undid: ${previousSnap.label}`);
      return prevPast.slice(0, -1);
    });
  }, [applySnapshot, createSnapshot, notifySaved]);

  const redo = useCallback(() => {
    setHistoryFuture((prevFuture) => {
      if (prevFuture.length === 0) {
        notifySaved('Nothing to redo');
        return prevFuture;
      }
      const nextSnap = prevFuture[0];
      const currentSnap = createSnapshot(nextSnap.label);
      setHistoryPast((prevPast) => [...prevPast.slice(-(MAX_HISTORY - 1)), currentSnap]);
      applySnapshot(nextSnap);
      soundFx.playPop();
      notifySaved(`⇧⌘Z Redid: ${nextSnap.label}`);
      return prevFuture.slice(1);
    });
  }, [applySnapshot, createSnapshot, notifySaved]);

  const revertToSnapshot = useCallback(
    (index: number) => {
      if (index < 0 || index >= historyPast.length) return;
      const targetSnap = historyPast[index];
      const currentSnap = createSnapshot('Before version restore');
      setHistoryPast((prev) => [...prev.slice(0, index), currentSnap]);
      setHistoryFuture([]);
      applySnapshot(targetSnap);
      soundFx.playPop();
      notifySaved(`Restored version from ${targetSnap.timestamp}`);
    },
    [applySnapshot, createSnapshot, historyPast, notifySaved]
  );

  // Explicit Save Version Checkpoint (Command-S)
  const saveCurrentVersion = useCallback(
    (customName?: string) => {
      const now = new Date();
      const formattedTime = now.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const snap = createSnapshot(customName || 'Saved Version');
      setSavedVersions((prev) => {
        const versionNum = prev.length + 1;
        const name =
          customName && customName.trim().length > 0
            ? customName.trim()
            : `Saved Version #${versionNum}`;
        const newCheckpoint: SavedVersionCheckpoint = {
          id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name,
          savedAt: formattedTime,
          isPinnedBaseline: true,
          snapshot: snap,
        };
        const updated = [
          newCheckpoint,
          ...prev.map((v) => ({ ...v, isPinnedBaseline: false })),
        ].slice(0, 15);
        try {
          localStorage.setItem(SAVED_VERSIONS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Quota exceeded in localStorage; store in IndexedDB below
        }
        void idbSet(SAVED_VERSIONS_STORAGE_KEY, updated);
        void saveEmployeeMediaToVault(snap.candidates);
        soundFx.playHireChime();
        notifySaved(`✓ Saved "${name}" (${formattedTime})`);
        return updated;
      });
    },
    [createSnapshot, notifySaved]
  );

  const restoreSavedVersion = useCallback(
    (versionId: string) => {
      const found = savedVersions.find((v) => v.id === versionId);
      if (!found) return;
      recordHistory(`Before restoring "${found.name}"`);
      applySnapshot(found.snapshot);
      soundFx.playHireChime();
      notifySaved(`✓ Restored "${found.name}" (Press ⌘Z to undo)`);
    },
    [applySnapshot, notifySaved, recordHistory, savedVersions]
  );

  const deleteSavedVersion = useCallback(
    (versionId: string) => {
      setSavedVersions((prev) => {
        const updated = prev.filter((v) => v.id !== versionId);
        try {
          localStorage.setItem(SAVED_VERSIONS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        void idbSet(SAVED_VERSIONS_STORAGE_KEY, updated);
        return updated;
      });
      soundFx.playTick();
      notifySaved('Removed saved version');
    },
    [notifySaved]
  );

  const renameSavedVersion = useCallback(
    (versionId: string, newName: string) => {
      if (!newName.trim()) return;
      setSavedVersions((prev) => {
        const updated = prev.map((v) =>
          v.id === versionId ? { ...v, name: newName.trim() } : v
        );
        try {
          localStorage.setItem(SAVED_VERSIONS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        void idbSet(SAVED_VERSIONS_STORAGE_KEY, updated);
        return updated;
      });
      notifySaved(`Renamed version to "${newName.trim()}"`);
    },
    [notifySaved]
  );

  const exportCurrentVersionJson = useCallback(() => {
    const snap = createSnapshot('Exported Studio Version');
    const blob = new Blob([JSON.stringify(snap, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workplay-studio-version-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundFx.playPop();
    notifySaved('Downloaded version JSON backup');
  }, [createSnapshot, notifySaved]);

  const importVersionJson = useCallback(
    (jsonString: string): boolean => {
      try {
        const parsed = JSON.parse(jsonString);
        const snap: StudioStateSnapshot = parsed.snapshot || parsed;
        if (!snap || !snap.config || !snap.sectionOrder) {
          notifySaved('Invalid version JSON file');
          return false;
        }
        recordHistory('Before importing version JSON');
        applySnapshot(snap);
        soundFx.playHireChime();
        notifySaved('✓ Imported & restored studio version (⌘Z to undo)');
        return true;
      } catch {
        notifySaved('Could not parse version JSON file');
        return false;
      }
    },
    [applySnapshot, notifySaved, recordHistory]
  );

  // Global Command-Z, Command-Shift-Z, Command-S, and Command-E keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Command-E / Ctrl+E or Command-\ -> Toggle Preview/Editor Bar Visibility
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key.toLowerCase() === 'e' || e.key === '\\')
      ) {
        e.preventDefault();
        setIsBarVisible((prev) => {
          const next = !prev;
          if (next) {
            setIsBuilderMode(true);
            notifySaved('Editor bar shown (⌘E)');
          } else {
            setIsBuilderMode(false);
            setIsInspectorOpen(false);
            notifySaved('Preview bar hidden (Press ⌘E to reopen)');
          }
          return next;
        });
        return;
      }

      // Command-S / Ctrl+S -> Save Current Version Checkpoint
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveCurrentVersion();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          return;
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y' && !isInput) {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === 'Escape' && !isInput) {
        if (selectedTarget) {
          setSelectedTarget(null);
          setIsInspectorOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveCurrentVersion, selectedTarget, notifySaved]);

  const selectAndEditTarget = (target: SelectedTarget) => {
    setIsBarVisible(true);
    setSelectedTarget(target);
    if (target.kind === 'part') {
      setActiveSection(target.sectionId);
    } else if (target.kind === 'employee') {
      setActiveSection('lineup');
    } else if (target.kind === 'stage') {
      setActiveSection('workflow');
    } else if (target.kind === 'workshop') {
      setActiveSection('workshops');
    } else if (target.kind === 'faq') {
      setActiveSection('faq');
    } else if (target.kind === 'custom-block') {
      setActiveSection(target.sectionId);
    }
    setIsInspectorOpen(true);
  };

  // Hydrate high-resolution photos & resumes from IndexedDB vault on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [vaultPayload, mediaMap, idbSavedVersions] = await Promise.all([
          idbGet<Record<string, unknown>>(STORAGE_KEY),
          loadAllEmployeeMediaFromVault(),
          idbGet<SavedVersionCheckpoint[]>(SAVED_VERSIONS_STORAGE_KEY),
        ]);

        if (cancelled) return;

        if (vaultPayload && typeof vaultPayload === 'object') {
          if (vaultPayload.config) {
            setConfig((prev) => ({
              ...DEFAULT_SECTION_CONFIG,
              ...(vaultPayload.config as SectionConfig),
              ...prev,
            }));
          }
        }

        // Merge any high-res photos & uploaded resumes from the IndexedDB media vault
        setCandidates((prev) => {
          const base =
            Array.isArray(vaultPayload?.candidates) &&
            (vaultPayload.candidates as Candidate[]).length > 0
              ? normalizeCandidatesList(vaultPayload.candidates as Candidate[])
              : prev;

          return base.map((c, idx) => {
            const current = prev[idx] && prev[idx].id === c.id ? prev[idx] : c;
            const vaultMedia = mediaMap[c.id];
            const bestImageSrc =
              current.imageSrc && current.imageSrc.startsWith('data:')
                ? current.imageSrc
                : vaultMedia?.imageSrc && vaultMedia.imageSrc.startsWith('data:')
                ? vaultMedia.imageSrc
                : current.imageSrc || vaultMedia?.imageSrc || c.imageSrc;

            const bestResumeUrl =
              current.resumeUrl || vaultMedia?.resumeUrl || c.resumeUrl;
            const bestResumeFileName =
              current.resumeFileName ||
              vaultMedia?.resumeFileName ||
              c.resumeFileName;
            const bestResumeMimeType =
              current.resumeMimeType ||
              vaultMedia?.resumeMimeType ||
              c.resumeMimeType;

            return {
              ...c,
              ...current,
              imageSrc: bestImageSrc,
              resumeUrl: bestResumeUrl,
              resumeFileName: bestResumeFileName,
              resumeMimeType: bestResumeMimeType,
            };
          });
        });

        if (Array.isArray(idbSavedVersions) && idbSavedVersions.length > 0) {
          setSavedVersions(idbSavedVersions);
        }
      } finally {
        if (!cancelled) {
          isHydratedRef.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Automatically pin & save this version of the website & studio builder if no pinned baseline exists
  useEffect(() => {
    if (!isHydratedRef.current) return;
    if (savedVersions.length === 0) {
      const now = new Date();
      const formattedTime = now.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const snap = createSnapshot('Pinned Website & Studio Builder Version');
      const baselineCheckpoint: SavedVersionCheckpoint = {
        id: 'ver-pinned-baseline-v1',
        name: 'Saved Website & Studio Builder Version',
        savedAt: formattedTime,
        isPinnedBaseline: true,
        snapshot: snap,
      };
      setSavedVersions([baselineCheckpoint]);
      try {
        localStorage.setItem(
          SAVED_VERSIONS_STORAGE_KEY,
          JSON.stringify([baselineCheckpoint])
        );
      } catch {
        // ignore quota error
      }
      void idbSet(SAVED_VERSIONS_STORAGE_KEY, [baselineCheckpoint]);
    }
  }, [candidates, createSnapshot, savedVersions.length]);

  // Persist all changes to both quota-safe localStorage and unlimited IndexedDB vault
  useEffect(() => {
    const payload = {
      sectionOrder,
      hiddenSections,
      sectionParts,
      hiddenParts,
      config,
      candidates,
      workflowStages,
      workshopTracks,
      faqs,
      interactions,
      customBlocks,
    };
    safeLocalStorageSet(STORAGE_KEY, payload);
    void idbSet(STORAGE_KEY, payload);
    void saveEmployeeMediaToVault(candidates);

    // Sync any custom uploaded employee cutout photos & resumes directly into /src/assets/images/
    const hasCustomMedia = candidates.some(
      (c) =>
        (typeof c.imageSrc === 'string' && c.imageSrc.startsWith('data:image/')) ||
        Boolean(c.resumeUrl)
    );
    if (hasCustomMedia) {
      fetch('/api/sync-src-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidates: candidates.map((c) => ({
            id: c.id,
            imageSrc: c.imageSrc,
            resumeUrl: c.resumeUrl,
            resumeFileName: c.resumeFileName,
            resumeMimeType: c.resumeMimeType,
          })),
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.ok && data.updatedCount > 0) {
            notifySaved(
              `✓ Synced ${data.updatedCount} employee cutout photo(s) into /src/assets/images for GitHub`
            );
          }
        })
        .catch(() => {
          // Ignore in static production hosting where dev middleware is absent
        });
    }
  }, [
    sectionOrder,
    hiddenSections,
    sectionParts,
    hiddenParts,
    config,
    candidates,
    workflowStages,
    workshopTracks,
    faqs,
    interactions,
    customBlocks,
    notifySaved,
  ]);

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= sectionOrder.length) return;
    recordHistory('Reorder sections');
    setSectionOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    notifySaved('Section order updated (⌘Z to undo)');
  };

  const toggleSectionVisibility = (sec: SectionId) => {
    recordHistory(`Toggle ${sec} section visibility`);
    setHiddenSections((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
    notifySaved('Section visibility updated (⌘Z to undo)');
  };

  const movePartInSection = (
    sectionId: SectionId,
    fromIndex: number,
    toIndex: number
  ) => {
    const list = sectionParts[sectionId];
    if (!list || fromIndex === toIndex || toIndex < 0 || toIndex >= list.length) return;
    recordHistory('Reorder section parts');
    setSectionParts((prev) => {
      const nextList = [...prev[sectionId]];
      const [moved] = nextList.splice(fromIndex, 1);
      nextList.splice(toIndex, 0, moved);
      return { ...prev, [sectionId]: nextList };
    });
    notifySaved('Part order updated (⌘Z to undo)');
  };

  const togglePartVisibility = (partId: PartId) => {
    recordHistory(`Toggle ${PART_DEFINITIONS[partId]?.label || partId}`);
    setHiddenParts((prev) =>
      prev.includes(partId) ? prev.filter((p) => p !== partId) : [...prev, partId]
    );
    notifySaved('Component visibility updated (⌘Z to undo)');
  };

  const deletePart = (partId: PartId) => {
    const key = `part:${partId}`;
    if (interactions[key]?.locked) {
      notifySaved('Component is locked — unlock in Inspector first');
      return;
    }
    recordHistory(`Delete ${PART_DEFINITIONS[partId]?.label || 'component'}`);
    setHiddenParts((prev) => (prev.includes(partId) ? prev : [...prev, partId]));
    if (selectedTarget?.kind === 'part' && selectedTarget.partId === partId) {
      setSelectedTarget(null);
    }
    notifySaved(
      `Deleted ${PART_DEFINITIONS[partId]?.label || 'component'} (Press ⌘Z to undo)`
    );
  };

  const updateConfig = <K extends keyof SectionConfig>(
    key: K,
    value: SectionConfig[K]
  ) => {
    if (config[key] === value) return;
    recordHistory(`Edit ${String(key)}`);
    setConfig((prev) => ({ ...prev, [key]: value }));
    notifySaved('Updated copy (⌘Z to undo)');
  };

  const updateCandidate = (id: string, patch: Partial<Candidate>) => {
    recordHistory('Edit employee details');
    if ('resumeUrl' in patch && !patch.resumeUrl) {
      try {
        localStorage.removeItem(`workplay_emp_resume_${id}`);
      } catch {
        // ignore
      }
    }
    if ('imageSrc' in patch && patch.imageSrc) {
      try {
        localStorage.setItem(`workplay_emp_photo_${id}`, patch.imageSrc);
      } catch {
        // ignore quota
      }
    }
    if ('resumeUrl' in patch && patch.resumeUrl) {
      try {
        localStorage.setItem(
          `workplay_emp_resume_${id}`,
          JSON.stringify({
            resumeUrl: patch.resumeUrl,
            resumeFileName: patch.resumeFileName,
            resumeMimeType: patch.resumeMimeType,
          })
        );
      } catch {
        // ignore quota
      }
    }
    setCandidates((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
      void saveEmployeeMediaToVault(next);
      return next;
    });
    notifySaved('Employee saved (⌘Z to undo)');
  };

  const deleteCandidate = (id: string) => {
    if (candidates.length <= 1) return;
    const emp = candidates.find((c) => c.id === id);
    recordHistory(`Delete employee ${emp?.role || ''}`);
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    if (selectedTarget?.kind === 'employee' && selectedTarget.candidateId === id) {
      setSelectedTarget(null);
    }
    notifySaved('Deleted employee (Press ⌘Z to undo)');
  };

  const duplicateCandidate = (id: string) => {
    const idx = candidates.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const source = candidates[idx];
    recordHistory(`Clone employee ${source.role}`);
    const clone: Candidate = {
      ...JSON.parse(JSON.stringify(source)),
      id: `${source.id}-clone-${Date.now().toString(36).slice(-4)}`,
      name: `${source.name} (Clone)`,
    };
    setCandidates((prev) => {
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    notifySaved(`Cloned ${source.role} (⌘Z to undo)`);
  };

  const reorderCandidates = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= candidates.length) return;
    recordHistory('Reorder employees');
    setCandidates((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    notifySaved('Employee runway reordered (⌘Z to undo)');
  };

  const replaceAllCandidatePhotos = (photoUrls: string[]) => {
    recordHistory('Replace all employee headshots');
    setCandidates((prev) => {
      const next = prev.map((c, idx) => {
        if (photoUrls[idx]) {
          try {
            localStorage.setItem(`workplay_emp_photo_${c.id}`, photoUrls[idx]);
          } catch {
            // ignore quota
          }
          return { ...c, imageSrc: photoUrls[idx] };
        }
        return c;
      });
      void saveEmployeeMediaToVault(next);
      return next;
    });
    notifySaved('All employee headshots saved (⌘Z to undo)');
  };

  const updateWorkflowStage = (index: number, patch: Partial<WorkflowStageItem>) => {
    recordHistory(`Edit Stage 0${index + 1}`);
    setWorkflowStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
    notifySaved('Workflow stage updated (⌘Z to undo)');
  };

  const deleteWorkflowStage = (index: number) => {
    if (workflowStages.length <= 1) return;
    recordHistory(`Delete Stage 0${index + 1}`);
    setWorkflowStages((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((stage, idx) => ({
          ...stage,
          stageNumber: `STAGE 0${idx + 1}`,
        }))
    );
    if (selectedTarget?.kind === 'stage' && selectedTarget.stageIndex === index) {
      setSelectedTarget(null);
    }
    notifySaved('Deleted workflow stage (Press ⌘Z to undo)');
  };

  const duplicateWorkflowStage = (index: number) => {
    const source = workflowStages[index];
    if (!source) return;
    recordHistory(`Clone ${source.stageNumber}`);
    setWorkflowStages((prev) => {
      const clone: WorkflowStageItem = {
        ...JSON.parse(JSON.stringify(source)),
        id: `stage-${Date.now()}`,
        title: `${source.title} (Copy)`,
      };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next.map((stage, idx) => ({
        ...stage,
        stageNumber: `STAGE 0${idx + 1}`,
      }));
    });
    notifySaved(`Cloned ${source.stageNumber} (⌘Z to undo)`);
  };

  const addWorkflowStage = () => {
    recordHistory('Add new workflow stage');
    setWorkflowStages((prev) => {
      const nextIdx = prev.length + 1;
      const newStage: WorkflowStageItem = {
        id: `stage-${Date.now()}`,
        stageNumber: `STAGE 0${nextIdx}`,
        candidateId: candidates[0]?.id || 'employee-1-onboarding',
        title: 'Custom Autonomous App Stage',
        trigger: 'Webhook or event captured in connected app',
        action: 'Executes cross-app workflow automatically in under 10 seconds.',
        outcome: '100% automated execution (15× capacity)',
        apps: ['hubspot', 'slack', 'stripe'],
      };
      return [...prev, newStage];
    });
    notifySaved('Added new workflow stage (⌘Z to undo)');
  };

  const reorderWorkflowStages = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= workflowStages.length) return;
    recordHistory('Reorder workflow stages');
    setWorkflowStages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((stage, idx) => ({
        ...stage,
        stageNumber: `STAGE 0${idx + 1}`,
      }));
    });
    notifySaved('Workflow stages reordered (⌘Z to undo)');
  };

  const dropAppOnStage = (stageIndex: number, appId: PlatformType) => {
    const stage = workflowStages[stageIndex];
    if (!stage || stage.apps.includes(appId)) return;
    recordHistory(`Add ${appId} to Stage 0${stageIndex + 1}`);
    setWorkflowStages((prev) =>
      prev.map((s, i) => (i === stageIndex ? { ...s, apps: [...s.apps, appId] } : s))
    );
    notifySaved(`Added ${appId} to Stage 0${stageIndex + 1} (⌘Z to undo)`);
  };

  const removeAppFromStage = (stageIndex: number, appId: PlatformType) => {
    recordHistory(`Remove ${appId} from Stage 0${stageIndex + 1}`);
    setWorkflowStages((prev) =>
      prev.map((s, i) =>
        i === stageIndex ? { ...s, apps: s.apps.filter((a) => a !== appId) } : s
      )
    );
    notifySaved(`Removed ${appId} from Stage 0${stageIndex + 1} (⌘Z to undo)`);
  };

  const dropEmployeeOnStage = (stageIndex: number, candidateId: string) => {
    recordHistory(`Assign employee to Stage 0${stageIndex + 1}`);
    setWorkflowStages((prev) =>
      prev.map((s, i) => (i === stageIndex ? { ...s, candidateId } : s))
    );
    const emp = candidates.find((c) => c.id === candidateId);
    notifySaved(
      `Assigned ${emp?.name || 'Employee'} to Stage 0${stageIndex + 1} (⌘Z to undo)`
    );
  };

  const updateWorkshopTrack = (index: number, patch: Partial<WorkshopTrackItem>) => {
    recordHistory(`Edit Workshop 0${index + 1}`);
    setWorkshopTracks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t))
    );
    notifySaved('Workshop track updated (⌘Z to undo)');
  };

  const deleteWorkshopTrack = (index: number) => {
    if (workshopTracks.length <= 1) return;
    recordHistory(`Delete Workshop 0${index + 1}`);
    setWorkshopTracks((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((t, idx) => ({
          ...t,
          code: `WORKSHOP 0${idx + 1}`,
        }))
    );
    if (selectedTarget?.kind === 'workshop' && selectedTarget.workshopIndex === index) {
      setSelectedTarget(null);
    }
    notifySaved('Deleted workshop track (Press ⌘Z to undo)');
  };

  const duplicateWorkshopTrack = (index: number) => {
    const source = workshopTracks[index];
    if (!source) return;
    recordHistory(`Clone ${source.code}`);
    setWorkshopTracks((prev) => {
      const clone: WorkshopTrackItem = {
        ...JSON.parse(JSON.stringify(source)),
        id: `workshop-${Date.now()}`,
        title: `${source.title} (Copy)`,
      };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next.map((t, idx) => ({
        ...t,
        code: `WORKSHOP 0${idx + 1}`,
      }));
    });
    notifySaved(`Cloned ${source.code} (⌘Z to undo)`);
  };

  const addWorkshopTrack = () => {
    recordHistory('Add new workshop track');
    setWorkshopTracks((prev) => {
      const nextIdx = prev.length + 1;
      const newTrack: WorkshopTrackItem = {
        id: `workshop-${Date.now()}`,
        code: `WORKSHOP 0${nextIdx}`,
        title: 'Custom App Automation Build',
        subtitle: 'Build a bespoke Software Employee wired to your internal app stack.',
        schedule: 'Thursdays · 3:00 PM EST',
        duration: '90 Min Hands-On Build',
        seatsLeft: 4,
        apps: ['hubspot', 'slack', 'stripe'],
        employeeRoleBuilt: 'Custom Operations Manager',
        outcomes: [
          'Connect your primary trigger app directly to Slack and CRM workflows.',
          'Configure autonomous validation and instant customer follow-ups.',
          'Deploy your live Software Employee before the 90-minute session ends.',
        ],
      };
      return [...prev, newTrack];
    });
    notifySaved('Added new workshop track (⌘Z to undo)');
  };

  const reorderWorkshopTracks = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= workshopTracks.length) return;
    recordHistory('Reorder workshop tracks');
    setWorkshopTracks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((t, idx) => ({
        ...t,
        code: `WORKSHOP 0${idx + 1}`,
      }));
    });
    notifySaved('Workshop tracks reordered (⌘Z to undo)');
  };

  const dropAppOnWorkshop = (workshopIndex: number, appId: PlatformType) => {
    const track = workshopTracks[workshopIndex];
    if (!track || track.apps.includes(appId)) return;
    recordHistory(`Add ${appId} to Workshop 0${workshopIndex + 1}`);
    setWorkshopTracks((prev) =>
      prev.map((t, i) =>
        i === workshopIndex ? { ...t, apps: [...t.apps, appId] } : t
      )
    );
    notifySaved(`Added ${appId} to Workshop 0${workshopIndex + 1} (⌘Z to undo)`);
  };

  const removeAppFromWorkshop = (workshopIndex: number, appId: PlatformType) => {
    recordHistory(`Remove ${appId} from Workshop 0${workshopIndex + 1}`);
    setWorkshopTracks((prev) =>
      prev.map((t, i) =>
        i === workshopIndex ? { ...t, apps: t.apps.filter((a) => a !== appId) } : t
      )
    );
    notifySaved(`Removed ${appId} from Workshop 0${workshopIndex + 1} (⌘Z to undo)`);
  };

  const updateFaq = (index: number, patch: Partial<FaqItemData>) => {
    recordHistory(`Edit FAQ Q${index + 1}`);
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
    notifySaved('FAQ updated (⌘Z to undo)');
  };

  const reorderFaqs = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= faqs.length) return;
    recordHistory('Reorder FAQs');
    setFaqs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    notifySaved('FAQ order updated (⌘Z to undo)');
  };

  const addFaq = () => {
    recordHistory('Add new FAQ item');
    setFaqs((prev) => [
      ...prev,
      {
        id: `faq-${Date.now()}`,
        category: 'operations',
        q: 'New Question — Click to Edit',
        a: 'Click here to write a direct, zero-fluff answer for this question.',
        highlight: 'Custom Highlight',
      },
    ]);
    notifySaved('Added new FAQ item (⌘Z to undo)');
  };

  const duplicateFaq = (index: number) => {
    const source = faqs[index];
    if (!source) return;
    recordHistory(`Clone FAQ Q${index + 1}`);
    setFaqs((prev) => {
      const clone: FaqItemData = {
        ...source,
        id: `faq-${Date.now()}`,
        q: `${source.q} (Copy)`,
      };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
    notifySaved(`Cloned FAQ #${index + 1} (⌘Z to undo)`);
  };

  const deleteFaq = (index: number) => {
    if (faqs.length <= 1) return;
    recordHistory(`Delete FAQ Q${index + 1}`);
    setFaqs((prev) => prev.filter((_, i) => i !== index));
    if (selectedTarget?.kind === 'faq' && selectedTarget.faqIndex === index) {
      setSelectedTarget(null);
    }
    notifySaved('Deleted FAQ item (Press ⌘Z to undo)');
  };

  // Custom Block Builder Logic
  const addCustomBlock = (sectionId: SectionId, type: CustomBlockType) => {
    recordHistory(`Insert ${type} block in ${sectionId}`);
    const newId = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const defaultsByType: Record<CustomBlockType, Omit<CustomBlockItem, 'id' | 'sectionId'>> = {
      'kpi-strip': {
        type: 'kpi-strip',
        badge: 'LIVE CAPACITY METRICS',
        title: 'Autonomous Software Employee Output',
        subtitle: 'Real-time operational benchmarks running across your connected software stack.',
        ctaText: 'Explore Live Workshops',
        ctaTarget: 'workshops',
        apps: ['typeform', 'hubspot', 'stripe', 'slack'],
        metrics: [
          {
            value: '15×',
            label: 'Execution Capacity',
            subtext: 'Simultaneous multi-app task execution',
          },
          {
            value: '-90%',
            label: 'Salary Overhead',
            subtext: '$16.8k/yr vs $145k traditional hire',
          },
          {
            value: '24/7/365',
            label: 'Zero Downtime SLA',
            subtext: 'Instant webhook & API response',
          },
        ],
      },
      'cta-banner': {
        type: 'cta-banner',
        badge: 'WORKPLAY STUDIO · DIRECT DEPLOYMENT',
        title: 'Turn Your Existing Software Stack Into a 24/7 Team',
        subtitle:
          'Deploy pre-wired Software Employees inside Typeform, HubSpot, Stripe, Slack, and Intercom in under 90 minutes.',
        ctaText: 'Join Live Build Workshop',
        ctaTarget: 'workshops',
        apps: ['typeform', 'hubspot', 'stripe', 'slack', 'intercom'],
        metrics: [],
      },
      'app-strip': {
        type: 'app-strip',
        badge: 'CONNECTED APPS ECOSYSTEM',
        title: 'Native Execution Across Your Core Business Applications',
        subtitle: 'Click or drag apps to customize which tools this block highlights.',
        ctaText: 'See 6-Stage Workflow',
        ctaTarget: 'workflow',
        apps: [
          'typeform',
          'hubspot',
          'stripe',
          'slack',
          'google-sheets',
          'mailchimp',
          'aircall',
          'salesforce',
          'intercom',
        ],
        metrics: [],
      },
      'roi-comparison': {
        type: 'roi-comparison',
        badge: 'PAYROLL VS SOFTWARE EMPLOYEE',
        title: 'Why Teams Replace Manual App-Switching With Software Employees',
        subtitle: 'Direct side-by-side comparison of annual operational cost and throughput.',
        ctaText: 'Review Software Employees',
        ctaTarget: 'lineup',
        apps: ['hubspot', 'salesforce', 'stripe', 'slack'],
        metrics: [
          {
            value: '$145,000/yr',
            label: 'Traditional Human Manager',
            subtext: '1× capacity · Manual copy-pasting · 40 hrs/week',
          },
          {
            value: '$24,000/yr',
            label: 'WorkPlay Software Employee',
            subtext: '15× capacity · Native API execution · 24/7/365',
          },
          {
            value: '$121,000/yr',
            label: 'Net Annual Savings Per Role',
            subtext: 'Backed by our 14-day zero-risk performance guarantee',
          },
        ],
      },
      'text-callout': {
        type: 'text-callout',
        badge: 'STUDIO ARCHITECTURE NOTE',
        title: 'Zero Engineering Required. Built Live With Your Team.',
        subtitle:
          'Every Software Employee is wired directly to your production OAuth credentials with strict least-privilege security.',
        ctaText: 'Read Direct Hire FAQ',
        ctaTarget: 'faq',
        apps: ['slack', 'hubspot'],
        metrics: [],
      },
    };

    const created: CustomBlockItem = {
      id: newId,
      sectionId,
      ...defaultsByType[type],
    };

    setCustomBlocks((prev) => [...prev, created]);
    setSelectedTarget({ kind: 'custom-block', blockId: newId, sectionId });
    setIsInspectorOpen(true);
    soundFx.playHireChime();
    notifySaved(`Inserted custom block into ${sectionId.toUpperCase()} (⌘Z to undo)`);
  };

  const updateCustomBlock = (blockId: string, patch: Partial<CustomBlockItem>) => {
    recordHistory('Edit custom block');
    setCustomBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...patch } : b))
    );
    notifySaved('Custom block updated (⌘Z to undo)');
  };

  const duplicateCustomBlock = (blockId: string) => {
    const idx = customBlocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const source = customBlocks[idx];
    recordHistory(`Clone ${source.title}`);
    const clone: CustomBlockItem = {
      ...JSON.parse(JSON.stringify(source)),
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `${source.title} (Copy)`,
    };
    setCustomBlocks((prev) => {
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    notifySaved('Cloned custom block (⌘Z to undo)');
  };

  const deleteCustomBlock = (blockId: string) => {
    recordHistory('Delete custom block');
    setCustomBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedTarget?.kind === 'custom-block' && selectedTarget.blockId === blockId) {
      setSelectedTarget(null);
    }
    notifySaved('Deleted custom block (Press ⌘Z to undo)');
  };

  const moveCustomBlock = (blockId: string, direction: 'up' | 'down') => {
    const targetBlock = customBlocks.find((b) => b.id === blockId);
    if (!targetBlock) return;
    const sectionBlocks = customBlocks.filter(
      (b) => b.sectionId === targetBlock.sectionId
    );
    const localIdx = sectionBlocks.findIndex((b) => b.id === blockId);
    const swapLocalIdx = direction === 'up' ? localIdx - 1 : localIdx + 1;
    if (swapLocalIdx < 0 || swapLocalIdx >= sectionBlocks.length) return;

    const idA = sectionBlocks[localIdx].id;
    const idB = sectionBlocks[swapLocalIdx].id;
    recordHistory('Reorder custom block');
    setCustomBlocks((prev) => {
      const next = [...prev];
      const globalA = next.findIndex((b) => b.id === idA);
      const globalB = next.findIndex((b) => b.id === idB);
      if (globalA !== -1 && globalB !== -1) {
        const temp = next[globalA];
        next[globalA] = next[globalB];
        next[globalB] = temp;
      }
      return next;
    });
    notifySaved('Reordered custom block (⌘Z to undo)');
  };

  const getInteractionForKey = useCallback(
    (key: string): ComponentInteractionConfig => {
      if (!key) return DEFAULT_INTERACTION_CONFIG;
      return {
        ...DEFAULT_INTERACTION_CONFIG,
        ...(interactions[key] || {}),
      };
    },
    [interactions]
  );

  const updateInteractionForKey = (
    key: string,
    patch: Partial<ComponentInteractionConfig>
  ) => {
    if (!key) return;
    recordHistory(`Update component style/motion (${key.split(':')[1] || key})`);
    setInteractions((prev) => ({
      ...prev,
      [key]: {
        ...DEFAULT_INTERACTION_CONFIG,
        ...(prev[key] || {}),
        ...patch,
      },
    }));
    setPreviewPulseKey((prev) => ({ ...prev, [key]: Date.now() }));
    notifySaved('Updated component style/interaction (⌘Z to undo)');
  };

  const copyStyleFromKey = (key: string) => {
    const style = getInteractionForKey(key);
    setCopiedInteractionStyle({ ...style });
    soundFx.playTick();
    notifySaved('Copied component style & motion settings');
  };

  const pasteStyleToKey = (key: string) => {
    if (!copiedInteractionStyle || !key) return;
    updateInteractionForKey(key, {
      ...copiedInteractionStyle,
      locked: getInteractionForKey(key).locked,
    });
    soundFx.playPop();
    notifySaved('Pasted style & motion settings (⌘Z to undo)');
  };

  const triggerInteractionPreview = (key: string) => {
    if (!key) return;
    soundFx.playPop();
    setPreviewPulseKey((prev) => ({ ...prev, [key]: Date.now() }));
  };

  const resetAllToDefaults = () => {
    recordHistory('Reset all to defaults');
    localStorage.removeItem(STORAGE_KEY);
    setSectionOrder(['lineup', 'workflow', 'workshops', 'faq']);
    setHiddenSections([]);
    setSectionParts(DEFAULT_SECTION_PARTS);
    setHiddenParts([]);
    setConfig(DEFAULT_SECTION_CONFIG);
    setCandidates(CANDIDATES);
    setWorkflowStages(DEFAULT_WORKFLOW_STAGES);
    setWorkshopTracks(DEFAULT_WORKSHOP_TRACKS);
    setFaqs(DEFAULT_FAQS);
    setCustomBlocks([]);
    setInteractions({});
    setSelectedTarget(null);
    notifySaved('Reset all components to studio defaults (⌘Z to undo)');
  };

  return (
    <StudioBuilderContext.Provider
      value={{
        isBuilderMode,
        setIsBuilderMode,
        isBarVisible,
        setIsBarVisible,
        hidePreviewBar,
        showPreviewBar,
        isInspectorOpen,
        setIsInspectorOpen,
        activeSection,
        setActiveSection,
        selectedTarget,
        setSelectedTarget,
        selectAndEditTarget,
        sectionOrder,
        moveSection,
        hiddenSections,
        toggleSectionVisibility,
        sectionParts,
        movePartInSection,
        hiddenParts,
        togglePartVisibility,
        deletePart,
        config,
        updateConfig,
        candidates,
        updateCandidate,
        deleteCandidate,
        duplicateCandidate,
        reorderCandidates,
        replaceAllCandidatePhotos,
        workflowStages,
        updateWorkflowStage,
        deleteWorkflowStage,
        duplicateWorkflowStage,
        addWorkflowStage,
        reorderWorkflowStages,
        dropAppOnStage,
        removeAppFromStage,
        dropEmployeeOnStage,
        workshopTracks,
        updateWorkshopTrack,
        deleteWorkshopTrack,
        duplicateWorkshopTrack,
        addWorkshopTrack,
        reorderWorkshopTracks,
        dropAppOnWorkshop,
        removeAppFromWorkshop,
        faqs,
        updateFaq,
        reorderFaqs,
        addFaq,
        duplicateFaq,
        deleteFaq,
        customBlocks,
        addCustomBlock,
        updateCustomBlock,
        duplicateCustomBlock,
        deleteCustomBlock,
        moveCustomBlock,
        interactions,
        getInteractionForKey,
        updateInteractionForKey,
        copiedInteractionStyle,
        copyStyleFromKey,
        pasteStyleToKey,
        previewPulseKey,
        triggerInteractionPreview,
        undo,
        redo,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
        historyPast,
        historyFuture,
        revertToSnapshot,
        savedVersions,
        saveCurrentVersion,
        restoreSavedVersion,
        deleteSavedVersion,
        renameSavedVersion,
        exportCurrentVersionJson,
        importVersionJson,
        draggedItem,
        setDraggedItem,
        resetAllToDefaults,
        lastSavedMessage,
        notifySaved,
      }}
    >
      {children}
    </StudioBuilderContext.Provider>
  );
};

export const useStudioBuilder = () => {
  const ctx = useContext(StudioBuilderContext);
  if (!ctx) {
    throw new Error('useStudioBuilder must be used within a StudioBuilderProvider');
  }
  return ctx;
};
