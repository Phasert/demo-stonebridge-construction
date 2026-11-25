# Visual assets, sources and licences

Stonebridge Construction is a fictional company. This file records every visual asset used by the site.

## Photography

| File | Where it is used | Source | Licence |
| --- | --- | --- | --- |
| `public/construction.webp` | Homepage “About” section (one placement only) | Unsplash photo `photo-1504307651254-35680f356dfd` (recorded in the repository's original README) | [Unsplash License](https://unsplash.com/license) |

This photograph was already in the repository. Its source is taken from the original README; it was not re-verified against Unsplash during this redesign because image hosts were unreachable from the build environment.

### Missing / not sourced

The previous version hot-linked nine Unsplash URLs that were never verified and fell back to the same photo. **All of them have been removed.**
Image hosts (Unsplash, Pexels, Wikimedia, Pixabay) were blocked from the build environment, so no new photography could be downloaded, checked or licence-verified. Rather than repeat one photograph or invent licence records, the following slots now use original illustrations (below). If you want real photography later, these are the slots to fill:

- Project concept hero images (4) — currently `ProjectPlate` illustrations
- Service imagery (6) — currently animated `SceneFigure` illustrations
- About / Services / Process page heroes — currently animated scenes

## Original illustrations (created for this project, no third-party assets)

All drawn in code; no external models, textures or fonts beyond Google Fonts.

- **3D construction site** — `src/components/three/construction-scene.tsx`. Procedural Three.js / React Three Fiber scene: tower crane with lifting cycle, segmented bricklayer rig, concrete frame, mixer truck, dust particles.
- **Signature build sequence** — `src/components/building-sequence.tsx`. Isometric SVG.
- **Service and process scenes** — `src/components/scenes.tsx`. Isometric / elevation SVG.
- **Project plates** — `src/components/project-plate.tsx`. Isometric SVG per concept.
- Shared isometric helpers — `src/lib/iso.tsx`.

## Fonts

Cormorant Garamond and Manrope via `next/font/google` (SIL Open Font License).
