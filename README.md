# SensED

SensED is an audio-guided English learning website for visually impaired learners. The interface is designed around large Atkinson Hyperlegible text, high-contrast color schemes, keyboard-first navigation, and spoken guidance for the main control panel and lesson flow.

The current implementation is a Next.js 16 App Router project using MUI components, lucide-react icons, browser SpeechSynthesis, seed learner accounts, local settings/progress fallback, and MongoDB-ready repository helpers.

## Core Experience

SensED has three main learner sections:

- **Lesson**: lesson navigation and interactive lesson player.
- **My progress**: local progress notifications and completed lesson steps.
- **Setting**: learner customization for color scheme, font size, and voice speed.

## Accessibility Requirements

These are project rules, not optional styling preferences:

- Use Atkinson Hyperlegible as the app font.
- Keep text large by default.
- Preserve high contrast and thick focus outlines.
- Make keyboard interaction work before pointer interaction.
- Provide audio guidance for the main panels and lesson steps.
- Use familiar keyboard controls: `Tab`, `Enter`, `Space`, arrow keys, number keys, `+`, and `-`.
- Use MUI components for UI instead of raw HTML tags like `div`, `button`, or `input`.
- Use lucide-react for icons.

More implementation rules are documented in [AGENTS.md](./AGENTS.md).

## Keyboard Controls

Global controls:

- `Tab`: move through focusable controls.
- `Enter`: activate focused controls.
- `Space`: activate focused controls or perform lesson actions.
- `+`: increase font size.
- `-`: decrease font size.

Lesson navigation:

- On the Lesson page, press `0` to open Getting Started.
- On the Getting Started unit page, press `1` to open Unit 1.
- On the Unit 1 lesson list, press `1` for Lesson 1 or `2` for Lesson 2.
- In the lesson player, arrow keys and Space are used for guided lesson actions.
- In dilemma steps, `ArrowLeft` and `ArrowRight` select answer choices.

## Lesson Content

The current data-driven sample lesson is stored in [`src/seed/lessons.ts`](./src/seed/lessons.ts).

Lesson 1 covers **In the bakery** and includes:

- Vocabulary learning
- Vocabulary spelling test
- Social interaction sentence patterns
- Situation/dilemma testing

Vocabulary items:

- Tray
- Tong
- Breadbox
- Bread
- Cashier

The lesson player reads narration through browser SpeechSynthesis and stores completed steps locally. If MongoDB is configured, progress can also be posted through the API route.

## Settings

Settings are managed in [`src/lib/settings.ts`](./src/lib/settings.ts) and applied through the MUI theme.

Supported color schemes:

- Yellow text on black background
- White text on black background
- Black text on yellow background

Supported learner controls:

- Font scale: clamped between `0.85` and `1.8`
- Speech rate: clamped between `0.5x` and `3.0x`

Settings are persisted in `localStorage` under `sensed-settings-v1`.

## Tech Stack

- Next.js `16.2.7`
- React `19`
- TypeScript
- MUI `7`
- Emotion
- MongoDB Node driver
- lucide-react
- Vitest
- Testing Library

## Project Structure

```text
src/
  app/
    api/
      login/
      progress/
    app/
      lessons/
      progress/
      settings/
    login/
  components/
    lessons/
    login/
    progress/
    settings/
    shell/
  hooks/
  lib/
  seed/
  theme/
  types/
```

Important files:

- [`src/components/lessons/LessonList.tsx`](./src/components/lessons/LessonList.tsx): top-level Lesson page showing only Getting Started.
- [`src/components/lessons/UnitList.tsx`](./src/components/lessons/UnitList.tsx): Getting Started unit list showing only Unit 1.
- [`src/components/lessons/UnitLessonList.tsx`](./src/components/lessons/UnitLessonList.tsx): Unit 1 lesson list with Lesson 1 and Lesson 2.
- [`src/components/lessons/LessonPlayer.tsx`](./src/components/lessons/LessonPlayer.tsx): interactive audio-guided lesson player.
- [`src/components/settings/SettingsPanel.tsx`](./src/components/settings/SettingsPanel.tsx): color, font, and speech-rate controls.
- [`src/components/shell/LearnerShell.tsx`](./src/components/shell/LearnerShell.tsx): main Lesson / My progress / Setting shell.
- [`src/lib/repositories.ts`](./src/lib/repositories.ts): MongoDB-ready repository functions with seed fallback.
- [`src/seed/lessons.ts`](./src/seed/lessons.ts): current lesson content.

## Getting Started

Install dependencies:

```bash
npm install
```

Copy environment variables if using MongoDB:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/login
```

## Seed Accounts

The app includes seed learner accounts for local development:

| Username | Password |
| --- | --- |
| `anna` | `learn123` |
| `minh` | `learn123` |

The login form defaults to `anna` / `learn123` to make local testing faster.

## MongoDB Configuration

MongoDB is optional for local development. Without `MONGODB_URI`, the app uses seed lesson data and local browser storage.

To enable MongoDB, set:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=sensed
```

Current MongoDB-ready collections:

- `users`
- `lessons`
- `progress`
- `settings`

Repository helpers live in [`src/lib/repositories.ts`](./src/lib/repositories.ts).

## Available Scripts

```bash
npm run dev
```

Runs the Next.js development server.

```bash
npm run build
```

Builds the production app.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run typecheck
```

Runs TypeScript without emitting files.

```bash
npm test
```

Runs Vitest tests.

```bash
npm run lint
```

Runs the configured Next.js lint command.

## Verification

Before considering a change complete, run:

```bash
npm run typecheck
npm test
npm run build
```

The build is offline-safe for fonts. The project uses a CSS Atkinson Hyperlegible font stack instead of `next/font/google` because Google Fonts fetching can fail in restricted build environments.

## Implementation Notes

- App UI should use MUI components. Avoid raw HTML UI tags except framework-required `<html>` and `<body>` in `src/app/layout.tsx`.
- Browser SpeechSynthesis is used for narration in [`src/hooks/useAudioGuide.ts`](./src/hooks/useAudioGuide.ts).
- Global font shortcuts are implemented in [`src/hooks/useGlobalShortcuts.ts`](./src/hooks/useGlobalShortcuts.ts).
- Progress is stored locally in `sensed-progress-v1` and optionally sent to `/api/progress`.
- Settings are stored locally in `sensed-settings-v1`.
- Static lesson content should be added as structured data first, then rendered through the generic lesson player.
