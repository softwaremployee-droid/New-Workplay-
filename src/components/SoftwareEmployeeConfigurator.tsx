import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Candidate, CANDIDATES } from '../data/talent';
import { EMPLOYEE_WORKFLOWS, WorkflowStep } from '../data/employeeWorkflows';
import { PlatformLogo, PlatformType, SOFTWARE_APPLICATIONS } from './PlatformLogo';
import { useStudioBuilder } from '../context/StudioBuilderContext';
import { processSingleHeadshotFile } from '../utils/imageCutoutClient';
import { idbGet, idbSet } from '../utils/persistentStorage';
import { soundFx } from '../utils/sound';

/**
 * ============================================================================
 * EDITABLE CONFIGURATOR DATA OBJECT
 * Synced with Home Page Employees & Employee Resumes:
 * - Same 6 employees and cutouts as the home page
 * - 5 Numbered Sections: 1. Role, 2. Use Case, 3. Apps, 4. Add Ons, 5. Payment
 * - Use Case options: Software Employee, Employee Infrastructure, Role intelligence
 * - Clickable Section Editor on every section & item
 * ============================================================================
 */

export type RoleId =
  | 'onboarding-manager'
  | 'sales-manager'
  | 'support-manager'
  | 'operations-manager'
  | 'data-manager'
  | 'email-manager';

export interface RoleUseCaseOption {
  id: string;
  title: string;
  summary: string;
  resumeProof: string;
  metricBadge: string;
  priceImpact: number; // 0 = Included
}

export interface RoleFeatureAddon {
  id: string;
  roleId: RoleId;
  title: string;
  description: string;
  metricBadge: string;
  price: number; // $750 each (no /mo)
}

export interface RoleOption {
  id: RoleId;
  candidateId: string;
  title: string;
  defaultName: string;
  department: string;
  salary: number; // e.g. $90,000/yr
  price: number; // e.g. $9,000 (no /mo)
  capacityMultiplier: string;
  tagline: string;
  resumeAboutMe: string;
  resumeSkillsSummary: string;
  cutoutSrc: string;
  platforms: PlatformType[];
  workflowSteps: WorkflowStep[];
  useCases: RoleUseCaseOption[];
}

export type StepId = 'role' | 'use-case' | 'apps' | 'add-ons' | 'payment';

export interface StepMeta {
  id: StepId;
  stepNumber: number;
  tabLabel: string;
  categoryKicker: string;
  title: string;
  whyThisMatters: string;
}

export interface StudioSchemaData {
  studioTitle: string;
  steps: StepMeta[];
  roles: RoleOption[];
  roleFeatures: Record<RoleId, RoleFeatureAddon[]>;
}

const STUDIO_SCHEMA_STORAGE_KEY = 'workplay_employee_studio_schema_v7';

const getResumeForCandidate = (candidateId: string) =>
  EMPLOYEE_WORKFLOWS.find((w) => w.id === candidateId) || EMPLOYEE_WORKFLOWS[0];

