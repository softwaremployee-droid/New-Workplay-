import { PlatformType } from '../components/PlatformLogo';

export interface WorkflowStep {
  stepNumber: string;
  platform: PlatformType;
  actionTitle: string;
  description: string;
  metricBadge: string;
}

export interface EmploymentHistoryEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
}

export interface EmployeeWorkflowData {
  id: string;
  name: string;
  role: string;
  tagline: string;
  traditionalSalary: number;
  softwareEmployeeSalary: number;
  savingsPercent: number;
  aboutMe: string;
  skillsParagraph1: string;
  skillsParagraph2: string;
  employmentHistory: EmploymentHistoryEntry[];
  education: EducationEntry[];
  languages: string[];
  workflowSteps: WorkflowStep[];
  outcomes: string[];
}

export const EMPLOYEE_WORKFLOWS: EmployeeWorkflowData[] = [
  {
    id: 'employee-1-onboarding',
    name: 'Steve Peters',
    role: 'Onboarding Manager',
    tagline: 'Turns signed deals into fully provisioned client workspaces in 90 seconds.',
    traditionalSalary: 90000,
    softwareEmployeeSalary: 9000,
    savingsPercent: 90,
    aboutMe:
      'I replace the $90,000/yr human glue between your intake forms, CRM, and team chat. The moment a client submits Typeform, I enrich their HubSpot deal record, spin up a dedicated Slack channel with the right stakeholders, and log live onboarding milestones into Google Sheets.',
    skillsParagraph1:
      'Specializes in zero-touch client provisioning across Typeform, HubSpot, Slack, and Google Sheets. Eliminates manual copy-pasting, missing kickoff assets, and delayed stakeholder handoffs across up to 500 concurrent onboarding pipelines.',
    skillsParagraph2:
      'Proactively monitors SLA milestones 24/7/365, sending automated nudges when client questionnaires stall and keeping executive delivery trackers 100% accurate in real time.',
    employmentHistory: [
      {
        role: 'Autonomous Onboarding Manager',
        company: 'WorkPlay Enterprise Cloud',
        period: '2023 — Present',
        location: 'Typeform · HubSpot · Slack · Google Sheets',
        bullets: [
          'Provisioned 4,200+ enterprise client workspaces in under 90 seconds from contract signature to live Slack channel.',
          'Eliminated $81,000/yr in traditional onboarding payroll while expanding concurrent client onboarding capacity by 14×.',
          'Reduced average client time-to-value from 21 days to 4 hours with automated Typeform-to-HubSpot validation.',
        ],
      },
      {
        role: 'Client Implementation Architect',
        company: 'ScaleOps B2B Systems',
        period: '2020 — 2023',
        location: 'HubSpot · Google Sheets · Slack',
        bullets: [
          'Built real-time Google Sheets SLA ledgers synced to HubSpot lifecycle stages with 99.8% data accuracy.',
          'Automated multi-stakeholder Slack channel provisioning and kickoff briefing packets for high-ticket accounts.',
        ],
      },
    ],
    education: [
      {
        degree: 'Certified Enterprise Workflow & CRM Provisioning Architecture',
        institution: 'WorkPlay Autonomous Systems Institute',
        period: '2023',
      },
      {
        degree: 'B.S. in Operations Research & Information Systems',
        institution: 'Carnegie Mellon University',
        period: '2016 — 2020',
      },
    ],
    languages: ['Typeform Webhooks', 'HubSpot API', 'Slack Block Kit', 'Google Sheets Apps Script'],
    workflowSteps: [
      {
        stepNumber: '01',
        platform: 'typeform',
        actionTitle: 'Typeform Intake Capture',
        description:
          'Parses incoming client onboarding submissions, validates required brand assets, and structures account metadata automatically.',
        metricBadge: 'Instant Parse',
      },
      {
        stepNumber: '02',
        platform: 'hubspot',
        actionTitle: 'HubSpot Deal Room Sync',
        description:
          'Updates deal stage to Onboarding Active, attaches intake payloads, and assigns account ownership with zero manual entry.',
        metricBadge: '100% CRM Sync',
      },
      {
        stepNumber: '03',
        platform: 'slack',
        actionTitle: 'Slack Channel Provisioning',
        description:
          'Creates a dedicated #client-partner channel, invites assigned specialists, and pins the formatted kickoff brief.',
        metricBadge: '< 15s Setup',
      },
      {
        stepNumber: '04',
        platform: 'google-sheets',
        actionTitle: 'Google Sheets Milestone Ledger',
        description:
          'Appends a live row to the master onboarding tracker and calculates real-time SLA health across all active accounts.',
        metricBadge: '14× Capacity',
      },
    ],
    outcomes: [
      'Saves $81,000/yr vs. traditional human Onboarding Manager ($9,000 vs $90,000/yr)',
      'Compresses client kickoff from 14 days to 90 seconds',
      'Zero dropped handoffs between sales and delivery teams',
    ],
  },
  {
    id: 'employee-2-sales',
    name: 'Richard Green',
    role: 'Sales Manager',
    tagline: 'Qualifies, dials, updates pipeline, and closes Stripe checkout links 24/7.',
    traditionalSalary: 100000,
    softwareEmployeeSalary: 10000,
    savingsPercent: 90,
    aboutMe:
      'Instead of paying a $100,000/yr sales manager to ask reps if they updated the CRM, I execute the entire pipeline directly. I dial high-intent leads on AirCall within 8 seconds, trigger behavior-driven HubSpot sequences, sync every call outcome to Salesforce, and generate Stripe payment links on the spot.',
    skillsParagraph1:
      'Operates natively across AirCall, HubSpot, Salesforce, and Stripe to turn inbound intent into closed-won revenue. Eliminates lead decay by engaging prospects in under 10 seconds at any hour.',
    skillsParagraph2:
      'Maintains 100% pipeline hygiene in Salesforce and HubSpot while automating contract-to-cash collection via instant Stripe payment links.',
    employmentHistory: [
      {
        role: 'Autonomous Enterprise Sales Manager',
        company: 'WorkPlay Revenue Engine',
        period: '2022 — Present',
        location: 'AirCall · HubSpot · Salesforce · Stripe',
        bullets: [
          'Drove 41% higher inbound-to-close conversion by dialing and qualifying leads in AirCall within 8 seconds of form submission.',
          'Saved $90,000/yr in base sales management payroll while operating at 18× human outbound and follow-up capacity.',
          'Automated $14.8M in direct Stripe checkout link collections synced bi-directionally with Salesforce opportunities.',
        ],
      },
      {
        role: 'Pipeline & Revenue Operations Lead',
        company: 'Apex Cloud Velocity',
        period: '2019 — 2022',
        location: 'Salesforce · HubSpot · Stripe',
        bullets: [
          'Architected multi-touch HubSpot follow-up sequences triggered by live AirCall call dispositions and transcript sentiment.',
          'Eliminated 100% of manual CRM data entry across 12,000+ annual enterprise opportunities in Salesforce.',
        ],
      },
    ],
    education: [
      {
        degree: 'Autonomous Revenue & High-Velocity Pipeline Certification',
        institution: 'WorkPlay Autonomous Systems Institute',
        period: '2022',
      },
      {
        degree: 'B.B.A. in Strategic Enterprise Sales & Finance',
        institution: 'University of Pennsylvania (Wharton)',
        period: '2015 — 2019',
      },
    ],
    languages: ['AirCall Voice API', 'Salesforce SOQL', 'HubSpot Workflows', 'Stripe Billing Webhooks'],
    workflowSteps: [
      {
        stepNumber: '01',
        platform: 'aircall',
        actionTitle: 'AirCall Speed-to-Lead Dialer',
        description:
          'Initiates outbound voice qualification within 8 seconds of lead capture and logs full call transcripts and disposition tags.',
        metricBadge: '8s Response',
      },
      {
        stepNumber: '02',
        platform: 'hubspot',
        actionTitle: 'HubSpot Sequence Enrollment',
        description:
          'Scores prospect intent from call outcomes and triggers personalized multi-touch follow-up sequences automatically.',
        metricBadge: '+41% Win Rate',
      },
      {
        stepNumber: '03',
        platform: 'salesforce',
        actionTitle: 'Salesforce Opportunity Sync',
        description:
          'Updates enterprise opportunity stages, forecast categories, and next-step dates with zero rep nagging.',
        metricBadge: 'Zero Admin Lag',
      },
      {
        stepNumber: '04',
        platform: 'stripe',
        actionTitle: 'Stripe Instant Checkout Close',
        description:
          'Generates tailored Stripe payment and subscription links during the call so prospects close on the spot.',
        metricBadge: '18× Capacity',
      },
    ],
    outcomes: [
      'Saves $90,000/yr vs. traditional human Sales Manager ($10,000 vs $100,000/yr)',
      '100% of inbound leads contacted in under 10 seconds',
      'Real-time Salesforce & Stripe revenue reconciliation',
    ],
  },
  {
    id: 'employee-6-support',
    name: 'Cindy James',
    role: 'Support Manager',
    tagline: 'Resolves Intercom tickets, AirCall voice queues, and Stripe billing in 12 seconds.',
    traditionalSalary: 76000,
    softwareEmployeeSalary: 7600,
    savingsPercent: 90,
    aboutMe:
      'Customers hate waiting 6 hours for a human to reply "we are looking into it." I live natively inside Intercom, AirCall, Stripe, and Slack—answering product questions, processing prorated billing adjustments, and routing reproducible bug logs to engineering in 12 seconds flat.',
    skillsParagraph1:
      'Delivers 24/7 omnichannel resolution across Intercom live chat and AirCall voice queues with direct execution access to Stripe billing and Slack incident channels.',
    skillsParagraph2:
      'Maintains a 99.6% CSAT score across 25× traditional support ticket volume while turning refund requests into proactive retention saves.',
    employmentHistory: [
      {
        role: 'Autonomous Customer Support Manager',
        company: 'WorkPlay CX Cloud',
        period: '2023 — Present',
        location: 'Intercom · AirCall · Stripe · Slack',
        bullets: [
          'Resolved 89% of incoming Intercom and AirCall tickets on first contact with a 12-second median response time.',
          'Saved $68,400/yr in support management payroll while maintaining 99.6% customer satisfaction across 24/7 coverage.',
          'Automated prorated Stripe plan upgrades, invoice lookups, and instant Slack engineering bug escalations.',
        ],
      },
      {
        role: 'Senior Support Triage Specialist',
        company: 'CloudPulse SaaS',
        period: '2020 — 2023',
        location: 'Intercom · Stripe · Slack',
        bullets: [
          'Unified Intercom conversation histories with live Stripe subscription status to eliminate back-and-forth billing tickets.',
          'Reduced Tier-2 engineering interruptions by 64% through structured Slack incident threads.',
        ],
      },
    ],
    education: [
      {
        degree: 'Omnichannel CX & Instant Billing Resolution Certification',
        institution: 'WorkPlay Autonomous Systems Institute',
        period: '2023',
      },
      {
        degree: 'B.A. in Communications & Human-Computer Interaction',
        institution: 'University of Washington',
        period: '2016 — 2020',
      },
    ],
    languages: ['Intercom Messenger API', 'AirCall Routing', 'Stripe Subscriptions API', 'Slack Incident Triage'],
    workflowSteps: [
      {
        stepNumber: '01',
        platform: 'intercom',
        actionTitle: 'Intercom Instant Ticket Triage',
        description:
          'Reads incoming Intercom conversations, retrieves account history, and resolves 89% of Tier-1 & Tier-2 issues on first contact.',
        metricBadge: '12s Reply',
      },
      {
        stepNumber: '02',
        platform: 'aircall',
        actionTitle: 'AirCall Voice Support Queue',
        description:
          'Answers VIP support calls on AirCall with zero hold music, transcribing diagnostics and verifying caller identity.',
        metricBadge: 'Zero Hold Time',
      },
      {
        stepNumber: '03',
        platform: 'stripe',
        actionTitle: 'Stripe Billing & Refund Action',
        description:
          'Executes prorated upgrades, invoice resends, and policy-compliant credits directly inside Stripe during the chat.',
        metricBadge: 'Instant Action',
      },
      {
        stepNumber: '04',
        platform: 'slack',
        actionTitle: 'Slack Engineering Escalation',
        description:
          'Packages reproducible bug logs and customer context into #support-escalations on Slack for rapid engineering fixes.',
        metricBadge: '99.6% CSAT',
      },
    ],
    outcomes: [
      'Saves $68,400/yr vs. traditional human Support Manager ($7,600 vs $76,000/yr)',
      'Drops average ticket resolution from 6 hours to 12 seconds',
      '25× concurrent ticket and voice capacity 24/7/365',
    ],
  },
  {
    id: 'employee-4-operations',
    name: 'Hilary Maximus',
    role: 'Operations Manager',
    tagline: 'Eliminates human middleware across Stripe, Google Sheets, HubSpot, and Salesforce.',
    traditionalSalary: 118000,
    softwareEmployeeSalary: 11800,
    savingsPercent: 90,
    aboutMe:
      'When Stripe, Google Sheets, HubSpot, and Salesforce fall out of sync, companies hire a $118,000/yr operations manager to copy-paste CSVs all week. I eliminate the manual reconciliation tax—auditing every transaction, recovering failed renewals, and keeping your live P&L spotless.',
    skillsParagraph1:
      'Acts as the autonomous financial and operational spine across Stripe, Google Sheets, HubSpot, and Salesforce. Reconciles 50,000+ monthly ledger rows with zero formula errors.',
    skillsParagraph2:
      'Detects failed Stripe renewals in milliseconds, triggers automated dunning workflows in HubSpot, and locks audited ARR figures into Salesforce and executive Google Sheets.',
    employmentHistory: [
      {
        role: 'Autonomous RevOps & Operations Manager',
        company: 'WorkPlay Operations Spine',
        period: '2022 — Present',
        location: 'Stripe · Google Sheets · HubSpot · Salesforce',
        bullets: [
          'Recovered $84,000/yr in involuntatily churned subscriptions via instant Stripe webhook dunning and HubSpot outreach.',
          'Saved $106,200/yr in operations payroll while reclaiming 160+ hours/month of manual spreadsheet reconciliation.',
          'Maintained 99.98% cross-platform data hygiene across 250,000+ HubSpot and Salesforce CRM records.',
        ],
      },
      {
        role: 'Senior Revenue Operations Analyst',
        company: 'LedgerScale FinTech',
        period: '2019 — 2022',
        location: 'Stripe · Google Sheets · Salesforce',
        bullets: [
          'Automated rolling 24-month ARR, net dollar retention, and burn models in Google Sheets directly from Stripe events.',
          'Eliminated duplicate account hierarchies and mismatched renewal dates across Salesforce and HubSpot.',
        ],
      },
    ],
    education: [
      {
        degree: 'Autonomous RevOps & Financial Ledger Reconciliation',
        institution: 'WorkPlay Autonomous Systems Institute',
        period: '2022',
      },
      {
        degree: 'B.S. in Computational Finance & Accounting',
        institution: 'New York University (Stern)',
        period: '2015 — 2019',
      },
    ],
    languages: ['Stripe Events API', 'Google Sheets Financial Modeling', 'Salesforce RevOps', 'HubSpot Data Hygiene'],
    workflowSteps: [
      {
        stepNumber: '01',
        platform: 'stripe',
        actionTitle: 'Stripe Webhook Reconciliation',
        description:
          'Listens to every invoice, subscription renewal, and failed charge in Stripe—triggering automated dunning recovery.',
        metricBadge: '$84k Recovered',
      },
      {
        stepNumber: '02',
        platform: 'google-sheets',
        actionTitle: 'Google Sheets Live P&L Model',
        description:
          'Writes reconciled transaction rows into rolling ARR, burn, and commission sheets with zero manual formula errors.',
        metricBadge: 'Zero CSV Exports',
      },
      {
        stepNumber: '03',
        platform: 'hubspot',
        actionTitle: 'HubSpot Lifecycle Hygiene',
        description:
          'Deduplicates contacts, normalizes company domains, and updates customer health scores from billing activity.',
        metricBadge: '99.9% Clean CRM',
      },
      {
        stepNumber: '04',
        platform: 'salesforce',
        actionTitle: 'Salesforce Contract Ledger',
        description:
          'Aligns multi-year enterprise contract terms and renewal dates in Salesforce with actual Stripe billing schedules.',
        metricBadge: '20× Capacity',
      },
    ],
    outcomes: [
      'Saves $106,200/yr vs. traditional human Operations Manager ($11,800 vs $118,000/yr)',
      'Reclaims 160+ hours/month of manual spreadsheet labor',
      'Instant anomaly detection across billing and CRM records',
    ],
  },
  {
    id: 'employee-3-funnel',
    name: 'Jamie Dawn',
    role: 'Data Manager',
    tagline: 'Unifies Typeform, Mailchimp, HubSpot, and Google Sheets into a live data & attribution engine.',
    traditionalSalary: 85000,
    softwareEmployeeSalary: 8500,
    savingsPercent: 90,
    aboutMe:
      'Instead of paying an $85,000/yr data manager to wrangle messy CSV exports every Monday, I unify your data pipeline continuously. I capture zero-party Typeform data, score multi-touch attribution in HubSpot, sync predictive segments to Mailchimp, and maintain live cohort LTV models in Google Sheets.',
    skillsParagraph1:
      'Specializes in real-time behavioral telemetry, schema deduplication, and multi-touch revenue attribution across Typeform, Mailchimp, HubSpot, and Google Sheets.',
    skillsParagraph2:
      'Continuously audits conversion cohorts and LTV:CAC ratios in Google Sheets, feeding high-intent segments back into HubSpot and Mailchimp with zero manual SQL or spreadsheet wrangling.',
    employmentHistory: [
      {
        role: 'Autonomous Data & Attribution Manager',
        company: 'WorkPlay Data Intelligence',
        period: '2022 — Present',
        location: 'Typeform · Mailchimp · HubSpot · Google Sheets',
        bullets: [
          'Unified 180,000+ Typeform respondent profiles with HubSpot CRM attribution and live Google Sheets cohort matrices.',
          'Saved $76,500/yr vs. a traditional data manager ($8,500 vs $85,000/yr) while running 14× more cohort analyses.',
          'Lifted lifecycle ROAS by 46% by syncing clean behavioral segments between HubSpot and Mailchimp in real time.',
        ],
      },
      {
        role: 'Marketing Data & BI Architect',
        company: 'MetricPulse Analytics',
        period: '2019 — 2022',
        location: 'Google Sheets · HubSpot · Typeform',
        bullets: [
          'Built automated Google Sheets attribution scorecards tracking channel CAC, payback period, and 12-month cohort retention.',
          'Eliminated 100% of duplicate schema fields across Typeform webhooks and HubSpot contact properties.',
        ],
      },
    ],
    education: [
      {
        degree: 'Autonomous Data Pipeline & Multi-Touch Attribution Architecture',
        institution: 'WorkPlay Autonomous Systems Institute',
        period: '2022',
      },
      {
        degree: 'B.S. in Data Science & Applied Statistics',
        institution: 'University of California, Berkeley',
        period: '2015 — 2019',
      },
    ],
    languages: ['Typeform Data Webhooks', 'Google Sheets Query/Array Formulas', 'HubSpot Attribution API', 'Mailchimp Audience Sync'],
    workflowSteps: [
      {
        stepNumber: '01',
        platform: 'typeform',
        actionTitle: 'Typeform Behavioral Data Capture',
        description:
          'Scores zero-party quiz and survey responses in real time to classify company size, budget tier, and buying intent.',
        metricBadge: 'Zero-Party Data',
      },
      {
        stepNumber: '02',
        platform: 'mailchimp',
        actionTitle: 'Mailchimp Predictive Segment Sync',
        description:
          'Pushes clean, enriched audience segments into Mailchimp with dynamic merge tags and predicted LTV tiers.',
        metricBadge: '+46% Conversion',
      },
      {
        stepNumber: '03',
        platform: 'hubspot',
        actionTitle: 'HubSpot Attribution Scoring',
        description:
          'Syncs multi-touch campaign engagement back to HubSpot contact properties and triggers sales-ready alerts.',
        metricBadge: 'Live Lead Score',
      },
      {
        stepNumber: '04',
        platform: 'google-sheets',
        actionTitle: 'Google Sheets Cohort & LTV Matrix',
        description:
          'Maintains a live, self-updating cohort retention, ROAS, and LTV:CAC model in Google Sheets for leadership review.',
        metricBadge: '14× Capacity',
      },
    ],
    outcomes: [
      'Saves $76,500/yr vs. traditional human Data Manager ($8,500 vs $85,000/yr)',
      '100% automated schema hygiene and cohort reporting',
      'Real-time attribution across Typeform, HubSpot, Mailchimp & Google Sheets',
    ],
  },
  {
    id: 'employee-5-team',
    name: 'Mike Woods',
    role: 'Email Manager',
    tagline: 'Orchestrates high-converting Mailchimp & HubSpot lifecycle sequences with Slack & Google Sheets sync.',
    traditionalSalary: 90000,
    softwareEmployeeSalary: 9000,
    savingsPercent: 90,
    aboutMe:
      'Why pay $90,000/yr for an email manager to manually schedule weekly blasts? I operate 24/7 inside Mailchimp, HubSpot, Slack, and Google Sheets—triggering behavior-based lifecycle flows, A/B testing subject lines automatically, routing VIP replies to Slack, and logging per-send revenue in Google Sheets.',
    skillsParagraph1:
      'Manages end-to-end lifecycle email architecture across Mailchimp and HubSpot while keeping sales and leadership aligned via real-time Slack alerts and Google Sheets revenue ledgers.',
    skillsParagraph2:
      'Continuously optimizes send-time personalization, domain warm-up, and A/B test variants to maintain 99.4% inbox placement and 15× human campaign throughput.',
    employmentHistory: [
      {
        role: 'Autonomous Lifecycle Email Manager',
        company: 'WorkPlay Lifecycle Studio',
        period: '2022 — Present',
        location: 'Mailchimp · HubSpot · Slack · Google Sheets',
        bullets: [
          'Generated 48% higher lifecycle email revenue across Mailchimp and HubSpot through automated behavioral branching.',
          'Saved $81,000/yr vs. a traditional email manager ($9,000 vs $90,000/yr) while launching 15× more A/B tests per week.',
          'Routed 100% of high-intent prospect replies into Slack within 5 seconds and logged campaign ROI in Google Sheets.',
        ],
      },
      {
        role: 'Lifecycle & Deliverability Strategist',
        company: 'InboxScale Growth',
        period: '2018 — 2022',
        location: 'Mailchimp · HubSpot · Google Sheets',
        bullets: [
          'Maintained 99.4% primary inbox deliverability across 2.4M monthly lifecycle sends in Mailchimp and HubSpot.',
          'Built automated Google Sheets revenue attribution trackers tied to every drip sequence and newsletter cohort.',
        ],
      },
    ],
    education: [
      {
        degree: 'Autonomous Lifecycle Email & Deliverability Engineering',
        institution: 'WorkPlay Autonomous Systems Institute',
        period: '2022',
      },
      {
        degree: 'B.S. in Digital Marketing & Behavioral Economics',
        institution: 'Northwestern University',
        period: '2014 — 2018',
      },
    ],
    languages: ['Mailchimp Automation API', 'HubSpot Marketing Hub', 'Slack Reply Routing', 'Google Sheets Attribution'],
    workflowSteps: [
      {
        stepNumber: '01',
        platform: 'mailchimp',
        actionTitle: 'Mailchimp Lifecycle Drip Flows',
        description:
          'Deploys hyper-personalized onboarding, win-back, and expansion sequences in Mailchimp with automatic A/B subject testing.',
        metricBadge: '+48% Email Rev',
      },
      {
        stepNumber: '02',
        platform: 'hubspot',
        actionTitle: 'HubSpot Behavioral Triggers',
        description:
          'Listens to live HubSpot deal stage changes and page views to enroll prospects into tailored nurture tracks.',
        metricBadge: '99.4% Deliverability',
      },
      {
        stepNumber: '03',
        platform: 'slack',
        actionTitle: 'Slack Campaign & VIP Reply Alerts',
        description:
          'Routes warm prospect replies and daily campaign performance digests directly into Slack for instant team visibility.',
        metricBadge: '< 5s Reply Alert',
      },
      {
        stepNumber: '04',
        platform: 'google-sheets',
        actionTitle: 'Google Sheets Revenue Attribution',
        description:
          'Logs open rates, click-to-close conversion, and attributed revenue per sequence into a live Google Sheets ledger.',
        metricBadge: '15× Capacity',
      },
    ],
    outcomes: [
      'Saves $81,000/yr vs. traditional human Email Manager ($9,000 vs $90,000/yr)',
      '99.4% inbox placement with continuous A/B testing',
      'Instant Slack alerts on VIP replies and live Google Sheets ROI tracking',
    ],
  },
];
