# Omlom Demo Platform

This repository contains a temporary demo build of the Omlom product: a gamified student productivity app with quests, progression, social activity, leaderboards, and planning views.

The UI was originally derived from a Figma export, but the current codebase is now a working demo app with seeded local data.

## Run The Demo

### Option 1: Run in dev mode

1. Install dependencies:

```bash
npm install
```

2. Start the Vite dev server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal.

### Option 2: Build a temporary standalone demo

This project supports a temporary self-contained build for quick sharing and double-click testing.

1. Build the app:

```bash
npm run build
```

2. Open:

```text
dist/index.html
```

After `npm run build`, the generated `dist/index.html` is inlined for temporary demo use, so you can open it directly in a browser from disk.

## Demo Notes

- The app uses seeded local demo data on first load.
- Demo progress is stored locally in the browser.
- The profile screen includes a "Reload demo" action to restore the initial demo state.
- Navigation uses hash routing automatically when the app is opened from `file://`.

## Main Commands

```bash
npm run dev
npm run build
```

## Output

- Development entry: `src/main.tsx`
- Built temporary demo: `dist/index.html`
- Build inliner for file-based demo runs: `scripts/inline-dist.mjs`
