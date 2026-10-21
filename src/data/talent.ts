export interface Candidate {
  id: string;
  code: string;
  name: string;
  role: string;
  specialization:
    | 'Client Onboarding'
    | 'Enterprise Sales'
    | 'Customer Support'
    | 'Operations & RevOps'
    | 'Data & Analytics'
    | 'Lifecycle Email';
  level: 'Senior' | 'Staff' | 'Lead' | 'Manager';
  experienceYears: number;
  imageSrc: string;
  fullBodyFrontSrc: string;
  fullBodyBackSrc: string;
  location: string;
  timezone: string;
  availability: 'Immediate' | '2 Weeks Notice';
  contractType: 'Full-Time Direct' | 'Dedicated Contract';
  annualSalaryUsd: number; // Price (e.g. $9,000)
  traditionalSalaryUsd: number; // Salary (e.g. $90,000/yr)
  capacityMultiplier: string;
  dayRateUsd: number;
  skills: string[];
  bio: string;
  superpower: string;
  architectureCaseStudy: {
    title: string;
    description: string;
    impact: string;
  };
  auditScores: {
    systemDesign: number;
    codeMaintainability: number;
    concurrencyAndScale: number;
    communication: number;
  };
  resumeUrl?: string;
  resumeFileName?: string;
  resumeMimeType?: string;
}

