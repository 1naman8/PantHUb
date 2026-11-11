# PantHub — GBPIET Resource Commons

PantHub is a responsive academic resource and student community platform for GBPIET.

## Current milestone: Project foundation + design system

This first milestone includes:
- React + Vite application foundation
- Brutalist / experimental visual identity
- Notion-inspired navigation
- Light and dark themes
- Responsive desktop, tablet and mobile layouts
- Homepage structure
- Sample resource cards
- Instant client-side search and department/resource-type filters
- Grid and list resource views
- Sample announcements and community panel

**Important:** This is the frontend foundation. Sample resources and buttons are placeholders. Supabase authentication, database, private PDF delivery, admin uploads, community persistence and other backend functionality will be implemented in later milestones.

## Requirements

- Node.js 22 or newer
- npm
- Git (optional)
- VS Code (recommended)

## Run on Ubuntu or Windows

Open a terminal in this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project structure

```text
PantHub/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx
    └── styles.css
```

## Design tokens

The CSS variables in `src/styles.css` define the visual system:
- Paper: `#F1EEE6`
- Surface: `#FAF8F2`
- Ink: `#171714`
- Terracotta: `#E45132`
- Muted: `#77746C`
- Border: `#D8D3C8`
- Green: `#426B55`

Dark theme values are defined under `.app-shell[data-theme="dark"]`.

## Next milestone

Connect Supabase, create the schema and RLS policies, configure secure admin operations, and replace sample data with real resources.
