# Landing Stripe Synthesis — Design Rationale

> Companion doc for [`landing-stripe-synthesis.html`](landing-stripe-synthesis.html). Open the HTML in a browser to view; this file explains what was kept, what was changed, and what to port into the Next.js app.

## What This Synthesizes

Three sources, weighted:

1. **Stripe homepage (50%)** — generous whitespace, calm typography, mesh-gradient hero, stat strip, sticky CTAs, multi-section feature breakdown, code/integration showcase, restraint over spectacle.
2. **Magic Dirt v2 / our existing design (35%)** — moss green primary, warm earth gradient, photoreal ADU miniatures as visual identity, Playfair Display for hero, Nunito body, generous shadows, the sky-to-earth page gradient, custom status colors.
3. **cc-crossbeam upstream (15%)** — three-flow card layout, "built with Claude Opus" attribution, code/skill showcase pattern, the "watch demo / try it live" twin-CTA approach.

**What was deliberately abandoned from each source:**

- From Stripe: the purple/pink Stripe brand palette, the abstract gradient as primary visual (we have ADU miniatures), the financial-services voice.
- From Magic Dirt v2: the CA-era marketing copy ("28 reference files of CA law", "480+ cities supported"), the "Claude Code Hackathon 2026" badge, the Watch-Demo-as-primary-CTA pattern.
- From cc-crossbeam: the California-specific content, the engineer-friend backstory hero copy, the GitHub source link in the primary CTA row.

## Section-by-Section Map

