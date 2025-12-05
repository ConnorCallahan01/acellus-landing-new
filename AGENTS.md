# Acellus Landing - Agent Guidelines

## Commands
- **Build**: `npm run build`
- **Dev**: `npm run dev` 
- **Type check**: `npm run check`
- **Type check (watch)**: `npm run check:watch`
- **Preview**: `npm run preview`

## Code Style
- **Components**: PascalCase files (e.g. CoverSection.svelte, TeamCard.svelte)
- **Stores**: camelCase (e.g. scroll.ts, currentSection)
- **Imports**: Use `$lib/` alias for internal imports, external imports at top
- **TypeScript**: Strict mode enabled, all files must have `lang="ts"`
- **Styling**: Tailwind CSS classes, use responsive prefixes (md:, lg:, xl:)
- **Animations**: GSAP for complex animations, CSS transitions for simple ones
- **File structure**: Components in `src/lib/components/`, sections in `src/lib/components/sections/`
- **Svelte patterns**: Use `onMount` for DOM initialization, export functions for parent communication
- **Colors**: Use custom Tailwind colors (purple-primary, pink-primary, etc.)