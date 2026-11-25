# Stonebridge Construction

Stonebridge Construction is a fictional construction company created for a web development portfolio. The site's concept is **“From Blueprint to Reality”**:

- **Hero:** a live, procedural 3D construction site (Three.js via React Three Fiber). A tower crane slews, hoists a steel beam on slings, places it and releases it; a bricklayer bends, lifts a brick, places and taps it into the wall, and returns. It is lazy-loaded, pauses offscreen, has a pause button, and falls back to a static drawing without WebGL or with reduced motion.
- **Signature scroll sequence:** “Every Great Structure Starts Somewhere.” An isometric building is drawn, founded, framed, clad and completed as you scroll (reversible), with stage buttons and an accessible text alternative.
- **Services:** six selectable disciplines, each with its own animated demonstration.
- **Process:** six selectable stages (consultation → handover), including an articulated excavator.
- **Projects:** an editorial showcase that assembles each concept, a pinned horizontal story, and mid-build vs complete comparison sliders.
- A quotation form with frontend validation and a clearly demo-only submission state.

All projects are conceptual. See [ASSETS.md](ASSETS.md) for image sources, licences and missing assets.

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
| `src/components/` | UI, Motion for React animations, SVG scenes (`scenes.tsx`, `project-plate.tsx`, `building-sequence.tsx`) |
| `src/components/three/` | React Three Fiber construction-site hero |
| `src/lib/` | Content data and isometric drawing helpers |
| `public/` | Static assets |
| `eslint.config.mjs` | ESLint flat configuration for Next.js and TypeScript |
| `bun.lock` | Dependency lockfile |
