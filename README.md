# Software Employees

Minimal and interactive platform to hire pre-vetted Software Employees and managers across onboarding, sales, support, operations, data, and email workflows.

## Featured Software Employees

| Role | Name | Traditional Salary | Direct Hire Price |
| :--- | :--- | :--- | :--- |
| **Onboarding Manager** | Steve Peters | $90,000/yr | $9,000 |
| **Sales Manager** | Richard Green | $100,000/yr | $10,000 |
| **Support Manager** | Cindy James | $76,000/yr | $7,600 |
| **Operations Manager** | Hilary Maximus | $118,000/yr | $11,800 |
| **Data Manager** | Jamie Dawn | $85,000/yr | $8,500 |
| **Email Manager** | Mike Woods | $90,000/yr | $9,000 |

## Studio Builder & Configurator

The Studio Builder lets you configure and customize each Software Employee across five structured sections:

1. **01. Role** — Select from the 6 pre-vetted Software Employees on the home page lineup.
2. **02. Use Case** — Choose between **Software Employee**, **Employee Infrastructure**, and **Role intelligence**.
3. **03. Apps** — Configure core resume applications and workflow steps for each employee.
4. **04. Add Ons** — Add optional capabilities, guardrails, and capacity upgrades.
5. **05. Payment** — Review transparent pricing, ROI comparison, and complete direct hire deployment.

## Persistent Storage

Employee cutouts, custom photos, resumes, and Studio Builder configurations are automatically persisted locally via IndexedDB (`workplay_permanent_vault_v1`) and synchronized with `localStorage` so your state remains intact across page refreshes.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)

### Installation & Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs on port `3000`):
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