export const CONFIGURATOR_DATA: StudioSchemaData = {
  studioTitle: 'Workplay Studio',
  steps: [
    {
      id: 'role',
      stepNumber: 1,
      tabLabel: '1. Role',
      categoryKicker: '01 · ROLE & RESUME PROFILE',
      title: '1. Role',
      whyThisMatters:
        'Why this matters: Each Software Employee replaces a traditional full-time hire for 90% less while working 24/7 across your stack.',
    },
    {
      id: 'use-case',
      stepNumber: 2,
      tabLabel: '2. Use Case',
      categoryKicker: '02 · RESUME EXECUTION PLAYBOOK',
      title: '2. Use Case',
      whyThisMatters:
        'Why this matters: Select the primary operational playbook from this employee’s resume so they execute your highest-leverage workflow from day one.',
    },
    {
      id: 'apps',
      stepNumber: 3,
      tabLabel: '3. Apps',
      categoryKicker: '03 · CONNECTED RESUME WORKSPACE',
      title: '3. Apps',
      whyThisMatters:
        'Why this matters: Your employee lives directly inside the software apps listed on their resume—executing multi-app workflows with zero human copy-pasting.',
    },
    {
      id: 'add-ons',
      stepNumber: 4,
      tabLabel: '4. Add Ons',
      categoryKicker: '04 · SPECIALIZED CAPABILITIES',
      title: '4. Add Ons',
      whyThisMatters:
        'Why this matters: Equip up to 3 role-specific resume expansions (+$750 each) to scale autonomous throughput across your workspace.',
    },
    {
      id: 'payment',
      stepNumber: 5,
      tabLabel: '5. Payment',
      categoryKicker: '05 · SUMMARY & PAYMENT',
      title: '5. Payment',
      whyThisMatters:
        'Why this matters: Review every numbered configuration choice, verify your 90% salary savings, and complete payment to hire your employee immediately.',
    },
  ],

  roles: [
    {
      id: 'onboarding-manager',
      candidateId: 'employee-1-onboarding',
      title: 'Onboarding Manager',
      defaultName: 'Steve Peters',
      department: 'Client Delivery & Workspace Provisioning',
      salary: 90000,
      price: 9000,
      capacityMultiplier: '14× Capacity',
      tagline: getResumeForCandidate('employee-1-onboarding').tagline,
      resumeAboutMe: getResumeForCandidate('employee-1-onboarding').aboutMe,
      resumeSkillsSummary: getResumeForCandidate('employee-1-onboarding').skillsParagraph1,
      cutoutSrc: '/src/assets/images/candidate_marcus_cutout.png',
      platforms: ['typeform', 'hubspot', 'slack', 'google-sheets'],
      workflowSteps: getResumeForCandidate('employee-1-onboarding').workflowSteps,
      useCases: [
        {
          id: 'steve-uc-1',
          title: 'Software Employee',
          summary:
            'Parses incoming Typeform submissions, updates HubSpot deal stages to Onboarding Active, spins up dedicated #client Slack channels, and logs rows in Google Sheets.',
          resumeProof:
            'Provisioned 4,200+ enterprise client workspaces in under 90 seconds from contract signature to live Slack channel.',
          metricBadge: '90s Kickoff · 14× Capacity',
          priceImpact: 0,
        },
        {
          id: 'steve-uc-2',
          title: 'Employee Infrastructure',
          summary:
            'Tracks every onboarding milestone in Google Sheets 24/7, sending automated Slack and HubSpot follow-ups whenever client brand assets or questionnaires stall.',
          resumeProof:
            'Reduced average client time-to-value from 21 days to 4 hours with automated Typeform-to-HubSpot validation.',
          metricBadge: '99.8% SLA Accuracy',
          priceImpact: 0,
        },
        {
          id: 'steve-uc-3',
          title: 'Role intelligence',
          summary:
            'Assembles formatted kickoff briefs from Typeform intake payloads, assigns HubSpot owners, and pins stakeholder deliverables inside Slack.',
          resumeProof:
            'Eliminated $81,000/yr in traditional onboarding payroll with zero dropped sales-to-delivery handoffs.',
          metricBadge: 'Zero-Churn Handoffs',
          priceImpact: 0,
        },
      ],
    },
    {
      id: 'sales-manager',
      candidateId: 'employee-2-sales',
      title: 'Sales Manager',
      defaultName: 'Richard Green',
      department: 'Enterprise Pipeline & Revenue Execution',
      salary: 100000,
      price: 10000,
      capacityMultiplier: '18× Capacity',
      tagline: getResumeForCandidate('employee-2-sales').tagline,
      resumeAboutMe: getResumeForCandidate('employee-2-sales').aboutMe,
      resumeSkillsSummary: getResumeForCandidate('employee-2-sales').skillsParagraph1,
      cutoutSrc: '/src/assets/images/candidate_julian_cutout.png',
      platforms: ['aircall', 'hubspot', 'salesforce', 'stripe'],
      workflowSteps: getResumeForCandidate('employee-2-sales').workflowSteps,
      useCases: [
        {
          id: 'richard-uc-1',
          title: 'Software Employee',
          summary:
            'Dials inbound leads on AirCall within 8 seconds of capture, logs full call transcripts, and scores buying intent directly into HubSpot and Salesforce.',
          resumeProof:
            'Drove 41% higher inbound-to-close conversion by dialing and qualifying leads in AirCall within 8 seconds.',
          metricBadge: '8s Response · +41% Win Rate',
          priceImpact: 0,
        },
        {
          id: 'richard-uc-2',
          title: 'Employee Infrastructure',
          summary:
            'Enrolls qualified prospects into behavior-driven HubSpot sequences while updating Salesforce opportunity stages and forecast categories with zero rep nagging.',
          resumeProof:
            'Eliminated 100% of manual CRM data entry across 12,000+ annual enterprise opportunities in Salesforce.',
          metricBadge: 'Zero CRM Admin Lag',
          priceImpact: 0,
        },
        {
          id: 'richard-uc-3',
          title: 'Role intelligence',
          summary:
            'Generates tailored Stripe subscription and payment links live during qualification calls and reconciles closed-won revenue to Salesforce automatically.',
          resumeProof:
            'Automated $14.8M in direct Stripe checkout link collections synced bi-directionally with Salesforce opportunities.',
          metricBadge: '18× Pipeline Capacity',
          priceImpact: 0,
        },
      ],
    },
    {
      id: 'support-manager',
      candidateId: 'employee-6-support',
      title: 'Support Manager',
      defaultName: 'Cindy James',
      department: '24/7 Omnichannel Customer Experience',
      salary: 76000,
      price: 7600,
      capacityMultiplier: '25× Capacity',
      tagline: getResumeForCandidate('employee-6-support').tagline,
      resumeAboutMe: getResumeForCandidate('employee-6-support').aboutMe,
      resumeSkillsSummary: getResumeForCandidate('employee-6-support').skillsParagraph1,
      cutoutSrc: '/src/assets/images/candidate_sophie_cutout.png',
      platforms: ['intercom', 'aircall', 'stripe', 'slack'],
      workflowSteps: getResumeForCandidate('employee-6-support').workflowSteps,
      useCases: [
        {
          id: 'cindy-uc-1',
          title: 'Software Employee',
          summary:
            'Triages incoming Intercom chats and AirCall voice queues simultaneously with zero hold time, resolving 89% of Tier-1 and Tier-2 inquiries on first contact.',
          resumeProof:
            'Resolved 89% of incoming Intercom and AirCall tickets on first contact with a 12-second median response time.',
          metricBadge: '12s Reply · 99.6% CSAT',
          priceImpact: 0,
        },
        {
          id: 'cindy-uc-2',
          title: 'Employee Infrastructure',
          summary:
            'Executes prorated plan upgrades, invoice resends, and policy-compliant credits directly inside Stripe during live Intercom or AirCall conversations.',
          resumeProof:
            'Unified Intercom conversation histories with live Stripe subscription status to eliminate back-and-forth billing tickets.',
          metricBadge: 'Instant Stripe Action',
          priceImpact: 0,
        },
        {
          id: 'cindy-uc-3',
          title: 'Role intelligence',
          summary:
            'Packages reproducible bug diagnostics, caller transcripts, and Stripe account metadata into #support-escalations on Slack for rapid engineering fixes.',
          resumeProof:
            'Reduced Tier-2 engineering interruptions by 64% through structured Slack incident threads.',
          metricBadge: '25× Support Capacity',
          priceImpact: 0,
        },
      ],
    },
    {
      id: 'operations-manager',
      candidateId: 'employee-4-operations',
      title: 'Operations Manager',
      defaultName: 'Hilary Maximus',
      department: 'RevOps, Financial Ledger & Cross-CRM Spine',
      salary: 118000,
      price: 11800,
      capacityMultiplier: '20× Capacity',
      tagline: getResumeForCandidate('employee-4-operations').tagline,
      resumeAboutMe: getResumeForCandidate('employee-4-operations').aboutMe,
      resumeSkillsSummary: getResumeForCandidate('employee-4-operations').skillsParagraph1,
      cutoutSrc: '/src/assets/images/candidate_linnea_cutout.png',
      platforms: ['stripe', 'google-sheets', 'hubspot', 'salesforce'],
      workflowSteps: getResumeForCandidate('employee-4-operations').workflowSteps,
      useCases: [
        {
          id: 'hilary-uc-1',
          title: 'Software Employee',
          summary:
            'Listens to every Stripe invoice, renewal, and failed charge—triggering instant HubSpot dunning workflows and syncing recovered ARR to Google Sheets.',
          resumeProof:
            'Recovered $84,000/yr in involuntarily churned subscriptions via instant Stripe webhook dunning and HubSpot outreach.',
          metricBadge: '$84k/yr Recovered',
          priceImpact: 0,
        },
        {
          id: 'hilary-uc-2',
          title: 'Employee Infrastructure',
          summary:
            'Writes reconciled Stripe and Salesforce transaction rows into live Google Sheets ARR, burn, and commission ledgers with zero manual CSV exports.',
          resumeProof:
            'Reclaimed 160+ hours/month of manual spreadsheet reconciliation with zero formula errors across 50,000+ rows.',
          metricBadge: 'Zero CSV Exports',
          priceImpact: 0,
        },
        {
          id: 'hilary-uc-3',
          title: 'Role intelligence',
          summary:
            'Deduplicates accounts, normalizes domains, and aligns multi-year Salesforce contract renewal dates with actual Stripe billing schedules.',
          resumeProof:
            'Maintained 99.98% cross-platform data hygiene across 250,000+ HubSpot and Salesforce CRM records.',
          metricBadge: '99.98% Clean CRM',
          priceImpact: 0,
        },
      ],
    },
    {
      id: 'data-manager',
      candidateId: 'employee-3-funnel',
      title: 'Data Manager',
      defaultName: 'Jamie Dawn',
      department: 'Behavioral Telemetry, Cohorts & Attribution',
      salary: 85000,
      price: 8500,
      capacityMultiplier: '14× Capacity',
      tagline: getResumeForCandidate('employee-3-funnel').tagline,
      resumeAboutMe: getResumeForCandidate('employee-3-funnel').aboutMe,
      resumeSkillsSummary: getResumeForCandidate('employee-3-funnel').skillsParagraph1,
      cutoutSrc: '/src/assets/images/candidate_maya_cutout.png',
      platforms: ['typeform', 'mailchimp', 'hubspot', 'google-sheets'],
      workflowSteps: getResumeForCandidate('employee-3-funnel').workflowSteps,
      useCases: [
        {
          id: 'jamie-uc-1',
          title: 'Software Employee',
          summary:
            'Captures structured respondent data in Typeform, computes multi-touch attribution scores in HubSpot, and eliminates duplicate schema fields.',
          resumeProof:
            'Unified 180,000+ Typeform respondent profiles with HubSpot CRM attribution and live Google Sheets cohort matrices.',
          metricBadge: '100% Schema Hygiene',
          priceImpact: 0,
        },
        {
          id: 'jamie-uc-2',
          title: 'Employee Infrastructure',
          summary:
            'Pushes clean, behaviorally scored audience segments from HubSpot and Typeform into Mailchimp with dynamic LTV merge tags.',
          resumeProof:
            'Lifted lifecycle ROAS by 46% by syncing clean behavioral segments between HubSpot and Mailchimp in real time.',
          metricBadge: '+46% Campaign ROAS',
          priceImpact: 0,
        },
        {
          id: 'jamie-uc-3',
          title: 'Role intelligence',
          summary:
            'Maintains a self-updating Google Sheets model tracking channel CAC, payback period, and 12-month cohort LTV without manual SQL exports.',
          resumeProof:
            'Saved $76,500/yr vs. a traditional data manager while running 14× more weekly cohort analyses.',
          metricBadge: '14× Data Capacity',
          priceImpact: 0,
        },
      ],
    },
    {
      id: 'email-manager',
      candidateId: 'employee-5-team',
      title: 'Email Manager',
      defaultName: 'Mike Woods',
      department: 'Lifecycle Sequences, Deliverability & Attribution',
      salary: 90000,
      price: 9000,
      capacityMultiplier: '15× Capacity',
      tagline: getResumeForCandidate('employee-5-team').tagline,
      resumeAboutMe: getResumeForCandidate('employee-5-team').aboutMe,
      resumeSkillsSummary: getResumeForCandidate('employee-5-team').skillsParagraph1,
      cutoutSrc: '/src/assets/images/candidate_david_cutout.png',
      platforms: ['mailchimp', 'hubspot', 'slack', 'google-sheets'],
      workflowSteps: getResumeForCandidate('employee-5-team').workflowSteps,
      useCases: [
        {
          id: 'mike-uc-1',
          title: 'Software Employee',
          summary:
            'Deploys onboarding, win-back, and expansion sequences in Mailchimp triggered by live HubSpot CRM events with continuous A/B subject line testing.',
          resumeProof:
            'Generated 48% higher lifecycle email revenue across Mailchimp and HubSpot through automated behavioral branching.',
          metricBadge: '+48% Email Revenue',
          priceImpact: 0,
        },
        {
          id: 'mike-uc-2',
          title: 'Employee Infrastructure',
          summary:
            'Detects high-intent prospect replies in real time and routes formatted context cards directly into Slack so sales acts within 5 seconds.',
          resumeProof:
            'Routed 100% of high-intent prospect replies into Slack within 5 seconds across 2.4M monthly lifecycle sends.',
          metricBadge: '< 5s Slack Alert',
          priceImpact: 0,
        },
        {
          id: 'mike-uc-3',
          title: 'Role intelligence',
          summary:
            'Logs open rates, click-to-close conversion, and attributed revenue per drip sequence into Google Sheets while guarding 99.4% primary inbox placement.',
          resumeProof:
            'Maintained 99.4% primary inbox deliverability while launching 15× more A/B tests per week.',
          metricBadge: '99.4% Deliverability',
          priceImpact: 0,
        },
      ],
    },
  ],

  // 4. ADD ONS: Unique role-specific add-ons (max 3 per role, +$750 each, no /mo)
  roleFeatures: {
    'onboarding-manager': [
      {
        id: 'onboard-asset-chaser',
        roleId: 'onboarding-manager',
        title: 'Autonomous Typeform Asset Chaser',
        description:
          'Automatically follows up via Slack and HubSpot on missing brand assets, SOC-2 forms, and credentials until 100% of Typeform intake fields are complete.',
        metricBadge: 'Zero Stalled Kickoffs',
        price: 750,
      },
      {
        id: 'onboard-workspace-cloner',
        roleId: 'onboarding-manager',
        title: 'Multi-Channel Slack & HubSpot Deal Room Cloner',
        description:
          'Spins up private client Slack channels, pins formatted kickoff briefs, and links live Google Sheets milestone trackers in 15 seconds.',
        metricBadge: '< 15s Provisioning',
        price: 750,
      },
      {
        id: 'onboard-churn-radar',
        roleId: 'onboarding-manager',
        title: 'First-30-Day Google Sheets SLA Risk Radar',
        description:
          'Monitors client engagement velocity across Slack and Typeform, flagging at-risk accounts in Google Sheets before day-30 churn can occur.',
        metricBadge: '99.4% Retention',
        price: 750,
      },
    ],
    'sales-manager': [
      {
        id: 'sales-speed-dialer',
        roleId: 'sales-manager',
        title: 'Sub-8s AirCall Outbound Qualification Engine',
        description:
          'Places instant AirCall qualification calls the moment a prospect submits a high-intent form, syncing call transcripts to HubSpot and Salesforce.',
        metricBadge: '8s Speed-to-Lead',
        price: 750,
      },
      {
        id: 'sales-pipeline-reviver',
        roleId: 'sales-manager',
        title: 'Closed-Lost Salesforce & HubSpot Deal Reviver',
        description:
          'Monitors stalled and closed-lost opportunities in Salesforce, triggering hyper-personalized HubSpot re-engagement sequences when buying signals return.',
        metricBadge: '+22% Revived Pipeline',
        price: 750,
      },
      {
        id: 'sales-stripe-closer',
        roleId: 'sales-manager',
        title: 'Instant Stripe Order-Form & Subscription Closer',
        description:
          'Generates custom Stripe checkout links with approved enterprise tiers during live calls and reconciles payment status to Salesforce.',
        metricBadge: '2.4× Faster Close',
        price: 750,
      },
    ],
    'support-manager': [
      {
        id: 'support-stripe-refund-guard',
        roleId: 'support-manager',
        title: 'Autonomous Stripe Billing & Proration Resolver',
        description:
          'Handles invoice lookups, seat proration, and policy-approved retention credits directly inside Stripe during Intercom and AirCall sessions.',
        metricBadge: '89% Auto-Resolved',
        price: 750,
      },
      {
        id: 'support-aircall-vip-triage',
        roleId: 'support-manager',
        title: 'Zero-Hold AirCall Voice Diagnostics & Transcript Sync',
        description:
          'Answers concurrent VIP voice inquiries on AirCall, cross-checks account health in Intercom, and logs resolution summaries to Slack.',
        metricBadge: 'Zero Hold Music',
        price: 750,
      },
      {
        id: 'support-slack-bug-packager',
        roleId: 'support-manager',
        title: 'Reproducible Slack Engineering Incident Packager',
        description:
          'Clusters duplicate Intercom bug reports and posts structured reproduction steps into #support-escalations on Slack.',
        metricBadge: '-64% Eng Interrupts',
        price: 750,
      },
    ],
    'operations-manager': [
      {
        id: 'ops-stripe-dunning-engine',
        roleId: 'operations-manager',
        title: 'Autonomous Stripe Dunning & Failed Renewal Recovery',
        description:
          'Catches failed Stripe charges in real time, triggers multi-step HubSpot billing recovery outreach, and updates Salesforce contract status.',
        metricBadge: '$84k/yr Recovered',
        price: 750,
      },
      {
        id: 'ops-sheets-board-pack',
        roleId: 'operations-manager',
        title: 'Automated Google Sheets Executive P&L & ARR Publisher',
        description:
          'Compiles audited weekly ARR, net dollar retention, and burn rate actuals from Stripe and Salesforce into your master Google Sheets model.',
        metricBadge: '160 hrs/mo Saved',
        price: 750,
      },
      {
        id: 'ops-crm-deduplicator',
        roleId: 'operations-manager',
        title: 'Bi-Directional HubSpot & Salesforce Schema Lock',
        description:
          'Continuously merges duplicate company records, normalizes renewal dates, and enforces 99.98% data hygiene across HubSpot and Salesforce.',
        metricBadge: '99.98% Data Hygiene',
        price: 750,
      },
    ],
    'data-manager': [
      {
        id: 'data-typeform-enricher',
        roleId: 'data-manager',
        title: 'Real-Time Typeform Zero-Party Telemetry Enricher',
        description:
          'Transforms raw Typeform survey responses into weighted buying-intent scores inside HubSpot and Google Sheets.',
        metricBadge: 'Instant Scoring',
        price: 750,
      },
      {
        id: 'data-mailchimp-predictive-sync',
        roleId: 'data-manager',
        title: 'Predictive LTV Cohort Sync for Mailchimp & HubSpot',
        description:
          'Automatically segments high-LTV cohorts from Google Sheets models and pushes dynamic audience rules to Mailchimp and HubSpot.',
        metricBadge: '+46% Campaign ROAS',
        price: 750,
      },
      {
        id: 'data-anomaly-watchdog',
        roleId: 'data-manager',
        title: '24/7 Conversion & Attribution Anomaly Watchdog',
        description:
          'Monitors funnel drop-offs across Typeform, HubSpot, and Mailchimp—logging root-cause diagnostics directly into Google Sheets.',
        metricBadge: '< 60s Alerting',
        price: 750,
      },
    ],
    'email-manager': [
      {
        id: 'email-deliverability-shield',
        roleId: 'email-manager',
        title: 'Autonomous Mailchimp & HubSpot Deliverability Shield',
        description:
          'Monitors domain reputation, prunes unengaged cohorts, and paces sends to lock in 99.4% primary inbox placement.',
        metricBadge: '99.4% Inbox Rate',
        price: 750,
      },
      {
        id: 'email-ab-autopilot',
        roleId: 'email-manager',
        title: 'Continuous Multivariate Subject & CTA Autopilot',
        description:
          'Runs automated A/B tests across Mailchimp and HubSpot lifecycle flows, promoting winning variants and logging lift in Google Sheets.',
        metricBadge: '+48% Lifecycle Rev',
        price: 750,
      },
      {
        id: 'email-slack-vip-concierge',
        roleId: 'email-manager',
        title: 'Instant Slack VIP Reply Router & Deal Drafter',
        description:
          'Detects positive prospect replies in Mailchimp and HubSpot, posts instant alerts in Slack, and logs attributed revenue in Google Sheets.',
        metricBadge: '< 5s Reply Routing',
        price: 750,
      },
    ],
  },
};

