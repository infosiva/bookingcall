# HANDOFF — bookingcall design pass
**Date:** 2026-10-06  **Status:** COMPLETE
**Goal:** Apply design system: travel-magazine archetype, dark navy + yellow, honest content.

## Design lock
- Archetype: travel-magazine (via pickArchetype; differs from batch: directory-marketplace, career-portfolio, weekend-lifestyle)
- Palette: bg #0c1a2b, accent #facc15 (registered in design-system/tokens/palette-registry.json)
- Logo: BookingCall, handset-in-pin mark, accent-coloured "Call"; app/icon.svg + app/apple-icon.svg + components/Logo.tsx
- Demo: animated "dispatch" card on the page (typed, made-up details, labelled)
- AI pillars: chat route uses lib/ai.ts free chain (Groq, Gemini, Cerebras ...) with graceful fallback; no new deps. Exempt: eval/RAG (no retrieval).
- Theme-loader: @vercel/edge-config is a dependency, so design-system theme-loader is wired.

## Files to touch
app/layout.tsx, app/globals.css, app/page.tsx, components/Navbar.tsx, components/Logo.tsx (new), app/icon.svg, app/apple-icon.svg, lib/theme-loader.ts, app/icon.tsx -> icon.tsx.bak, app/api/feedback/route.ts

## Steps
- [x] Design lock
- [ ] theme-loader + layout
- [ ] logo/icons
- [ ] page + css
- [ ] chat/feedback check
- [ ] build + screenshots

## Resume from here if interrupted
Design lock written.


## Files changed
lib/theme-loader.ts, app/layout.tsx (theme-loader, Fraunces, http tracker removed, GA4 gated), app/globals.css, app/page.tsx, components/Navbar.tsx, components/Logo.tsx, components/FloatingChatWrapper.tsx (yellow accent), app/icon.svg, app/apple-icon.svg, vertical.config.ts (themeColor amber). app/icon.tsx renamed to icon.tsx.bak.
Not restyled: /chat page body (still near-black generic), feedback route unchanged.


## OWASP LLM Top 10 dispositions (gate item 45, 2026-10-07; list recalled from memory, unverified)
- LLM01 prompt injection: lib/guard.ts present, NOT yet wired into routes; no output filtering or tool sandbox review done. PARTIAL.
- LLM02 sensitive info disclosure: `redact()` helper available; not applied to every log. PARTIAL.
- LLM04/10 DoS / unbounded consumption: per-IP rate limit where present; token budgets not enforced. PARTIAL.
- LLM05 improper output handling: model output rendered as text; not audited for HTML sinks. UNVERIFIED.
- LLM06 excessive agency: no tool-calling agents audited. UNVERIFIED.
- Others (supply chain, poisoning, embeddings, misinformation): not assessed.


## ANIMATED SCOPE (gate items 19/21, derived from code 2026-10-07)
- Moves: AnimatedBg (ambient hero/background); CSS keyframes: bcblink, bcdrift, blink, ds-float, ds-shift, fadeUp, float, float-beauty; transitions on interactive elements.
- Trigger: page load (ambient) and hover/press (interactive). Reduced motion: honoured via prefers-reduced-motion block.
- STATUS: scope documented from existing code only. Skill-stack passes (ui-ux-pro-max, emil-design-eng, impeccable critique, review-animations) and 375/1280 screenshot review are NOT yet run for this app. Item 21 stays OPEN until they are.

## Skill-stack pass 2026-10-08 (375 + 1280 screenshots read)
- ANIMATED SCOPE: hero chat transcript types in line by line (shows the booking flow); CTA press scale; entry fade. Reduced-motion respected.
- Fixed: none needed. Fold shows H1, CTA, demo card at 375 and 1280. Chat FAB and Feedback pill clear. Targets 44px+.
- Not measured: automated contrast ratio, visual-qa.mjs, build. Not pushed.
- SKILL-STACK: done
