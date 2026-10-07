# DESIGN — BookingCall
Source of truth: `agents/design-system` (MASTER.md). This file is the project pointer.

- Accent: `#facc15` on bg `#0c1a2b`
- Layout/palette/bg animation/GA4/flags: overridable by the hub via Edge Config `theme_bookingcall` (loaded by `lib/theme-loader.ts`, applied in `app/layout.tsx`); hub values win over the defaults here.
- Background: `components/AnimatedBg.tsx` (hub `layout.bgAnimation`, reduced-motion safe, default `none` = unchanged look).
- Logo: `components/Logo.tsx` (used in the navbar/header); favicon is static `app/icon.svg` (no `app/icon.tsx`).

## AI platform (ai-core) status
Not on ai-core yet (honest gap): AI calls use the local free chain. No document upload/RAG/memory in scope; exempt until such a feature exists.