export const CANDIDATES: Candidate[] = [
  {
    id: 'employee-1-onboarding',
    code: 'EMP-01',
    name: 'Steve Peters',
    role: 'Onboarding Manager',
    specialization: 'Client Onboarding',
    level: 'Manager',
    experienceYears: 7,
    imageSrc: '/src/assets/images/candidate_marcus_cutout.png',
    fullBodyFrontSrc: '/src/assets/images/candidate_marcus_cutout.png',
    fullBodyBackSrc: '/src/assets/images/candidate_marcus_cutout.png',
    location: 'Lives in Typeform, HubSpot, Slack & Google Sheets',
    timezone: '24/7/365 · Zero PTO',
    availability: 'Immediate',
    contractType: 'Full-Time Direct',
    annualSalaryUsd: 9000,
    traditionalSalaryUsd: 90000,
    capacityMultiplier: '14× Capacity',
    dayRateUsd: 35,
    skills: [
      'Typeform Intake Capture',
      'HubSpot Deal Room Sync',
      'Slack Channel Provisioning',
      'Google Sheets Milestone Ledger',
      'Zero-Churn Handoffs',
    ],
    superpower:
      'Turns signed contracts into fully provisioned client workspaces in 90 seconds flat across Typeform, HubSpot, Slack, and Google Sheets.',
    bio: 'I replace the $90,000/yr human glue between your intake forms, CRM, and team chat. The moment a client submits Typeform, I enrich their HubSpot deal record, spin up a dedicated Slack channel with the right stakeholders, and log live onboarding milestones into Google Sheets.',
    architectureCaseStudy: {
      title: 'Zero-Touch Typeform → HubSpot → Slack → Google Sheets Onboarding Engine',
      description:
        'Parses incoming client onboarding submissions in Typeform, updates HubSpot deal stages, provisions private client Slack channels, and logs live SLA health in Google Sheets.',
      impact:
        'Cut onboarding salary from $90,000/yr to $9,000 (90% savings), expanded concurrent client capacity by 14×, and compressed time-to-kickoff to 90 seconds.',
    },
    auditScores: {
      systemDesign: 98,
      codeMaintainability: 96,
      concurrencyAndScale: 99,
      communication: 99,
    },
  },
  {
    id: 'employee-2-sales',
    code: 'EMP-02',
    name: 'Richard Green',
    role: 'Sales Manager',
    specialization: 'Enterprise Sales',
    level: 'Manager',
    experienceYears: 9,
    imageSrc: '/src/assets/images/candidate_julian_cutout.png',
    fullBodyFrontSrc: '/src/assets/images/candidate_julian_cutout.png',
    fullBodyBackSrc: '/src/assets/images/candidate_julian_cutout.png',
    location: 'Lives in AirCall, HubSpot, Salesforce & Stripe',
    timezone: '24/7/365 · Never Misses Quota',
    availability: 'Immediate',
    contractType: 'Full-Time Direct',
    annualSalaryUsd: 10000,
    traditionalSalaryUsd: 100000,
    capacityMultiplier: '18× Capacity',
    dayRateUsd: 38,
    skills: [
      'AirCall Speed-to-Lead Dialer',
      'HubSpot Sequence Enrollment',
      'Salesforce Opportunity Sync',
      'Stripe Instant Checkout Close',
      'Sub-10s Lead Qualification',
    ],
    superpower:
      'Follows up in 8 seconds inside AirCall, HubSpot, Salesforce, and Stripe—turning inbound intent into collected revenue with zero commission overhead.',
    bio: 'Instead of paying a $100,000/yr sales manager to ask reps if they updated the CRM, I execute the entire pipeline directly. I dial high-intent leads on AirCall within 8 seconds, trigger behavior-driven HubSpot sequences, sync every call outcome to Salesforce, and generate Stripe payment links on the spot.',
    architectureCaseStudy: {
      title: 'Autonomous AirCall + HubSpot + Salesforce + Stripe Revenue Engine',
      description:
        'Initiates outbound AirCall qualification within 8 seconds, enrolls prospects in personalized HubSpot sequences, updates Salesforce pipeline forecasts, and issues Stripe checkout links.',
      impact:
        'Cut sales management salary from $100,000/yr to $10,000 (90% savings) while multiplying pipeline capacity by 18× and lifting win rates by 41%.',
    },
    auditScores: {
      systemDesign: 97,
      codeMaintainability: 98,
      concurrencyAndScale: 99,
      communication: 98,
    },
  },
  {
    id: 'employee-6-support',
    code: 'EMP-03',
    name: 'Cindy James',
    role: 'Support Manager',
    specialization: 'Customer Support',
    level: 'Manager',
    experienceYears: 7,
    imageSrc: '/src/assets/images/candidate_sophie_cutout.png',
    fullBodyFrontSrc: '/src/assets/images/candidate_sophie_cutout.png',
    fullBodyBackSrc: '/src/assets/images/candidate_sophie_cutout.png',
    location: 'Lives in Intercom, AirCall, Stripe & Slack',
    timezone: '24/7/365 · 12-Second Response Time',
    availability: 'Immediate',
    contractType: 'Full-Time Direct',
    annualSalaryUsd: 7600,
    traditionalSalaryUsd: 76000,
    capacityMultiplier: '25× Capacity',
    dayRateUsd: 29,
    skills: [
      'Intercom Instant Ticket Triage',
      'AirCall Voice Support Queue',
      'Stripe Billing & Refund Action',
      'Slack Engineering Escalation',
      '99.6% CSAT Resolution',
    ],
    superpower:
      'Resolves 1,000 Intercom chats and AirCall inquiries simultaneously with a 12-second response time across Stripe and Slack.',
    bio: 'Customers hate waiting 6 hours for a human to reply "we are looking into it." I live natively inside Intercom, AirCall, Stripe, and Slack—answering product questions, processing prorated billing adjustments, and routing reproducible bug logs to engineering in 12 seconds flat.',
    architectureCaseStudy: {
      title: 'Instant Intercom + AirCall + Stripe + Slack Support Resolution Engine',
      description:
        'Connects Intercom live chat and AirCall voice queues directly to Stripe subscription adjustments and Slack engineering incident channels for 89% first-contact resolution.',
      impact:
        'Cut support salary from $76,000/yr to $7,600 (90% savings), dropped response times from 45 minutes to 12 seconds, and achieved 99.6% CSAT.',
    },
    auditScores: {
      systemDesign: 97,
      codeMaintainability: 98,
      concurrencyAndScale: 100,
      communication: 99,
    },
  },
  {
    id: 'employee-4-operations',
    code: 'EMP-04',
    name: 'Hilary Maximus',
    role: 'Operations Manager',
    specialization: 'Operations & RevOps',
    level: 'Lead',
    experienceYears: 8,
    imageSrc: '/src/assets/images/candidate_linnea_cutout.png',
    fullBodyFrontSrc: '/src/assets/images/candidate_linnea_cutout.png',
    fullBodyBackSrc: '/src/assets/images/candidate_linnea_cutout.png',
    location: 'Lives in Stripe, Google Sheets, HubSpot & Salesforce',
    timezone: '24/7/365 · Zero Spreadsheet Errors',
    availability: 'Immediate',
    contractType: 'Full-Time Direct',
    annualSalaryUsd: 11800,
    traditionalSalaryUsd: 118000,
    capacityMultiplier: '20× Capacity',
    dayRateUsd: 45,
    skills: [
      'Stripe Webhook Reconciliation',
      'Google Sheets Live P&L Model',
      'HubSpot Lifecycle Hygiene',
      'Salesforce Contract Ledger',
      'Automated Dunning Recovery',
    ],
    superpower:
      'Reconciles 50,000 Stripe invoices, Google Sheets rows, HubSpot records, and Salesforce contracts before breakfast.',
    bio: 'When Stripe, Google Sheets, HubSpot, and Salesforce fall out of sync, companies hire a $118,000/yr operations manager to copy-paste CSVs all week. I eliminate the manual reconciliation tax—auditing every transaction, recovering failed renewals, and keeping your live P&L spotless.',
    architectureCaseStudy: {
      title: 'Zero-Touch Stripe + Google Sheets + HubSpot + Salesforce RevOps Spine',
      description:
        'Listens to live Stripe payment events, updates rolling 24-month ARR & burn models in Google Sheets, deduplicates HubSpot records, and locks Salesforce renewal terms.',
      impact:
        'Cut operations salary from $118,000/yr to $11,800 (90% savings), recovered $84k/yr in failed Stripe renewals, and maintained 99.98% CRM data hygiene.',
    },
    auditScores: {
      systemDesign: 99,
      codeMaintainability: 99,
      concurrencyAndScale: 99,
      communication: 97,
    },
  },
  {
    id: 'employee-3-funnel',
    code: 'EMP-05',
    name: 'Jamie Dawn',
    role: 'Data Manager',
    specialization: 'Data & Analytics',
    level: 'Lead',
    experienceYears: 8,
    imageSrc: '/src/assets/images/candidate_maya_cutout.png',
    fullBodyFrontSrc: '/src/assets/images/candidate_maya_cutout.png',
    fullBodyBackSrc: '/src/assets/images/candidate_maya_cutout.png',
    location: 'Lives in Typeform, Mailchimp, HubSpot & Google Sheets',
    timezone: '24/7/365 · Always Optimizing',
    availability: 'Immediate',
    contractType: 'Full-Time Direct',
    annualSalaryUsd: 8500,
    traditionalSalaryUsd: 85000,
    capacityMultiplier: '14× Capacity',
    dayRateUsd: 33,
    skills: [
      'Typeform Behavioral Data Capture',
      'Google Sheets Cohort & LTV Matrix',
      'HubSpot Attribution Scoring',
      'Mailchimp Segment Sync',
      'Automated Schema Hygiene',
    ],
    superpower:
      'Transforms raw Typeform, HubSpot, and Mailchimp signals into live Google Sheets cohort attribution models around the clock.',
    bio: 'Instead of paying an $85,000/yr data manager to wrangle messy CSV exports every Monday, I unify your data pipeline continuously. I capture zero-party Typeform data, score multi-touch attribution in HubSpot, sync predictive segments to Mailchimp, and maintain live cohort LTV models in Google Sheets.',
    architectureCaseStudy: {
      title: 'Real-Time Typeform → HubSpot → Mailchimp → Google Sheets Data Pipeline',
      description:
        'Captures structured respondent telemetry in Typeform, computes weighted attribution scores in HubSpot, segments audiences in Mailchimp, and updates live cohort LTV tables in Google Sheets.',
      impact:
        'Cut data management salary from $85,000/yr to $8,500 (90% savings), eliminated 100% of manual spreadsheet wrangling, and boosted campaign ROAS by 46%.',
    },
    auditScores: {
      systemDesign: 98,
      codeMaintainability: 98,
      concurrencyAndScale: 99,
      communication: 97,
    },
  },
  {
    id: 'employee-5-team',
    code: 'EMP-06',
    name: 'Mike Woods',
    role: 'Email Manager',
    specialization: 'Lifecycle Email',
    level: 'Manager',
    experienceYears: 10,
    imageSrc: '/src/assets/images/candidate_david_cutout.png',
    fullBodyFrontSrc: '/src/assets/images/candidate_david_cutout.png',
    fullBodyBackSrc: '/src/assets/images/candidate_david_cutout.png',
    location: 'Lives in Mailchimp, HubSpot, Slack & Google Sheets',
    timezone: '24/7/365 · 99.4% Deliverability',
    availability: 'Immediate',
    contractType: 'Full-Time Direct',
    annualSalaryUsd: 9000,
    traditionalSalaryUsd: 90000,
    capacityMultiplier: '15× Capacity',
    dayRateUsd: 35,
    skills: [
      'Mailchimp Lifecycle Drip Flows',
      'HubSpot Behavioral Triggers',
      'Slack Campaign & Reply Alerts',
      'Google Sheets Revenue Attribution',
      '99.4% Inbox Deliverability',
    ],
    superpower:
      'Orchestrates hyper-personalized Mailchimp and HubSpot lifecycle sequences while syncing live reply alerts to Slack and revenue attribution to Google Sheets.',
    bio: 'Why pay $90,000/yr for an email manager to manually schedule weekly blasts? I operate 24/7 inside Mailchimp, HubSpot, Slack, and Google Sheets—triggering behavior-based lifecycle flows, A/B testing subject lines automatically, routing VIP replies to Slack, and logging per-send revenue in Google Sheets.',
    architectureCaseStudy: {
      title: 'Autonomous Mailchimp + HubSpot + Slack + Google Sheets Lifecycle Engine',
      description:
        'Triggers personalized Mailchimp drip sequences from HubSpot CRM events, routes high-intent replies directly to Slack, and logs open/click/revenue attribution in Google Sheets.',
      impact:
        'Cut email management salary from $90,000/yr to $9,000 (90% savings), lifted lifecycle email revenue by 48%, and maintained 99.4% inbox placement.',
    },
    auditScores: {
      systemDesign: 99,
      codeMaintainability: 98,
      concurrencyAndScale: 98,
      communication: 100,
    },
  },
];
