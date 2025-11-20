# Integration Portal + Agent Router Playground

A small Next.js (App Router) + Tailwind app that lets you configure category-to-app mappings and try a mock routing agent.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How it works
- **Config layer:** pick an active app per category, toggle connection status, and reset to defaults. Config is stored in `localStorage` so it sticks between reloads.
- **Agent playground:** send a sample message, optionally force a category, and see which category/app is selected. A mock API route (`app/api/agent/route.ts`) echoes the routing choice.

## Project structure
- `config/`: static category and integration definitions.
- `app/hooks/`: client-side hooks for persisting and mutating user config.
- `app/components/`: UI components for the config cards and routing playground.
- `app/api/`: route handlers for the mock agent.
