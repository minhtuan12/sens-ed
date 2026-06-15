# SensED Agent Rules

SensED is an English learning website for visually impaired learners. Every implementation decision must protect keyboard access, audio guidance, high contrast, and large readable text.

## Product Rules
- The app font is always Atkinson Hyperlegible.
- Default text is large. Do not introduce compact UI.
- Every main control panel and lesson step needs audio guidance through browser SpeechSynthesis or lesson audio assets.
- Keyboard navigation must work before pointer interaction.
- Use familiar keys: `Tab`, `Enter`, `Space`, arrow keys, number keys, `+`, and `-`.
- Lessons include Getting Started plus Unit 7: In the bakery.
- Settings include color scheme, font size, and speech rate from `0.5x` to `3.0x`.

## UI Rules
- Use MUI components for app UI. Do not use raw `div`, `button`, `input`, `section`, `main`, `nav`, or similar HTML tags in components.
- The only allowed raw framework tags are `<html>` and `<body>` in `src/app/layout.tsx`.
- Use lucide-react for icons.
- Keep the black/yellow visual language close to the provided UI unless a user setting changes the color scheme.
- Use thick borders, visible focus rings, and large target areas.

## Engineering Rules
- Use Next.js App Router and TypeScript.
- Keep interactive lesson UI in client components; keep data, auth, and persistence helpers isolated in `src/lib`.
- Use MongoDB repositories for persistence, with seed data available for local development.
- Prefer direct imports over broad barrel imports for React and MUI performance.
- Run `npm run typecheck`, `npm test`, and `npm run build` before calling work complete.
