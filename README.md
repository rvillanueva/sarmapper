# Search and Rescue Mapper

A mapping tool for search and rescue operations, built with statistical behavior profiles and interactive Mapbox-powered maps.

## Tech Stack

- **Framework** -- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing)
- **Build** -- [Vite 7](https://vite.dev/) with [Nitro](https://nitro.build/) server
- **Styling** -- [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management** -- [Zustand](https://zustand-demo.pmnd.rs/)
- **Maps** -- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- **Monitoring** -- [Sentry](https://sentry.io/) (via `@sentry/tanstackstart-react`)
- **Testing** -- [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (e2e)
- **Linting / Formatting** -- [oxlint](https://oxc.rs/docs/guide/usage/linter) + [oxfmt](https://oxc.rs/)

## Prerequisites

- Node.js >= 20

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env.local` file in the project root with the following (optional) variable:

   ```dotenv
   VITE_SENTRY_DSN=<your-sentry-dsn>
   ```

   If `VITE_SENTRY_DSN` is not set, Sentry will be disabled and a warning will be logged on startup.

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Opens at [http://localhost:3000](http://localhost:3000). The page hot-reloads on file changes.

## Scripts

| Command             | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server on port 3000 (with Sentry instrumentation)        |
| `npm run build`     | Build for production (outputs to `.output/`)                                |
| `npm run preview`   | Preview the production build locally                                        |
| `npm start`         | Run the production server from `.output/server/index.mjs`                   |
| `npm test`          | Run unit tests with Vitest                                                  |

## Project Structure

```
├── e2e/                    # Playwright end-to-end tests
├── src/
│   ├── actions/            # Server actions (e.g. downloads)
│   ├── components/         # React components (App, Navbar, Map, etc.)
│   ├── config/             # App configuration (env, Mapbox keys)
│   ├── data/               # Static data / datasets
│   ├── lib/                # Shared library utilities
│   ├── routes/             # TanStack file-based routes
│   ├── services/           # Domain services (statistics, geometry)
│   ├── store/              # Zustand stores
│   └── utils/              # General-purpose utilities
├── tools/                  # Test setup and tooling scripts
├── vite.config.ts          # Vite + TanStack Start + Tailwind config
├── vitest.config.ts        # Vitest unit test config
├── playwright.config.ts    # Playwright e2e test config
└── tsconfig.json           # TypeScript configuration
```

## Configuration Files

### `vite.config.ts`

Vite is configured with the following plugins:

- `@tanstack/react-start` -- SSR-capable file-based routing
- `@tanstack/devtools-vite` -- TanStack DevTools
- `@tanstack/nitro-v2-vite-plugin` -- Nitro server integration
- `@vitejs/plugin-react` -- React Fast Refresh
- `@tailwindcss/vite` -- Tailwind CSS compilation
- `vite-tsconfig-paths` -- Resolve TypeScript path aliases (`@/*` -> `./src/*`)

### `vitest.config.ts`

- Environment: `jsdom`
- Excludes: `node_modules`, `dist`, `e2e`, `build`

### `playwright.config.ts`

- Test directory: `./e2e`
- Base URL: `http://localhost:3000`
- Runs `yarn preview` as the web server before tests
- CI-specific settings for retries, workers, tracing, and video capture

### `tsconfig.json`

- Target: ES2022, JSX: `react-jsx`
- Module resolution: `bundler`
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`

## Testing

### Unit Tests

```bash
npm test
```

Runs all unit tests via Vitest with jsdom environment.

### End-to-End Tests

```bash
npx playwright test
```

Runs Playwright tests from the `e2e/` directory against a local preview server.