| Section | Source | Notes |
|---|---|---|
| Sticky nav with backdrop blur | Stripe | Adapted: PermitMonkey wordmark + moss-green logo mark, MA pill chip |
| Hero with mesh-gradient background | Stripe + ours | Stripe's gradient layering technique; OUR palette (moss + coral + earth + sky, never Stripe purple) |
| Hero headline (Playfair, italic gradient text accent) | Ours (DESIGN-BIBLE) | Playfair 900 with `tracking-hero` (-0.025em); italic gradient on the second line |
| Hero floating cards (citation pill demo + Forest Hills MBTA) | New | Demonstrates the Provenance UI moat in the hero itself |
| City coverage strip with marquee mask | Stripe | Cities as text, not logos (we don't have city logos) |
| 4-column stat strip | Stripe | OUR stats: 9/12 refs, 100% verified, <15min, 3 flows |
| Three-flow feature grid | cc-crossbeam structure | Magic Dirt v2 card-float style; status colors in icon backgrounds |
| **Provenance UI showcase** (the moat) | New, this synthesis | Sticky left column explainer + center stage response-letter mock with real citation pills + popover panel mock to the right |
| MA differentiation with code block | Stripe code-showcase pattern | Code block uses our actual inline provenance tag format |
| Customer voice quote | Stripe testimonial pattern | Honest "name redacted, beta confidentiality" — don't fake a testimonial |
| Pricing — 3 tiers | Standard SaaS | Free / Pro $99 / Firm $499; ring around recommended (Pro) |
| Free-tool CTA section (dark gradient) | Stripe final CTA | OUR moss-700-to-moss-900 gradient with coral accent button |
| Footer with commit SHA | cc-crossbeam ("built with Claude") | Audit-grade flex: footer carries the actual git commit SHA |

## Typography Decisions

- **Hero headline**: Playfair Display 900, `tracking-hero` (-0.025em), `leading-[1.02]`. Stripe uses very light weights (300) for hero — we keep Playfair's heavy weight because it's what makes Magic Dirt v2 feel premium.
- **Section headings**: Playfair Display bold 700, `tracking-tight2` (-0.015em). Lighter than Stripe's 300-weight headings to retain our identity.
- **Body**: Nunito 400 16px, `leading-relaxed` (1.625). Same as Stripe's spec but with our font.
- **Eyebrow labels**: Nunito 600, uppercase, `tracking-[0.18em]`. Stripe's pattern.
- **Code**: JetBrains Mono 13px on dark background `#0E281D` (deep moss). Stripe uses near-black; we use the deepest moss for brand consistency.

## Color Synthesis

- **Primary**: Moss `#2D6A4F` (unchanged from DESIGN-BIBLE.md).
- **Accent**: Sunset coral `#F28B6E` for "needs attention" callouts (Ch 150 effective date pill, free-tool CTA button).
- **Neutrals**: Earth tones (`#1C1917`, `#FAF3E8`, `#E8DCC8`) instead of Stripe's cool grays.
- **Hero gradient mesh**: Four radial gradients in moss / coral / sky / earth — never Stripe's pink/purple/orange palette.
- **Status pills**: Moss (verified), amber (unverified), coral (broken). Same as Provenance UI design spec.
- **Page background**: The DESIGN-BIBLE.md gradient (sky → white → warm earth → soil) is the body background; sections sit on top with white/65-86% opacity for the floating-card effect.

## Components To Port To Next.js

When porting from this HTML to `frontend/app/page.tsx`:

1. **Replace** the existing `LandingPage` component (currently 698 lines, CA-era content) with the structure from this HTML.
2. **Import** the existing `<AduMiniature />` component for the hero visual (replace `<img src="https://placehold.co/...">`).
3. **Use** the existing shadcn `Button` and `Card` primitives — match the `btn-primary` / `btn-secondary` / `card-float` styles in this HTML to their shadcn variants (`Button variant="default"` rounded-full / `Button variant="outline"` rounded-full / `Card` with the float shadow class).
4. **Add** custom Tailwind utilities to `frontend/app/globals.css` for `gradient-text`, `card-float`, `pill`, `pill-amber`, `pill-coral`, `topo`, `hero-mesh`, `marquee-mask`. The `@theme inline` block in `globals.css` already has the color tokens.
5. **Wire** the Provenance UI showcase block to the actual `<CitationPill>` / `<CitationPanel>` components from [`frontend/components/citation-pill.tsx`](../../frontend/components/citation-pill.tsx) — the mocks in this HTML are styled to match the live components.
6. **Generate** the Citations / Trust / Pricing pages as separate Next.js routes; the landing page has `#provenance`, `#cities`, `#pricing`, `#free-tools` anchor links that should resolve to either in-page sections or full pages depending on content depth.

## What This Doesn't Solve Yet

- **Real ADU miniature placement.** The HTML uses `placehold.co` for the hero ADU. The actual `<AduMiniature />` component renders a different aspect ratio; the hero column dimensions may need a tweak when ported.
- **Mobile responsive review.** The grid breakpoints (lg:grid-cols-12, md:grid-cols-3, sm:flex-row) are sketched but I didn't get to test mobile in a browser. Worth a manual pass in dev tools at 375px / 768px / 1280px.
- **Accessibility pass.** No focus styles tuned for the citation pill demo; tab order on the pricing cards not reviewed; color contrast on the dark moss CTA section needs checking against WCAG AA.
- **Real screenshots.** The instruction format calls for screenshot-and-iterate. I produced this on first pass; the next iteration should be a manual `npm run dev` view + screenshot comparison against the Stripe reference.

## Iteration Plan

If you approve this direction:

1. **Round 1 (in-Next.js port):** translate this HTML to `frontend/app/page.tsx` using the existing component primitives. Replace the placeholder ADU image with `<AduMiniature />`. Run `npm run dev` and visually confirm the gradient, typography, and hero card-float behavior match.
2. **Round 2 (responsive):** check 375 / 768 / 1280 breakpoints. The grid layouts are 12-col on desktop, stack on mobile; the floating cards in the hero hide below `md`.
3. **Round 3 (provenance integration):** make the citation pills in the showcase section LIVE — extract from a real corrections sample, run through `verifyCitationsAction`, render with the actual `<CitationPill>` and `<CitationPanel>` components. Eat the dog food on the landing page itself.
4. **Round 4 (content polish):** review every headline and subhead for the institutional voice (no em dashes in production copy, no AI tells, specific not generic).

## What To Try If You Want To Push Further

- **Animated hero gradient.** Stripe's hero has subtle parallax. Could add a slow rotation to the mesh gradient (5-10s loop) — but DESIGN-BIBLE.md forbids motion longer than 500ms. The right call is probably to skip animation or do a one-time entrance only.
- **Live eval scoreboard widget.** Pull the latest `server/evals/reports/<timestamp>.json` and display "Citation precision: 98% (last run 2 hours ago)" as a real-time trust signal in the nav or footer. Phase 2 work.
- **City-specific landing variants.** `/ma-adu/boston`, `/ma-adu/cambridge`, etc., generated programmatically from the skill reference files. Phase 3 distribution work — but the design system established in this synthesis would carry through.
