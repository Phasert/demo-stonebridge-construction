# Stonebridge Construction

Stonebridge Construction is a fictional commercial construction company created for a web development portfolio. The demo includes a responsive homepage, illustrative service descriptions, and a placeholder brand icon.

## Getting started

Install Bun 1.4.3 and Node.js 24 or later. Bun manages dependencies and runs the project scripts. Next.js runs on Node.js.

```sh
bun install --frozen-lockfile
bun run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables are required.

## Checks and production

```sh
bun run lint
bun run typecheck
bun run build
bun run start
```

`start` serves the production build locally.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Next.js App Router pages, layout, metadata, favicon, and Tailwind CSS v4 entry point |
| `src/components/` | Homepage components using Lucide React and Motion for React |
| `public/` | Static assets |
| `eslint.config.mjs` | ESLint flat configuration for Next.js and TypeScript |
| `bun.lock` | Dependency lockfile |

Construction photography is illustrative. [Photo on Unsplash](https://images.unsplash.com/photo-1504307651254-35680f356dfd).