export interface EmployeeConfigurationState {
  candidateId?: string;
  roleId: RoleId;
  customRoleTitle?: string;
  customPrice?: number;
  customSalary?: number;
  customAvatarSrc?: string;
  selectedUseCaseId: string;
  enabledPlatforms: PlatformType[];
  selectedFeatureIds: string[];
  employeeName: string;
  paymentTerm: 'annual-direct' | 'quarterly-split';
}

export const mapCandidateToRoleId = (candidate?: Candidate | null): RoleId => {
  if (!candidate) return 'onboarding-manager';
  if (candidate.id === 'employee-1-onboarding') return 'onboarding-manager';
  if (candidate.id === 'employee-2-sales') return 'sales-manager';
  if (candidate.id === 'employee-6-support') return 'support-manager';
  if (candidate.id === 'employee-4-operations') return 'operations-manager';
  if (candidate.id === 'employee-3-funnel') return 'data-manager';
  if (candidate.id === 'employee-5-team') return 'email-manager';

  const text = `${candidate.role} ${candidate.specialization}`.toLowerCase();
  if (text.includes('onboard')) return 'onboarding-manager';
  if (text.includes('sales')) return 'sales-manager';
  if (text.includes('support')) return 'support-manager';
  if (text.includes('operat') || text.includes('revops')) return 'operations-manager';
  if (text.includes('data') || text.includes('funnel')) return 'data-manager';
  if (text.includes('email') || text.includes('team')) return 'email-manager';
  return 'onboarding-manager';
};

export const createInitialConfigFromCandidate = (
  candidate?: Candidate | null
): EmployeeConfigurationState => {
  const roleId = mapCandidateToRoleId(candidate);
  const roleDef =
    CONFIGURATOR_DATA.roles.find((r) => r.id === roleId) ||
    CONFIGURATOR_DATA.roles[0];

  return {
    candidateId: candidate?.id || roleDef.candidateId,
    roleId,
    customRoleTitle: candidate?.role || roleDef.title,
    customPrice: candidate?.annualSalaryUsd || roleDef.price,
    customSalary: candidate?.traditionalSalaryUsd || roleDef.salary,
    customAvatarSrc: candidate?.imageSrc || roleDef.cutoutSrc,
    selectedUseCaseId: roleDef.useCases[0]?.id || 'steve-uc-1',
    enabledPlatforms: [...roleDef.platforms],
    selectedFeatureIds: [],
    employeeName: candidate?.name || roleDef.defaultName,
    paymentTerm: 'annual-direct',
  };
};

interface SoftwareEmployeeConfiguratorProps {
  initialCandidate?: Candidate | null;
  allCandidates?: Candidate[];
  onSwitchCandidate?: (candidate: Candidate) => void;
  savedConfig?: EmployeeConfigurationState | null;
  onSaveConfig?: (config: EmployeeConfigurationState) => void;
  onBackToLineup: () => void;
  onDeployEmployee?: (
    config: EmployeeConfigurationState,
    totalPrice: number
  ) => void;
}

export const SoftwareEmployeeConfigurator: React.FC<
  SoftwareEmployeeConfiguratorProps
