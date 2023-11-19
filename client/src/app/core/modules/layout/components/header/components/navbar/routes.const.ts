import { AppRoute } from './routes.model';

export const APP_ROUTES: AppRoute[] = [
  // entertainment
  { type: 'single', path: '/asian-poker', label: 'asian-poker *' },
  { type: 'single', path: '/casino', label: 'casino #' },
  { type: 'single', path: '/cbbg', label: 'cbbg #' },
  { type: 'single', path: '/paintchat', label: 'paintchat *' },
  { type: 'single', path: '/playlists', label: 'playlists #' },
  { type: 'single', path: '/streaming-studio', label: 'streaming-studio #' },
  // management
  { type: 'single', path: '/ago', label: 'Ago', desc: 'Ago - your memory axis (fill, entwine, ponder) ' },
  {
    type: 'multi',
    path: '/finances',
    label: 'Finances',
    uiOpen: false,
    subPaths: [
      {
        type: 'multi-sub',
        path: '/interpersonal-debts',
        label: 'Friendly Debts',
        desc: 'Debts between me & friends',
      },
      {
        type: 'multi-sub',
        path: '/responsibilites',
        label: 'Recurring payments',
        desc: 'Recurring responsibilites (rent, loan payments, subscriptions)',
      },
      {
        type: 'multi-sub',
        path: '/formal-liabilities',
        label: 'Real liabilities',
        desc: 'Real financial liabilities (active loans, taxes, invoices)',
      },
    ],
  },
  {
    type: 'multi',
    path: '/personals',
    label: 'Personals',
    uiOpen: false,
    subPaths: [
      {
        type: 'multi-sub',
        path: '/notes',
        label: 'Notes',
        desc: 'Simple Notes - lists, plans, ideas, things to buy/do',
      },
    ],
  },
  {
    type: 'multi',
    path: '/socialities',
    label: 'Socialities',
    uiOpen: false,
    subPaths: [
      { type: 'multi-sub', path: '/bdays-calendar', label: 'Birthdays' },
      { type: 'multi-sub', path: '/events-calendar', label: 'Other Events' },
      {
        type: 'multi-sub',
        path: '/zones',
        label: 'Zones',
        desc: 'Photo Zones (for files and memories) - you created or joined',
      },
    ],
  },
  // misc
  {
    type: 'single',
    path: '/decision-tree',
    label: 'Decision tree',
    desc: 'Create a decision tree - a form, a poll, an instruction *',
  },
  { type: 'single', path: '/weather-archive', label: 'Weather archive', desc: 'Weather Archive (only past!) *' },
];