> = ({
  initialCandidate,
  allCandidates = CANDIDATES,
  onSwitchCandidate,
  savedConfig,
  onSaveConfig,
  onBackToLineup,
  onDeployEmployee,
}) => {
  const {
    candidates: homePageCandidates,
    isBuilderMode,
    setIsBuilderMode,
    updateCandidate,
    saveCurrentVersion,
    notifySaved,
  } = useStudioBuilder();

  // Always reflect the live employees on the home page
  const liveCandidates =
    homePageCandidates && homePageCandidates.length > 0
      ? homePageCandidates
      : allCandidates;

  // Editable Studio Schema State
  const [studioSchema, setStudioSchema] = useState<StudioSchemaData>(() => {
    try {
      const raw = localStorage.getItem(STUDIO_SCHEMA_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.roles) && Array.isArray(parsed.steps)) {
          return { ...CONFIGURATOR_DATA, ...parsed };
        }
      }
    } catch {
      // ignore storage errors
    }
    return CONFIGURATOR_DATA;
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const idbSchema = await idbGet<StudioSchemaData>(STUDIO_SCHEMA_STORAGE_KEY);
      if (
        !cancelled &&
        idbSchema &&
        Array.isArray(idbSchema.roles) &&
        Array.isArray(idbSchema.steps)
      ) {
        setStudioSchema((prev) => ({ ...CONFIGURATOR_DATA, ...idbSchema, ...prev }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void idbSet(STUDIO_SCHEMA_STORAGE_KEY, studioSchema);
    try {
      const compactSchema: StudioSchemaData = {
        ...studioSchema,
        roles: studioSchema.roles.map((r) => {
          const defaultRole = CONFIGURATOR_DATA.roles.find((d) => d.id === r.id);
          return {
            ...r,
            cutoutSrc:
              r.cutoutSrc && r.cutoutSrc.startsWith('data:')
                ? defaultRole?.cutoutSrc || r.cutoutSrc
                : r.cutoutSrc,
          };
        }),
      };
      localStorage.setItem(
        STUDIO_SCHEMA_STORAGE_KEY,
        JSON.stringify(compactSchema)
      );
    } catch {
      // ignore quota errors
    }
  }, [studioSchema]);

  // Single configuration state object
  const [config, setConfig] = useState<EmployeeConfigurationState>(() => {
    if (
      savedConfig &&
      savedConfig.selectedUseCaseId &&
      Array.isArray(savedConfig.enabledPlatforms)
    ) {
      return savedConfig;
    }
    return createInitialConfigFromCandidate(initialCandidate);
  });

  const lastSyncedCandidateIdRef = useRef<string | undefined>(
    initialCandidate?.id
  );
  useEffect(() => {
    if (
      initialCandidate &&
      initialCandidate.id !== lastSyncedCandidateIdRef.current
    ) {
      lastSyncedCandidateIdRef.current = initialCandidate.id;
      if (
        savedConfig &&
        savedConfig.selectedUseCaseId &&
        Array.isArray(savedConfig.enabledPlatforms)
      ) {
        setConfig(savedConfig);
      } else {
        setConfig(createInitialConfigFromCandidate(initialCandidate));
      }
    }
  }, [initialCandidate, savedConfig]);

  // Step navigation (0 to 4 -> 1 of 5)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stageView, setStageView] = useState<'profile' | 'workspace'>('profile');
  const [isStageCrossfading, setIsStageCrossfading] = useState<boolean>(false);
  const [isDeployedModalOpen, setIsDeployedModalOpen] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [saveFeedbackText, setSaveFeedbackText] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Per-Section Clickable Editor State: tracks which section(s) or item is actively being edited
  const [editingSections, setEditingSections] = useState<Record<StepId, boolean>>({
    role: false,
    'use-case': false,
    apps: false,
    'add-ons': false,
    payment: false,
  });

  const toggleSectionEditor = (stepId: StepId, forceState?: boolean) => {
    soundFx.playPop();
    setEditingSections((prev) => ({
      ...prev,
      [stepId]: typeof forceState === 'boolean' ? forceState : !prev[stepId],
    }));
  };

  // Auto-save configuration to parent memory
  const onSaveConfigRef = useRef(onSaveConfig);
  useEffect(() => {
    onSaveConfigRef.current = onSaveConfig;
  }, [onSaveConfig]);

  useEffect(() => {
    onSaveConfigRef.current?.(config);
  }, [config]);

  // Sync studioSchema roles with live home page candidates so home page & studio builder always show the exact same employees
  const syncedRoles = useMemo(() => {
    return studioSchema.roles.map((role) => {
      const homeEmp = liveCandidates.find((c) => c.id === role.candidateId);
      if (!homeEmp) return role;
      return {
        ...role,
        title: homeEmp.role || role.title,
        defaultName: homeEmp.name || role.defaultName,
        salary: homeEmp.traditionalSalaryUsd || role.salary,
        price: homeEmp.annualSalaryUsd || role.price,
        cutoutSrc: homeEmp.imageSrc || role.cutoutSrc,
        resumeAboutMe: homeEmp.bio || role.resumeAboutMe,
      };
    });
  }, [studioSchema.roles, liveCandidates]);

  // Derived active selections
  const currentRole = useMemo(
    () =>
      syncedRoles.find((r) => r.id === config.roleId) ||
      syncedRoles[0],
    [syncedRoles, config.roleId]
  );

  const matchedHomeCandidate = useMemo(
    () =>
      liveCandidates.find(
        (c) => c.id === (config.candidateId || currentRole.candidateId)
      ) || liveCandidates[0],
    [liveCandidates, config.candidateId, currentRole.candidateId]
  );

  const availableUseCases = useMemo(
    () => currentRole.useCases || [],
    [currentRole]
  );

  const currentUseCase = useMemo(
    () =>
      availableUseCases.find((u) => u.id === config.selectedUseCaseId) ||
      availableUseCases[0],
    [availableUseCases, config.selectedUseCaseId]
  );

  const availableRoleFeatures = useMemo(
    () => (studioSchema.roleFeatures[config.roleId] || []).slice(0, 3),
    [studioSchema.roleFeatures, config.roleId]
  );

  const activeSelectedFeatures = useMemo(
    () =>
      availableRoleFeatures.filter((f) =>
        config.selectedFeatureIds.includes(f.id)
      ),
    [availableRoleFeatures, config.selectedFeatureIds]
  );

  const effectiveRoleTitle = config.customRoleTitle || currentRole.title;
  const effectiveBasePrice =
    typeof config.customPrice === 'number'
      ? config.customPrice
      : currentRole.price;
  const effectiveSalary =
    typeof config.customSalary === 'number'
      ? config.customSalary
      : currentRole.salary;

  // Live Total Price (Base Price + $750 per selected Add-On, NO /mo)
  const totalPrice = useMemo(() => {
    const featuresSum = activeSelectedFeatures.reduce(
      (acc, f) => acc + f.price,
      0
    );
    const useCaseImpact = currentUseCase?.priceImpact || 0;
    return effectiveBasePrice + featuresSum + useCaseImpact;
  }, [effectiveBasePrice, activeSelectedFeatures, currentUseCase]);

  const annualSavingsUsd = Math.max(0, effectiveSalary - totalPrice);
  const savingsPercentage = Math.round(
    (annualSavingsUsd / Math.max(1, effectiveSalary)) * 100
  );

  // Animated price counter
  const [animatedPrice, setAnimatedPrice] = useState<number>(totalPrice);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setAnimatedPrice(totalPrice);
      return;
    }

    const startValue = animatedPrice;
    const endValue = totalPrice;
    if (startValue === endValue) return;

    const durationMs = 260;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPrice(
        Math.round(startValue + (endValue - startValue) * eased)
      );
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [totalPrice]);

  // Count of customized options
  const selectedOptionsCount = useMemo(() => {
    return (
      1 +
      1 +
      config.enabledPlatforms.length +
      activeSelectedFeatures.length
    );
  }, [config.enabledPlatforms.length, activeSelectedFeatures.length]);

  const triggerPreviewCrossfade = () => {
    setIsStageCrossfading(true);
    window.setTimeout(() => setIsStageCrossfading(false), 320);
  };

  const handleStageViewToggle = (nextView: 'profile' | 'workspace') => {
    if (nextView === stageView) return;
    soundFx.playTick();
    triggerPreviewCrossfade();
    setStageView(nextView);
  };

  const goToStep = (index: number, openEditor = false) => {
    const clamped = Math.max(0, Math.min(studioSchema.steps.length - 1, index));
    soundFx.playTick();
    setCurrentStepIndex(clamped);
    if (openEditor) {
      const targetStepId = studioSchema.steps[clamped]?.id;
      if (targetStepId) {
        setEditingSections((prev) => ({ ...prev, [targetStepId]: true }));
      }
    }
  };

  const handleSelectRoleEmployee = (role: RoleOption) => {
    soundFx.playPop();
    const matchedCandidate = liveCandidates.find(
      (c) => c.id === role.candidateId
    );
    setConfig({
      candidateId: role.candidateId,
      roleId: role.id,
      customRoleTitle: matchedCandidate?.role || role.title,
      customPrice: matchedCandidate?.annualSalaryUsd || role.price,
      customSalary: matchedCandidate?.traditionalSalaryUsd || role.salary,
      customAvatarSrc: matchedCandidate?.imageSrc || role.cutoutSrc,
      selectedUseCaseId: role.useCases[0]?.id || '',
      enabledPlatforms: [...role.platforms],
      selectedFeatureIds: [],
      employeeName: matchedCandidate?.name || role.defaultName,
      paymentTerm: 'annual-direct',
    });
    if (matchedCandidate && onSwitchCandidate) {
      onSwitchCandidate(matchedCandidate);
    }
    triggerPreviewCrossfade();
  };

  const handleResetConfiguration = () => {
    soundFx.playTick();
    const fresh = createInitialConfigFromCandidate(
      matchedHomeCandidate || initialCandidate
    );
    setConfig(fresh);
    setCurrentStepIndex(0);
    triggerPreviewCrossfade();
  };

  const handleSaveEmployeeToSite = () => {
    soundFx.playHireChime();
    onSaveConfig?.(config);
    const targetCandidateId =
      config.candidateId || currentRole.candidateId || initialCandidate?.id;
    if (targetCandidateId) {
      updateCandidate(targetCandidateId, {
        name: config.employeeName.trim() || currentRole.defaultName,
        role: effectiveRoleTitle,
        annualSalaryUsd: totalPrice,
        traditionalSalaryUsd: effectiveSalary,
        bio: currentRole.resumeAboutMe,
        ...(config.customAvatarSrc ? { imageSrc: config.customAvatarSrc } : {}),
      });
    }
    saveCurrentVersion(
      `Saved ${config.employeeName || currentRole.defaultName} (${effectiveRoleTitle})`
    );
    setSaveFeedbackText('Saved');
    notifySaved(
      `Saved ${config.employeeName || currentRole.defaultName} (${effectiveRoleTitle}) · Price: $${totalPrice.toLocaleString()}`
    );
    window.setTimeout(() => setSaveFeedbackText(null), 2200);
  };

  const handlePhotoUpload = async (file: File) => {
    setIsUploadingPhoto(true);
    try {
      soundFx.playTick();
      const cutoutDataUrl = await processSingleHeadshotFile(file, true);
      setConfig((prev) => ({
        ...prev,
        customAvatarSrc: cutoutDataUrl,
      }));
      updateRoleInSchema(currentRole.id, { cutoutSrc: cutoutDataUrl });
      const targetCandidateId =
        config.candidateId || currentRole.candidateId || initialCandidate?.id;
      if (targetCandidateId) {
        updateCandidate(targetCandidateId, { imageSrc: cutoutDataUrl });
      }
      soundFx.playHireChime();
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Studio Builder Schema Helpers (also syncs to home page candidates)
  const updateRoleInSchema = (roleId: RoleId, patch: Partial<RoleOption>) => {
    setStudioSchema((prev) => ({
      ...prev,
      roles: prev.roles.map((r) => (r.id === roleId ? { ...r, ...patch } : r)),
    }));
    const targetRole = studioSchema.roles.find((r) => r.id === roleId);
    if (targetRole) {
      const candidatePatch: Partial<Candidate> = {};
      if (patch.title !== undefined) candidatePatch.role = patch.title;
      if (patch.defaultName !== undefined) candidatePatch.name = patch.defaultName;
      if (patch.salary !== undefined) candidatePatch.traditionalSalaryUsd = patch.salary;
      if (patch.price !== undefined) candidatePatch.annualSalaryUsd = patch.price;
      if (patch.resumeAboutMe !== undefined) candidatePatch.bio = patch.resumeAboutMe;
      if (patch.cutoutSrc !== undefined) candidatePatch.imageSrc = patch.cutoutSrc;
      if (Object.keys(candidatePatch).length > 0) {
        updateCandidate(targetRole.candidateId, candidatePatch);
      }
    }
  };

  const updateStepInSchema = (stepId: StepId, patch: Partial<StepMeta>) => {
    setStudioSchema((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
    }));
  };

  const updateUseCaseInSchema = (
    roleId: RoleId,
    useCaseId: string,
    patch: Partial<RoleUseCaseOption>
  ) => {
    setStudioSchema((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === roleId
          ? {
              ...r,
              useCases: r.useCases.map((u) =>
                u.id === useCaseId ? { ...u, ...patch } : u
              ),
            }
          : r
      ),
    }));
  };

  const updateWorkflowStepInSchema = (
    roleId: RoleId,
    stepNumber: string,
    patch: Partial<WorkflowStep>
  ) => {
    setStudioSchema((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === roleId
          ? {
              ...r,
              workflowSteps: r.workflowSteps.map((s) =>
                s.stepNumber === stepNumber ? { ...s, ...patch } : s
              ),
            }
          : r
      ),
    }));
  };

  const updateFeatureInSchema = (
    roleId: RoleId,
    featureId: string,
    patch: Partial<RoleFeatureAddon>
  ) => {
    setStudioSchema((prev) => ({
      ...prev,
      roleFeatures: {
        ...prev.roleFeatures,
        [roleId]: (prev.roleFeatures[roleId] || []).map((f) =>
          f.id === featureId ? { ...f, ...patch } : f
        ),
      },
    }));
  };

  const addFeatureToRoleInSchema = (roleId: RoleId) => {
    const existing = studioSchema.roleFeatures[roleId] || [];
    if (existing.length >= 3) return;
    soundFx.playPop();
    const newAddon: RoleFeatureAddon = {
      id: `${roleId}-addon-${Date.now().toString(36)}`,
      roleId,
      title: 'Custom Resume Capability Add-On',
      description:
        'Autonomous cross-app workflow module tailored to your team playbook.',
      metricBadge: '24/7 Execution',
      price: 750,
    };
    setStudioSchema((prev) => ({
      ...prev,
      roleFeatures: {
        ...prev.roleFeatures,
        [roleId]: [...(prev.roleFeatures[roleId] || []), newAddon],
      },
    }));
  };

  const removeFeatureFromRoleInSchema = (
    roleId: RoleId,
    featureId: string
  ) => {
    soundFx.playTick();
    setStudioSchema((prev) => ({
      ...prev,
      roleFeatures: {
        ...prev.roleFeatures,
        [roleId]: (prev.roleFeatures[roleId] || []).filter(
          (f) => f.id !== featureId
        ),
      },
    }));
    setConfig((prev) => ({
      ...prev,
      selectedFeatureIds: prev.selectedFeatureIds.filter(
        (id) => id !== featureId
      ),
    }));
  };

  const currentStepMeta =
    studioSchema.steps[currentStepIndex] || studioSchema.steps[0];

  // Whether the active section's clickable editor is open
  const isCurrentSectionEditing =
    isBuilderMode || Boolean(editingSections[currentStepMeta.id]);

  // Same employee cutout image as the home page
  const activeEmployeeCutoutSrc =
    matchedHomeCandidate?.imageSrc ||
    config.customAvatarSrc ||
    currentRole.cutoutSrc;

  const configurationJsonPreview = useMemo(
    () =>
      JSON.stringify(
        {
          employeeName: config.employeeName || currentRole.defaultName,
          role: effectiveRoleTitle,
          salary: `$${effectiveSalary.toLocaleString()}/yr`,
          price: `$${totalPrice.toLocaleString()}`,
          savingsPercent: `${savingsPercentage}%`,
          sections: {
            '1_role': {
              id: currentRole.id,
              title: effectiveRoleTitle,
              name: config.employeeName || currentRole.defaultName,
              salary: `$${effectiveSalary.toLocaleString()}/yr`,
              basePrice: `$${effectiveBasePrice.toLocaleString()}`,
            },
            '2_useCase': {
              id: currentUseCase?.id,
              title: currentUseCase?.title,
              metricBadge: currentUseCase?.metricBadge,
            },
            '3_apps': config.enabledPlatforms,
            '4_addOns': activeSelectedFeatures.map((f) => ({
              id: f.id,
              title: f.title,
              price: `+$${f.price.toLocaleString()}`,
            })),
            '5_payment': {
              term: config.paymentTerm,
              totalPrice: `$${totalPrice.toLocaleString()}`,
              annualSavings: `$${annualSavingsUsd.toLocaleString()}/yr`,
            },
          },
        },
        null,
        2
      ),
    [
      config,
      currentRole,
      effectiveRoleTitle,
      effectiveSalary,
      effectiveBasePrice,
      totalPrice,
      savingsPercentage,
      currentUseCase,
      activeSelectedFeatures,
      annualSavingsUsd,
    ]
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-mono-numbers flex flex-col pb-24 selection:bg-[#111111] selection:text-white">
      {/* Hidden Photo Upload Input */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoUpload(file);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* ====================================================================
          TOP NAVIGATION BAR (Minimal, Clean, Same Font as "Hire for 90% less")
         ==================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-black/10 px-4 sm:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Lineup + Focused Employee Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundFx.playTick();
                onBackToLineup();
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-[#111111] border border-black/15 text-xs font-mono-numbers font-bold tracking-tight transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-mono-numbers font-bold tracking-tight text-[#111111]">
                {studioSchema.studioTitle}
              </span>
              <span className="text-neutral-300">/</span>
              <span className="text-xs font-mono-numbers font-semibold text-neutral-600">
                {config.employeeName.trim() || currentRole.defaultName} ·{' '}
                {effectiveRoleTitle}
              </span>
            </div>
          </div>

          {/* Center: Quick Employee Switcher Pills (Same 6 Employees as Home Page) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {syncedRoles.map((r, idx) => {
              const isCurrent = r.id === config.roleId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRoleEmployee(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-numbers font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-black/10'
                  }`}
                >
                  <span className="opacity-60">0{idx + 1}</span>
                  <span>{r.defaultName}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Edit Studio Toggle + Save + Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playPop();
                setIsBuilderMode(!isBuilderMode);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-numbers font-bold tracking-tight border transition-colors cursor-pointer ${
                isBuilderMode
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-[#111111] border-black/15 hover:bg-neutral-100'
              }`}
              title="Toggle Studio Editor across all sections"
            >
              <Pencil className="h-3 w-3 text-emerald-500" />
              <span>{isBuilderMode ? 'Editing All' : 'Edit Studio'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveEmployeeToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono-numbers font-bold tracking-tight transition-colors cursor-pointer"
              title="Save employee configuration"
            >
              <Save className="h-3 w-3" />
              <span>{saveFeedbackText || 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetConfiguration}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono-numbers font-semibold text-neutral-600 hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
              title="Reset employee configuration"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN SPLIT CONFIGURATOR WORKSPACE (60% Left Stage / 40% Right Panel)
         ==================================================================== */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row">
        {/* ==================================================================
            LEFT ~60%: HOME PAGE EMPLOYEE CUTOUT & RESUME WORKSPACE STAGE
           ================================================================== */}
        <div className="w-full lg:w-[58%] h-[46vh] sm:h-[52vh] lg:h-[calc(100vh-128px)] sticky top-[53px] z-20 lg:z-10 bg-[#FAFAFA] border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
          {/* Top Stage Bar: Quick Edit / Photo Upload */}
          <div className="relative z-10 flex flex-wrap items-center justify-end gap-2">
            {/* Right Controls: Quick Edit / Photo Upload */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleSectionEditor(currentStepMeta.id)}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono-numbers font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isCurrentSectionEditing
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white hover:bg-neutral-100 text-[#111111] border-black/15'
                }`}
                title="Click to edit current section"
              >
                <Pencil className="h-3 w-3 text-emerald-500" />
                <span>
                  {isCurrentSectionEditing
                    ? `Done Editing ${currentStepMeta.tabLabel}`
                    : `Edit ${currentStepMeta.tabLabel}`}
                </span>
              </button>

              {isCurrentSectionEditing && (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-[#111111] border border-black/15 text-[11px] font-mono-numbers font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Upload new employee cutout photo"
                >
                  <Upload className="h-3 w-3 text-emerald-600" />
                  <span>{isUploadingPhoto ? '...' : 'Photo'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Center Stage Area with Smooth Crossfade */}
          <div
            className={`relative z-10 flex-1 min-h-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
              isStageCrossfading
                ? 'opacity-0 scale-[1.01]'
                : 'opacity-100 scale-100'
            }`}
          >
            {stageView === 'profile' ? (
              /* ==============================================================
                 PROFILE VIEW: SAME GROUNDED EMPLOYEE CUTOUT AS HOME PAGE
                 ============================================================== */
              <div className="w-full h-full flex flex-col items-center justify-between pt-2 pb-1">
                {/* Grounded Employee Cutout matching the Home Page */}
                <div className="relative flex-1 min-h-0 w-full max-w-md mx-auto flex items-end justify-center border-b border-black/10">
                  <img
                    src={activeEmployeeCutoutSrc}
                    alt={`${config.employeeName || currentRole.defaultName} — ${effectiveRoleTitle}`}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="h-full max-h-[30vh] sm:max-h-[36vh] lg:max-h-[56vh] w-full object-contain object-bottom select-none origin-bottom drop-shadow-[0_14px_20px_rgba(0,0,0,0.12)] transition-all duration-200"
                  />
                </div>

                {/* Employee Identity, Salary, Price & Connected Resume Apps Footer */}
                <div className="w-full pt-3 flex flex-col items-center text-center">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs sm:text-sm font-mono-numbers font-bold text-[#111111] uppercase">
                      {effectiveRoleTitle}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-mono-numbers font-bold tracking-tight text-[#111111]">
                      {config.employeeName.trim() || currentRole.defaultName}
                    </h1>
                    <span className="px-2 py-0.5 rounded-md bg-black/5 text-[10px] font-mono-numbers font-semibold text-neutral-600">
                      {currentUseCase?.title || 'Software Employee'}
                    </span>
                  </div>

                  {/* Salary vs Price (No /mo) + Resume App Badges */}
                  <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 text-xs font-mono-numbers">
                    <span className="text-neutral-500">
                      Salary:{' '}
                      <span className="line-through text-neutral-400">
                        ${effectiveSalary.toLocaleString()}/yr
                      </span>
                    </span>
                    <span className="font-bold text-emerald-700">
                      Price: ${animatedPrice.toLocaleString()}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 text-[10px] font-bold">
                      Save {savingsPercentage}%
                    </span>

                    <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-black/10">
                      {config.enabledPlatforms.map((platform) => (
                        <span
                          key={platform}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-black/10 text-[10px] font-mono-numbers font-semibold text-[#111111]"
                        >
                          <PlatformLogo platform={platform} size={11} />
                          <span className="capitalize">
                            {platform.replace('-', ' ')}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ==============================================================
                 WORKSPACE VIEW: RESUME APPS & 4-STEP AUTONOMOUS WORKFLOW
                 ============================================================== */
              <div className="w-full max-w-2xl bg-white rounded-2xl border border-black/12 shadow-sm p-4 sm:p-6 flex flex-col gap-4 max-h-full overflow-y-auto">
                {/* Workspace Header synced with Employee Resume */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-black/8">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activeEmployeeCutoutSrc}
                      alt={config.employeeName || currentRole.defaultName}
                      className="h-12 w-12 rounded-xl object-cover object-top bg-[#FAFAFA] border border-black/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-numbers text-sm sm:text-base font-bold text-[#111111] truncate">
                          {config.employeeName.trim() || currentRole.defaultName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-mono-numbers font-bold">
                          RESUME WORKSPACE
                        </span>
                      </div>
                      <p className="text-xs font-mono-numbers text-neutral-500 truncate">
                        {effectiveRoleTitle} · Salary: $
                        {effectiveSalary.toLocaleString()}/yr · Price: $
                        {animatedPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Connected Resume Apps */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {config.enabledPlatforms.map((p) => (
                      <div
                        key={p}
                        className="h-8 w-8 rounded-lg bg-[#FAFAFA] border border-black/10 flex items-center justify-center"
                        title={`Connected Resume App: ${p}`}
                      >
                        <PlatformLogo platform={p} size={16} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resume About Me Summary */}
                <div className="rounded-xl bg-[#FAFAFA] border border-black/8 p-3.5">
                  <div className="text-[10px] font-mono-numbers font-bold uppercase text-neutral-500 mb-1">
                    RESUME BRIEF · ACTIVE USE CASE: {currentUseCase?.title}
                  </div>
                  <p className="text-xs font-mono-numbers text-[#111111] leading-relaxed">
                    {currentRole.resumeAboutMe}
                  </p>
                </div>

                {/* 4-Step Resume App Execution Pipeline */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono-numbers font-bold uppercase text-neutral-500">
                      CONNECTED RESUME APP PIPELINE ({currentRole.workflowSteps.length} STEPS)
                    </span>
                    <span className="text-[11px] font-mono-numbers font-bold text-emerald-700">
                      {currentRole.capacityMultiplier}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentRole.workflowSteps.map((step) => {
                      const isAppEnabled = config.enabledPlatforms.includes(
                        step.platform
                      );
                      return (
                        <div
                          key={step.stepNumber}
                          className={`rounded-xl p-3 border transition-colors ${
                            isAppEnabled
                              ? 'bg-white border-black/12'
                              : 'bg-neutral-100/60 border-black/5 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] font-mono-numbers font-bold text-neutral-400">
                                {step.stepNumber}
                              </span>
                              <PlatformLogo platform={step.platform} size={15} />
                              <span className="text-xs font-mono-numbers font-bold text-[#111111] truncate">
                                {step.actionTitle}
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 text-[10px] font-mono-numbers font-bold shrink-0">
                              {step.metricBadge}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[11px] font-mono-numbers text-neutral-600 leading-snug">
                            {step.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================================
            RIGHT ~40%: 5 NUMBERED SECTIONS PANEL (Role, Use Case, Apps, Add Ons, Payment)
           ================================================================== */}
        <div className="w-full lg:w-[42%] flex flex-col min-h-[calc(100vh-128px)] bg-[#FAFAFA]">
          {/* Sticky Top Tab Bar + Step Progress */}
          <div className="sticky top-[53px] z-30 bg-[#FAFAFA]/95 backdrop-blur-md border-b border-black/10 px-5 sm:px-8 pt-4 pb-3">
            {/* Step Progress Indicator (1 of 5) + Back / Next */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono-numbers font-bold text-neutral-500">
                Section {currentStepIndex + 1} of {studioSchema.steps.length}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={() => goToStep(currentStepIndex - 1)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-black/15 bg-white hover:bg-neutral-100 disabled:opacity-35 disabled:pointer-events-none text-xs font-mono-numbers font-bold text-[#111111] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={currentStepIndex === studioSchema.steps.length - 1}
                  onClick={() => goToStep(currentStepIndex + 1)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#111111] bg-[#111111] hover:bg-neutral-800 disabled:opacity-35 disabled:pointer-events-none text-xs font-mono-numbers font-bold text-white transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* 5 Numbered Section Tabs: 1. Role | 2. Use Case | 3. Apps | 4. Add Ons | 5. Payment */}
            <div
              role="tablist"
              aria-label="Studio Builder Sections"
              className="grid grid-cols-5 gap-1"
            >
              {studioSchema.steps.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isCompleted = idx < currentStepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => goToStep(idx)}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-mono-numbers font-bold tracking-tight transition-all cursor-pointer truncate text-center border ${
                      isActive
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : isCompleted
                        ? 'bg-white text-[#111111] border-black/20 hover:bg-neutral-100'
                        : 'bg-white/60 text-neutral-500 border-black/10 hover:text-[#111111] hover:bg-white'
                    }`}
                  >
                    {step.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content Container */}
          <div
            key={currentStepMeta.id}
            className="flex-1 px-5 sm:px-8 py-6 sm:py-8 animate-[ panelSlideIn_0.28s_ease-out ]"
          >
            {/* Numbered Step Header + Clickable Section Editor Button */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-mono-numbers font-bold uppercase text-neutral-500">
                  {currentStepMeta.categoryKicker}
                </div>

                {/* Clickable Section Editor Toggle Button for Each Section */}
                <button
                  type="button"
                  onClick={() => toggleSectionEditor(currentStepMeta.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono-numbers font-bold border transition-colors cursor-pointer ${
                    isCurrentSectionEditing
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white hover:bg-neutral-100 text-[#111111] border-black/15'
                  }`}
                >
                  {isCurrentSectionEditing ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Done Editing</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="h-3 w-3 text-emerald-600" />
                      <span>Edit Section</span>
                    </>
                  )}
                </button>
              </div>

              {isCurrentSectionEditing ? (
                <div className="mt-2.5 flex flex-col gap-2.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-500/35">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-numbers font-bold uppercase text-emerald-800">
                      SECTION HEADER EDITOR ({currentStepMeta.tabLabel})
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSectionEditor(currentStepMeta.id, false)}
                      className="text-neutral-500 hover:text-[#111111] cursor-pointer"
                      title="Close section editor"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono-numbers font-bold uppercase text-neutral-500 mb-0.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={currentStepMeta.title}
                        onChange={(e) =>
                          updateStepInSchema(currentStepMeta.id, {
                            title: e.target.value,
                            tabLabel: e.target.value,
                          })
                        }
                        className="w-full font-mono-numbers text-sm font-bold text-[#111111] bg-white border border-black/15 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono-numbers font-bold uppercase text-neutral-500 mb-0.5">
                        Section Kicker
                      </label>
                      <input
                        type="text"
                        value={currentStepMeta.categoryKicker}
                        onChange={(e) =>
                          updateStepInSchema(currentStepMeta.id, {
                            categoryKicker: e.target.value,
                          })
                        }
                        className="w-full font-mono-numbers text-xs font-bold text-[#111111] bg-white border border-black/15 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono-numbers font-bold uppercase text-neutral-500 mb-0.5">
                      Section Description
                    </label>
                    <textarea
                      rows={2}
                      value={currentStepMeta.whyThisMatters}
                      onChange={(e) =>
                        updateStepInSchema(currentStepMeta.id, {
                          whyThisMatters: e.target.value,
                        })
                      }
                      className="w-full text-xs font-mono-numbers text-neutral-700 bg-white border border-black/15 rounded-lg p-2"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2
                    onClick={() => toggleSectionEditor(currentStepMeta.id, true)}
                    title="Click to edit section"
                    className="mt-1 text-2xl sm:text-3xl font-mono-numbers font-bold tracking-tight text-[#111111] cursor-pointer hover:text-emerald-800 transition-colors"
                  >
                    {currentStepMeta.title}
                  </h2>
                  <p
                    onClick={() => toggleSectionEditor(currentStepMeta.id, true)}
                    title="Click to edit description"
                    className="mt-2 text-xs font-mono-numbers text-neutral-600 leading-relaxed bg-white border border-black/10 hover:border-black/25 rounded-xl p-3 cursor-pointer transition-colors"
                  >
                    {currentStepMeta.whyThisMatters}
                  </p>
                </>
              )}
            </div>

            {/* ==============================================================
                SECTION 1: ROLE (Reflects Exact Same Employees on Home Page)
               ============================================================== */}
            {currentStepMeta.id === 'role' && (
              <div className="flex flex-col gap-5">
                {/* Active Selected Employee Summary Card (Synced with Home Page & Resume) */}
                <div className="rounded-2xl bg-white border-2 border-[#111111] p-5 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <img
                        src={activeEmployeeCutoutSrc}
                        alt={config.employeeName || currentRole.defaultName}
                        className="h-14 w-14 rounded-xl object-contain object-bottom bg-[#FAFAFA] border border-black/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono-numbers font-bold uppercase text-emerald-700">
                          SELECTED SOFTWARE EMPLOYEE
                        </span>
                        {isCurrentSectionEditing ? (
                          <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-mono-numbers font-bold uppercase text-neutral-500">
                                Role Title
                              </label>
                              <input
                                type="text"
                                value={effectiveRoleTitle}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setConfig((prev) => ({
                                    ...prev,
                                    customRoleTitle: val,
                                  }));
                                  updateRoleInSchema(currentRole.id, {
                                    title: val,
                                  });
                                }}
                                placeholder="Role Title"
                                className="mt-0.5 w-full font-mono-numbers text-xs font-bold text-[#111111] bg-emerald-50/60 border border-emerald-500/40 rounded-lg px-2.5 py-1.5"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono-numbers font-bold uppercase text-neutral-500">
                                Employee Name
                              </label>
                              <input
                                type="text"
                                value={config.employeeName}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setConfig((prev) => ({
                                    ...prev,
                                    employeeName: val,
                                  }));
                                  updateRoleInSchema(currentRole.id, {
                                    defaultName: val,
                                  });
                                }}
                                placeholder="Employee Name"
                                className="mt-0.5 w-full font-mono-numbers text-xs font-bold text-[#111111] bg-emerald-50/60 border border-emerald-500/40 rounded-lg px-2.5 py-1.5"
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => toggleSectionEditor('role', true)}
                            className="mt-0.5 cursor-pointer group"
                            title="Click to edit Role and Name"
                          >
                            <div className="text-base sm:text-lg font-mono-numbers font-bold tracking-tight text-[#111111] group-hover:text-emerald-700 transition-colors">
                              Role: {effectiveRoleTitle}
                            </div>
                            <div className="text-xs sm:text-sm font-mono-numbers font-semibold text-neutral-700 mt-0.5">
                              Name:{' '}
                              {config.employeeName.trim() ||
                                currentRole.defaultName}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSectionEditor('role')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-[10px] font-mono-numbers font-bold text-[#111111] cursor-pointer shrink-0"
                    >
                      <Pencil className="h-2.5 w-2.5 text-emerald-600" />
                      <span>{isCurrentSectionEditing ? 'Done' : 'Edit'}</span>
                    </button>
                  </div>

                  {/* Salary vs Price (No /mo) Breakdown */}
                  <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-xl bg-[#FAFAFA] border border-black/10 p-3">
                    <div>
                      <div className="text-[10px] font-mono-numbers font-bold uppercase text-neutral-500">
                        Salary
                      </div>
                      {isCurrentSectionEditing ? (
                        <input
                          type="number"
                          value={effectiveSalary}
                          onChange={(e) => {
                            const nextSal = Math.max(
                              1,
                              Number(e.target.value) || 1
                            );
                            setConfig((prev) => ({
                              ...prev,
                              customSalary: nextSal,
                            }));
                            updateRoleInSchema(currentRole.id, {
                              salary: nextSal,
                            });
                          }}
                          className="mt-0.5 w-full text-xs font-mono-numbers font-bold text-neutral-600 bg-white border border-black/20 rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <div
                          onClick={() => toggleSectionEditor('role', true)}
                          className="text-sm sm:text-base font-mono-numbers font-bold text-neutral-400 line-through mt-0.5 cursor-pointer"
                          title="Click to edit Salary"
                        >
                          ${effectiveSalary.toLocaleString()}/yr
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-[10px] font-mono-numbers font-bold uppercase text-neutral-500">
                        Price
                      </div>
                      {isCurrentSectionEditing ? (
                        <input
                          type="number"
                          value={effectiveBasePrice}
                          onChange={(e) => {
                            const nextPrice = Math.max(
                              0,
                              Number(e.target.value) || 0
                            );
                            setConfig((prev) => ({
                              ...prev,
                              customPrice: nextPrice,
                            }));
                            updateRoleInSchema(currentRole.id, {
                              price: nextPrice,
                            });
                          }}
                          className="mt-0.5 w-full text-xs font-mono-numbers font-bold text-emerald-700 bg-white border border-black/20 rounded px-1.5 py-0.5"
                        />
                      ) : (
                        <div
                          onClick={() => toggleSectionEditor('role', true)}
                          className="text-sm sm:text-base font-mono-numbers font-bold text-emerald-700 mt-0.5 cursor-pointer"
                          title="Click to edit Price"
                        >
                          ${effectiveBasePrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-[10px] font-mono-numbers font-bold uppercase text-neutral-500">
                        90% Savings
                      </div>
                      <div className="text-sm sm:text-base font-mono-numbers font-bold text-[#111111] mt-0.5">
                        -${annualSavingsUsd.toLocaleString()}/yr
                      </div>
                    </div>
                  </div>

                  {/* Resume About Me & Skills Copy */}
                  <div className="mt-3.5 pt-3.5 border-t border-black/8">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] font-mono-numbers font-bold uppercase text-neutral-500">
                        FROM {(config.employeeName || currentRole.defaultName).toUpperCase()}’S RESUME
                      </div>
                      {isCurrentSectionEditing && (
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="inline-flex items-center gap-1 text-[10px] font-mono-numbers font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          <Upload className="h-2.5 w-2.5" />
                          <span>Change Cutout Photo</span>
                        </button>
                      )}
                    </div>
                    {isCurrentSectionEditing ? (
                      <textarea
                        rows={3}
                        value={currentRole.resumeAboutMe}
                        onChange={(e) =>
                          updateRoleInSchema(currentRole.id, {
                            resumeAboutMe: e.target.value,
                          })
                        }
                        className="w-full text-xs font-mono-numbers text-neutral-700 bg-[#FAFAFA] border border-black/15 rounded-lg p-2.5"
                      />
                    ) : (
                      <p
                        onClick={() => toggleSectionEditor('role', true)}
                        title="Click to edit resume bio"
                        className="text-xs font-mono-numbers text-neutral-700 leading-relaxed cursor-pointer hover:text-[#111111]"
                      >
                        {currentRole.resumeAboutMe}
                      </p>
                    )}
                  </div>
                </div>

                {/* All 6 Home Page Employees Selector Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono-numbers font-bold text-neutral-500">
                      Home Page Employees (6 Roles)
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSectionEditor('role')}
                      className="text-[11px] font-mono-numbers font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {isCurrentSectionEditing ? 'Done Editing Roles' : 'Click to Edit Roles'}
                    </button>
                  </div>
                  <div
                    role="radiogroup"
                    aria-label="Select Software Employee Role"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    {syncedRoles.map((role) => {
                      const isSelected = config.roleId === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSelectRoleEmployee(role)}
                          className={`group text-left rounded-2xl p-3.5 border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                            isSelected
                              ? 'bg-white border-[#111111] ring-1 ring-[#111111] shadow-xs'
                              : 'bg-white/80 hover:bg-white border-black/10 hover:border-black/25'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={role.cutoutSrc}
                                alt={role.defaultName}
                                className="h-11 w-11 rounded-xl object-contain object-bottom bg-[#FAFAFA] border border-black/10 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-mono-numbers text-xs font-bold text-[#111111] truncate">
                                  Role: {role.title}
                                </div>
                                <div className="font-mono-numbers text-[11px] font-semibold text-neutral-600 mt-0.5 truncate">
                                  Name: {role.defaultName}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`h-4 w-4 rounded-full flex items-center justify-center border shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'bg-[#111111] border-[#111111] text-white'
                                  : 'border-black/20'
                              }`}
                            >
                              {isSelected && <Check className="h-2.5 w-2.5" />}
                            </span>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-black/6 flex flex-col gap-0.5 text-[11px] font-mono-numbers">
                            <div className="text-neutral-500">
                              Salary:{' '}
                              <span className="line-through text-neutral-400">
                                ${role.salary.toLocaleString()}/yr
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-700 font-bold">
                                Price: ${role.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-[#111111]">
                                Included (-90%)
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                SECTION 2: USE CASE
                Three options: Software Employee, Employee Infrastructure, Role intelligence
               ============================================================== */}
            {currentStepMeta.id === 'use-case' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono-numbers text-neutral-600">
                  <span>
                    Use cases for{' '}
                    <strong className="font-bold text-[#111111]">
                      {config.employeeName || currentRole.defaultName}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSectionEditor('use-case')}
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>
                      {isCurrentSectionEditing ? 'Done Editing' : 'Click to Edit Use Cases'}
                    </span>
                  </button>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Primary Use Case"
                  className="flex flex-col gap-3"
                >
                  {availableUseCases.map((uc, idx) => {
                    const isSelected = currentUseCase?.id === uc.id;
                    return (
                      <div
                        key={uc.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            soundFx.playPop();
                            setConfig((prev) => ({
                              ...prev,
                              selectedUseCaseId: uc.id,
                            }));
                          }
                        }}
                        onClick={() => {
                          soundFx.playPop();
                          setConfig((prev) => ({
                            ...prev,
                            selectedUseCaseId: uc.id,
                          }));
                        }}
                        className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                          isSelected
                            ? 'bg-white border-[#111111] ring-1 ring-[#111111] shadow-xs'
                            : 'bg-white/85 hover:bg-white border-black/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded bg-black/5 text-neutral-600">
                                OPTION 0{idx + 1}
                              </span>
                              {isCurrentSectionEditing ? (
                                <input
                                  type="text"
                                  value={uc.metricBadge}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    updateUseCaseInSchema(config.roleId, uc.id, {
                                      metricBadge: e.target.value,
                                    })
                                  }
                                  className="text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-500/40 text-emerald-700"
                                />
                              ) : (
                                <span className="text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700">
                                  {uc.metricBadge}
                                </span>
                              )}
                            </div>

                            {isCurrentSectionEditing ? (
                              <input
                                type="text"
                                value={uc.title}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  updateUseCaseInSchema(config.roleId, uc.id, {
                                    title: e.target.value,
                                  })
                                }
                                className="mt-2 w-full font-mono-numbers text-sm font-bold text-[#111111] bg-emerald-50/60 border border-emerald-500/30 rounded px-2.5 py-1"
                              />
                            ) : (
                              <h3 className="mt-2 font-mono-numbers text-sm sm:text-base font-bold text-[#111111]">
                                {uc.title}
                              </h3>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionEditor('use-case');
                              }}
                              className="px-2 py-0.5 rounded bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-[10px] font-mono-numbers font-bold text-neutral-600 hover:text-[#111111] cursor-pointer"
                              title="Edit this use case"
                            >
                              {isCurrentSectionEditing ? 'Done' : 'Edit'}
                            </button>
                            <span className="text-xs font-mono-numbers font-bold text-emerald-700">
                              Included
                            </span>
                            <span
                              className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-[#111111] border-[#111111] text-white'
                                  : 'border-black/20'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>
                          </div>
                        </div>

                        {isCurrentSectionEditing ? (
                          <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                            <div>
                              <label className="block text-[9px] font-mono-numbers font-bold uppercase text-neutral-500">
                                Use Case Summary
                              </label>
                              <textarea
                                rows={2}
                                value={uc.summary}
                                onChange={(e) =>
                                  updateUseCaseInSchema(config.roleId, uc.id, {
                                    summary: e.target.value,
                                  })
                                }
                                className="mt-0.5 w-full text-xs font-mono-numbers text-neutral-700 bg-emerald-50/50 border border-emerald-500/30 rounded p-2"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono-numbers font-bold uppercase text-neutral-500">
                                Resume Track Record
                              </label>
                              <input
                                type="text"
                                value={uc.resumeProof}
                                onChange={(e) =>
                                  updateUseCaseInSchema(config.roleId, uc.id, {
                                    resumeProof: e.target.value,
                                  })
                                }
                                className="mt-0.5 w-full text-xs font-mono-numbers text-neutral-700 bg-emerald-50/50 border border-emerald-500/30 rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mt-2 text-xs font-mono-numbers text-neutral-600 leading-relaxed">
                              {uc.summary}
                            </p>

                            <div className="mt-3 rounded-xl bg-[#FAFAFA] border border-black/8 p-2.5 text-[11px] font-mono-numbers text-neutral-700">
                              <span className="font-bold text-[#111111]">
                                Resume Track Record:{' '}
                              </span>
                              {uc.resumeProof}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==============================================================
                SECTION 3: APPS (Exact Apps from Employee Resume + Full Stack)
               ============================================================== */}
            {currentStepMeta.id === 'apps' && (
              <div className="flex flex-col gap-5">
                {/* Core Resume Workflow Apps (4 Steps from Resume) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono-numbers font-bold text-[#111111]">
                      Core Resume Apps for {config.employeeName || currentRole.defaultName}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSectionEditor('apps')}
                        className="inline-flex items-center gap-1 text-[11px] font-mono-numbers font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>{isCurrentSectionEditing ? 'Done Editing' : 'Edit App Steps'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {currentRole.workflowSteps.map((step) => {
                      const isEnabled = config.enabledPlatforms.includes(
                        step.platform
                      );
                      return (
                        <div
                          key={step.stepNumber}
                          role="checkbox"
                          aria-checked={isEnabled}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              soundFx.playPop();
                              setConfig((prev) => {
                                const exists = prev.enabledPlatforms.includes(
                                  step.platform
                                );
                                return {
                                  ...prev,
                                  enabledPlatforms: exists
                                    ? prev.enabledPlatforms.filter(
                                        (p) => p !== step.platform
                                      )
                                    : [...prev.enabledPlatforms, step.platform],
                                };
                              });
                            }
                          }}
                          onClick={() => {
                            soundFx.playPop();
                            setConfig((prev) => {
                              const exists = prev.enabledPlatforms.includes(
                                step.platform
                              );
                              return {
                                ...prev,
                                enabledPlatforms: exists
                                  ? prev.enabledPlatforms.filter(
                                      (p) => p !== step.platform
                                    )
                                  : [...prev.enabledPlatforms, step.platform],
                              };
                            });
                          }}
                          className={`rounded-2xl p-4 border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                            isEnabled
                              ? 'bg-white border-[#111111] ring-1 ring-[#111111] shadow-xs'
                              : 'bg-white/70 border-black/10 opacity-75'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="h-9 w-9 rounded-xl bg-[#FAFAFA] border border-black/10 flex items-center justify-center shrink-0">
                                <PlatformLogo
                                  platform={step.platform}
                                  size={18}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono-numbers font-bold text-neutral-400">
                                    STEP {step.stepNumber}
                                  </span>
                                  {isCurrentSectionEditing ? (
                                    <input
                                      type="text"
                                      value={step.actionTitle}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) =>
                                        updateWorkflowStepInSchema(
                                          config.roleId,
                                          step.stepNumber,
                                          { actionTitle: e.target.value }
                                        )
                                      }
                                      className="font-mono-numbers text-xs font-bold text-[#111111] bg-emerald-50/60 border border-emerald-500/30 rounded px-2 py-0.5 w-full"
                                    />
                                  ) : (
                                    <span className="font-mono-numbers text-sm font-bold text-[#111111] truncate">
                                      {step.actionTitle}
                                    </span>
                                  )}
                                </div>
                                {isCurrentSectionEditing ? (
                                  <input
                                    type="text"
                                    value={step.metricBadge}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      updateWorkflowStepInSchema(
                                        config.roleId,
                                        step.stepNumber,
                                        { metricBadge: e.target.value }
                                      )
                                    }
                                    className="mt-1 text-[10px] font-mono-numbers font-bold text-emerald-700 bg-emerald-50/60 border border-emerald-500/30 rounded px-1.5 py-0.5"
                                  />
                                ) : (
                                  <span className="text-[11px] font-mono-numbers font-bold text-emerald-700">
                                    {step.metricBadge} · Included
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSectionEditor('apps');
                                }}
                                className="px-2 py-0.5 rounded bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-[10px] font-mono-numbers font-bold text-neutral-600 hover:text-[#111111] cursor-pointer"
                              >
                                {isCurrentSectionEditing ? 'Done' : 'Edit'}
                              </button>
                              <span
                                className={`h-5 w-5 rounded-md flex items-center justify-center border shrink-0 ${
                                  isEnabled
                                    ? 'bg-[#111111] border-[#111111] text-white'
                                    : 'border-black/25 bg-transparent'
                                }`}
                              >
                                {isEnabled && <Check className="h-3.5 w-3.5" />}
                              </span>
                            </div>
                          </div>

                          {isCurrentSectionEditing ? (
                            <textarea
                              rows={2}
                              value={step.description}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                updateWorkflowStepInSchema(
                                  config.roleId,
                                  step.stepNumber,
                                  { description: e.target.value }
                                )
                              }
                              className="mt-2.5 w-full text-xs font-mono-numbers text-neutral-700 bg-emerald-50/50 border border-emerald-500/30 rounded p-2"
                            />
                          ) : (
                            <p className="mt-2.5 text-xs font-mono-numbers text-neutral-600 leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Workspace App Integrations */}
                <div className="pt-2 border-t border-black/10">
                  <div className="text-xs font-mono-numbers font-bold text-neutral-500 mb-2.5">
                    Additional Workspace Integrations (Included)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SOFTWARE_APPLICATIONS.map((app) => {
                      const isActive = config.enabledPlatforms.includes(app.id);
                      return (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => {
                            soundFx.playTick();
                            setConfig((prev) => {
                              const exists = prev.enabledPlatforms.includes(
                                app.id
                              );
                              return {
                                ...prev,
                                enabledPlatforms: exists
                                  ? prev.enabledPlatforms.filter(
                                      (p) => p !== app.id
                                    )
                                  : [...prev.enabledPlatforms, app.id],
                              };
                            });
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-white border-[#111111] text-[#111111] font-bold shadow-2xs'
                              : 'bg-white/60 border-black/10 text-neutral-500 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <PlatformLogo platform={app.id} size={15} />
                            <span className="text-xs font-mono-numbers truncate">
                              {app.name}
                            </span>
                          </div>
                          {isActive && (
                            <Check className="h-3.5 w-3.5 text-[#111111] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                SECTION 4: ADD ONS (Max 3 per role, +$750 each, NO /mo)
               ============================================================== */}
            {currentStepMeta.id === 'add-ons' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono-numbers text-neutral-600">
                  <span>
                    Specialized add-ons for{' '}
                    <strong className="font-bold text-[#111111]">
                      {effectiveRoleTitle}
                    </strong>{' '}
                    (max 3)
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSectionEditor('add-ons')}
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" />
                      <span>
                        {isCurrentSectionEditing ? 'Done Editing' : 'Click to Edit Add-Ons'}
                      </span>
                    </button>
                    <span className="font-mono-numbers font-bold text-[#111111]">
                      {activeSelectedFeatures.length} /{' '}
                      {availableRoleFeatures.length}
                    </span>
                  </div>
                </div>

                <div
                  role="group"
                  aria-label={`Add-on features for ${effectiveRoleTitle}`}
                  className="flex flex-col gap-3"
                >
                  {availableRoleFeatures.map((addon, idx) => {
                    const isSelected = config.selectedFeatureIds.includes(
                      addon.id
                    );
                    return (
                      <div
                        key={addon.id}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            soundFx.playPop();
                            setConfig((prev) => {
                              const exists = prev.selectedFeatureIds.includes(
                                addon.id
                              );
                              return {
                                ...prev,
                                selectedFeatureIds: exists
                                  ? prev.selectedFeatureIds.filter(
                                      (id) => id !== addon.id
                                    )
                                  : [...prev.selectedFeatureIds, addon.id],
                              };
                            });
                          }
                        }}
                        onClick={() => {
                          soundFx.playPop();
                          setConfig((prev) => {
                            const exists = prev.selectedFeatureIds.includes(
                              addon.id
                            );
                            return {
                              ...prev,
                              selectedFeatureIds: exists
                                ? prev.selectedFeatureIds.filter(
                                    (id) => id !== addon.id
                                  )
                                : [...prev.selectedFeatureIds, addon.id],
                            };
                          });
                        }}
                        className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                          isSelected
                            ? 'bg-white border-[#111111] ring-1 ring-[#111111] shadow-xs'
                            : 'bg-white/80 hover:bg-white border-black/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-mono-numbers font-bold text-neutral-400">
                              ADD-ON 0{idx + 1} · {addon.metricBadge}
                            </div>
                            {isCurrentSectionEditing ? (
                              <input
                                type="text"
                                value={addon.title}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  updateFeatureInSchema(
                                    config.roleId,
                                    addon.id,
                                    { title: e.target.value }
                                  )
                                }
                                className="mt-1 w-full font-mono-numbers text-sm font-bold text-[#111111] bg-emerald-50/60 border border-emerald-500/30 rounded px-2 py-1"
                              />
                            ) : (
                              <div className="mt-0.5 font-mono-numbers text-sm sm:text-base font-bold text-[#111111]">
                                {addon.title}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionEditor('add-ons');
                              }}
                              className="px-2 py-0.5 rounded bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-[10px] font-mono-numbers font-bold text-neutral-600 hover:text-[#111111] cursor-pointer"
                            >
                              {isCurrentSectionEditing ? 'Done' : 'Edit'}
                            </button>

                            {isCurrentSectionEditing ? (
                              <input
                                type="number"
                                value={addon.price}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  updateFeatureInSchema(
                                    config.roleId,
                                    addon.id,
                                    {
                                      price: Math.max(
                                        0,
                                        Number(e.target.value) || 0
                                      ),
                                    }
                                  )
                                }
                                className="w-20 text-xs font-mono-numbers font-bold text-[#111111] bg-emerald-50/60 border border-emerald-500/30 rounded px-1.5 py-0.5"
                              />
                            ) : (
                              <span className="text-xs font-mono-numbers font-bold text-emerald-700">
                                +${addon.price.toLocaleString()}
                              </span>
                            )}
                            <span
                              className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? 'bg-[#111111] border-[#111111] text-white'
                                  : 'border-black/25 bg-transparent'
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5" />}
                            </span>
                            {isCurrentSectionEditing && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFeatureFromRoleInSchema(
                                    config.roleId,
                                    addon.id
                                  );
                                }}
                                className="p-1 rounded bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors"
                                title="Remove add-on"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {isCurrentSectionEditing ? (
                          <textarea
                            rows={2}
                            value={addon.description}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              updateFeatureInSchema(config.roleId, addon.id, {
                                description: e.target.value,
                              })
                            }
                            className="mt-2 w-full text-xs font-mono-numbers text-neutral-700 bg-emerald-50/60 border border-emerald-500/30 rounded p-2"
                          />
                        ) : (
                          <p className="mt-2 text-xs font-mono-numbers text-neutral-600 leading-relaxed">
                            {addon.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isCurrentSectionEditing && availableRoleFeatures.length < 3 && (
                  <button
                    type="button"
                    onClick={() => addFeatureToRoleInSchema(config.roleId)}
                    className="py-2.5 px-4 rounded-xl border border-dashed border-black/25 hover:border-[#111111] text-xs font-mono-numbers font-bold text-[#111111] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Role Feature (+$750)</span>
                  </button>
                )}
              </div>
            )}

            {/* ==============================================================
                SECTION 5: PAYMENT (Summary, Name Input, Price Breakdown & Hire)
               ============================================================== */}
            {currentStepMeta.id === 'payment' && (
              <div className="flex flex-col gap-5">
                {/* Employee Name & Role Quick Editor */}
                <div className="rounded-2xl bg-white border border-black/10 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="employee-name-input"
                      className="block text-xs font-mono-numbers font-bold text-neutral-600"
                    >
                      Software Employee Name & Role
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleSectionEditor('payment')}
                      className="inline-flex items-center gap-1 text-[11px] font-mono-numbers font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" />
                      <span>{isCurrentSectionEditing ? 'Done' : 'Edit Pricing'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      id="employee-name-input"
                      type="text"
                      value={config.employeeName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          employeeName: val,
                        }));
                        updateRoleInSchema(currentRole.id, { defaultName: val });
                      }}
                      placeholder={currentRole.defaultName}
                      className="w-full rounded-xl bg-[#FAFAFA] border border-black/15 px-3 py-2 font-mono-numbers text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                    <input
                      type="text"
                      value={effectiveRoleTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({
                          ...prev,
                          customRoleTitle: val,
                        }));
                        updateRoleInSchema(currentRole.id, { title: val });
                      }}
                      placeholder={currentRole.title}
                      className="w-full rounded-xl bg-[#FAFAFA] border border-black/15 px-3 py-2 font-mono-numbers text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]"
                    />
                  </div>

                  {isCurrentSectionEditing && (
                    <div className="mt-3 pt-3 border-t border-black/8 grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-mono-numbers font-bold uppercase text-neutral-500">
                          Traditional Salary ($/yr)
                        </label>
                        <input
                          type="number"
                          value={effectiveSalary}
                          onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value) || 1);
                            setConfig((prev) => ({
                              ...prev,
                              customSalary: val,
                            }));
                            updateRoleInSchema(currentRole.id, { salary: val });
                          }}
                          className="mt-1 w-full rounded-lg bg-emerald-50/60 border border-emerald-500/40 px-2.5 py-1.5 text-xs font-mono-numbers font-bold text-[#111111]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-numbers font-bold uppercase text-neutral-500">
                          Base Price ($)
                        </label>
                        <input
                          type="number"
                          value={effectiveBasePrice}
                          onChange={(e) => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            setConfig((prev) => ({
                              ...prev,
                              customPrice: val,
                            }));
                            updateRoleInSchema(currentRole.id, { price: val });
                          }}
                          className="mt-1 w-full rounded-lg bg-emerald-50/60 border border-emerald-500/40 px-2.5 py-1.5 text-xs font-mono-numbers font-bold text-emerald-700"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Numbered Specification Summary with Clickable Section Editors */}
                <div className="rounded-2xl bg-white border border-black/10 divide-y divide-black/8">
                  {/* 1. Role */}
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-mono-numbers font-bold text-neutral-500">
                        1. Role
                      </div>
                      <div className="font-mono-numbers text-sm font-bold text-[#111111] mt-0.5">
                        {effectiveRoleTitle} ·{' '}
                        {config.employeeName.trim() || currentRole.defaultName}
                      </div>
                      <div className="text-xs font-mono-numbers text-emerald-700 font-semibold mt-0.5">
                        Salary: ${effectiveSalary.toLocaleString()}/yr · Base
                        Price: ${effectiveBasePrice.toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(0, true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-xs font-mono-numbers font-bold text-[#111111] hover:text-emerald-700 cursor-pointer"
                    >
                      <Pencil className="h-3 w-3 text-emerald-600" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* 2. Use Case */}
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-mono-numbers font-bold text-neutral-500">
                        2. Use Case
                      </div>
                      <div className="text-xs font-mono-numbers font-bold text-[#111111] mt-0.5">
                        {currentUseCase?.title}
                      </div>
                      <div className="text-[11px] font-mono-numbers text-neutral-600 mt-0.5">
                        {currentUseCase?.metricBadge} · Included
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(1, true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-xs font-mono-numbers font-bold text-[#111111] hover:text-emerald-700 cursor-pointer"
                    >
                      <Pencil className="h-3 w-3 text-emerald-600" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* 3. Apps */}
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-mono-numbers font-bold text-neutral-500">
                        3. Apps ({config.enabledPlatforms.length} Connected)
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {config.enabledPlatforms.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAFAFA] border border-black/10 text-[11px] font-mono-numbers font-semibold text-[#111111]"
                          >
                            <PlatformLogo platform={p} size={11} />
                            <span className="capitalize">
                              {p.replace('-', ' ')}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(2, true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-xs font-mono-numbers font-bold text-[#111111] hover:text-emerald-700 cursor-pointer"
                    >
                      <Pencil className="h-3 w-3 text-emerald-600" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* 4. Add Ons */}
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-mono-numbers font-bold text-neutral-500">
                        4. Add Ons ({activeSelectedFeatures.length} of{' '}
                        {availableRoleFeatures.length})
                      </div>
                      {activeSelectedFeatures.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {activeSelectedFeatures.map((feat) => (
                            <li
                              key={feat.id}
                              className="text-xs font-mono-numbers font-bold text-[#111111] flex items-center gap-2"
                            >
                              <span>{feat.title}</span>
                              <span className="text-emerald-700">
                                (+${feat.price.toLocaleString()})
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-xs font-mono-numbers text-neutral-500 mt-0.5">
                          Included base capabilities selected
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(3, true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAFAFA] hover:bg-neutral-100 border border-black/10 text-xs font-mono-numbers font-bold text-[#111111] hover:text-emerald-700 cursor-pointer"
                    >
                      <Pencil className="h-3 w-3 text-emerald-600" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Payment Summary & 90% Savings Ledger */}
                <div className="rounded-2xl bg-white border-2 border-[#111111] p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-numbers font-bold uppercase text-neutral-500">
                      5. PAYMENT SUMMARY
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono-numbers font-bold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>90% Salary Savings</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono-numbers pt-1">
                    <div className="flex items-center justify-between text-neutral-500">
                      <span>Traditional {effectiveRoleTitle} Salary</span>
                      <span className="line-through">
                        ${effectiveSalary.toLocaleString()}/yr
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#111111]">
                      <span>
                        {config.employeeName || currentRole.defaultName} Base
                        Price
                      </span>
                      <span className="font-bold">
                        ${effectiveBasePrice.toLocaleString()}
                      </span>
                    </div>
                    {activeSelectedFeatures.map((feat) => (
                      <div
                        key={feat.id}
                        className="flex items-center justify-between text-neutral-700"
                      >
                        <span>Add-On: {feat.title}</span>
                        <span className="font-bold text-emerald-700">
                          +${feat.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-black/10 flex items-baseline justify-between">
                    <div>
                      <div className="text-xs font-mono-numbers font-bold text-[#111111]">
                        Total Price
                      </div>
                      <div className="text-[11px] font-mono-numbers text-emerald-700 font-semibold">
                        You save ${annualSavingsUsd.toLocaleString()}/yr ({savingsPercentage}%)
                      </div>
                    </div>
                    <div className="text-2xl font-mono-numbers font-bold text-[#111111]">
                      ${animatedPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Live State JSON Preview */}
                <div className="rounded-2xl bg-[#111111] text-white p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono-numbers font-bold text-neutral-400">
                      LIVE CONFIGURATION STATE (JSON)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          configurationJsonPreview
                        );
                        soundFx.playTick();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono-numbers font-bold text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy JSON</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono-numbers text-emerald-400 overflow-x-auto leading-relaxed max-h-44">
                    {configurationJsonPreview}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          FIXED BOTTOM SUMMARY BAR (Price without /mo + Hire Button)
         ==================================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10 px-4 sm:px-8 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Employee Name + Role + Options Count */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={activeEmployeeCutoutSrc}
              alt={config.employeeName || currentRole.defaultName}
              className="h-10 w-10 rounded-xl object-contain object-bottom bg-[#FAFAFA] border border-black/10 shrink-0 hidden sm:block"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono-numbers text-sm sm:text-base font-bold text-[#111111] truncate">
                  {config.employeeName.trim() || currentRole.defaultName}
                </span>
                <span className="hidden md:inline-block text-xs font-mono-numbers font-semibold text-neutral-500">
                  · {effectiveRoleTitle}
                </span>
              </div>
              <div className="text-[11px] font-mono-numbers text-neutral-500 flex items-center gap-2">
                <span>{selectedOptionsCount} options configured</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-bold">
                  Salary: ${effectiveSalary.toLocaleString()}/yr (-{savingsPercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Price (No /mo) + Hire Button */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-mono-numbers font-bold uppercase text-neutral-500">
                Price
              </div>
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-lg sm:text-2xl font-mono-numbers font-bold text-[#111111]">
                  ${animatedPrice.toLocaleString()}
                </span>
                <span className="text-xs font-mono-numbers text-neutral-400 line-through hidden sm:inline">
                  ${effectiveSalary.toLocaleString()}/yr
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFx.playHireChime();
                onDeployEmployee?.(config, totalPrice);
                setIsDeployedModalOpen(true);
              }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-[#111111] hover:bg-emerald-600 text-white text-xs sm:text-sm font-mono-numbers font-bold tracking-tight transition-colors duration-200 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111]"
            >
              Hire
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          HIRE CONFIRMATION MODAL
         ==================================================================== */}
      {isDeployedModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hired-modal-title"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl border border-black/10 max-w-md w-full p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center font-mono-numbers">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4">
              <Check className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-mono-numbers font-bold uppercase text-emerald-700">
              SOFTWARE EMPLOYEE HIRED
            </span>
            <h3
              id="hired-modal-title"
              className="mt-1 font-mono-numbers text-xl sm:text-2xl font-bold text-[#111111]"
            >
              {config.employeeName.trim() || currentRole.defaultName} is ready
            </h3>
            <p className="mt-2 text-xs font-mono-numbers text-neutral-600 leading-relaxed">
              Configured as your{' '}
              <strong className="font-bold text-[#111111]">
                {effectiveRoleTitle}
              </strong>{' '}
              ({currentUseCase?.title || 'Software Employee'}) for{' '}
              <strong className="font-bold text-emerald-700">
                ${totalPrice.toLocaleString()}
              </strong>{' '}
              (saving ${annualSavingsUsd.toLocaleString()}/yr vs. a $
              {effectiveSalary.toLocaleString()}/yr traditional salary).
            </p>

            <div className="mt-5 w-full flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeployedModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-black/15 text-xs font-mono-numbers font-bold text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeployedModalOpen(false);
                  onBackToLineup();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-emerald-600 text-white text-xs font-mono-numbers font-bold transition-colors cursor-pointer"
              >
                Return to Lineup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
