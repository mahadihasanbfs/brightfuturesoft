---
name: bright-future-soft-design-system
description: Apply the Bright Future Soft visual system when creating, redesigning, or polishing any public page or section in this React website. Use for layout, colors, typography, cards, navigation-adjacent UI, forms, responsive styling, and visual consistency work. Keep dashboard and employee/admin interfaces outside the public-site scope.
---

# Bright Future Soft Design System

Use this skill for every public-facing Bright Future Soft page and section. Extend the same visual language across the homepage, About, Services, Projects, Blog, Careers, Contact, Company Profile, legal pages, shared footer, and future public routes. A page may have its own layout, but it should still feel like part of the same site.

## Brand direction

- The site is light, confident, and professional. Use white and pale blue-gray surfaces with Bright Future Soft blue as the main accent.
- Keep contrast crisp. Text should sit clearly above its background; do not blur content or use translucent text treatments.
- Use subtle, spacious grid texture as a background detail. Keep it low contrast and decorative so it never competes with the content.
- Prefer precise rectangular surfaces, fine borders, and restrained shadows. Use small corner radii when needed; avoid excessive pills, glowing effects, gradient text, and ornamental decoration.
- Keep motion quiet and useful: short hover transitions and small elevation or color changes. Respect reduced-motion preferences.
- The current header is an approved part of the design. Preserve its layout and behavior unless the user explicitly asks for a header change.

## Core tokens

Use these values or keep new tokens very close to them. Do not introduce a new accent color per page.

| Role | Value |
| --- | --- |
| Primary blue | `#0A65B4` |
| Hover blue | `#084F8D` |
| Main ink | `#142235` |
| Body text | `#66758A` |
| Secondary text | `#8794A4` |
| White surface | `#FFFFFF` |
| Soft surface | `#F7FAFF` |
| Soft blue surface | `#F1F8FF` |
| Border | `#E1E9F2` |
| Grid line | `rgb(10 44 77 / 2.2%)` |

Use the existing public design variables in `src/App.css` (`--site-accent`, `--site-ink`, `--site-muted`, `--site-surface`, and `--site-border`) when practical. If a token is missing, add it centrally rather than scattering unrelated hex values through components.

## Layout and typography

- Use a centered content width around `max-w-7xl` with consistent side gutters (`px-4 sm:px-6 lg:px-8`).
- Give major sections comfortable vertical spacing, generally `py-16` to `py-24`, with smaller spacing on narrow screens.
- Use short uppercase eyebrow labels with modest tracking, then a direct headline and one concise supporting paragraph.
- Section headlines should use dark ink and may highlight one phrase in primary blue. Keep one consistent heading treatment across the page.
- Keep body copy readable: approximately 14–16px, comfortable line-height, and a line length that does not span the full viewport on desktop.
- Avoid using color alone to indicate active, selected, or error states.

## Surfaces, cards, and controls

- Cards use a white surface, a thin `#E1E9F2` border, and a light blue-gray shadow. A hover may lift the card slightly and strengthen its border or shadow.
- Keep card padding consistent and align headings, descriptions, imagery, and actions across a row.
- Use real product, team, client, or project imagery already present in the repository or returned by the existing API. Preserve aspect ratios and use `object-fit` intentionally.
- Primary actions use solid blue with white text. Secondary actions use a white surface, a fine neutral border, and dark text. Both need visible focus states and generous touch targets.
- Inputs use white backgrounds, dark text, neutral borders, clear labels, and a visible blue focus ring. Error and success feedback should be explicit and readable.

## Reusable section patterns

- **Section intro:** a small blue eyebrow, a concise headline with an optional blue phrase, and a supporting paragraph aligned beside or below it.
- **Logo/client strip:** a light neutral surface and an evenly divided grid; keep logos contained and at a visually consistent height.
- **Process:** show a clear active step and a compact, keyboard-operable step list. Do not make a step selectable only by hover.
- **Services and projects:** use consistent image ratios, aligned copy, and an obvious link to the detail page. Keep project names and descriptions visible without requiring hover.
- **Technology:** group tools by category in bordered white cards. Use contained logos and readable names; tooltips may supplement but must not be the only label.
- **Testimonials:** use consistent cards with the client logo, readable review text, and a clear client attribution. Carousels should have usable controls/pagination and should not move so quickly that content is difficult to read.
- **Team:** show portrait, name, role, and an optional external profile link. Do not invent profiles or expose private fields to fill empty slots. Show a considered loading or empty state when data is unavailable.
- **Contact:** put the value proposition and contact details beside the form on wide screens, then stack them on mobile. Keep the form full width, clear, and usable without rich text editing features unless required by the existing workflow.
- **Footer:** use a pale surface, clear column headings, concise link lists, and accessible social links. Keep it visually connected to the page without using a heavy dark block.

## Responsive and accessible behavior

- Design mobile first. At narrow widths, stack multi-column sections, let actions wrap, and constrain every image and card to the viewport.
- Check for horizontal overflow at phone widths. In particular, long headlines, button rows, carousels, and square media must shrink or wrap rather than widen the page.
- Keep interactive elements keyboard reachable with a visible focus state. Use semantic headings, links, buttons, form labels, and descriptive image alternatives.
- Add accessible names to icon-only links and buttons. Decorative icons and grid overlays should be hidden from assistive technology.
- Keep motion nonessential and reduced when `prefers-reduced-motion: reduce` is enabled.
- Preserve existing routes, query keys, form submissions, and user interactions when changing the presentation.

## Project implementation rules

- Public routes render inside `.public-site` in `src/pages/Main/Main.jsx`. Scope public-only color and layout rules beneath `.public-site` so dashboard and employee/admin areas do not inherit them.
- The main public styles live in `src/App.css`; global baseline styles live in `src/index.css`. Prefer shared tokens and reusable classes over appending another collection of broad utility overrides.
- Existing shared patterns include `.site-eyebrow`, `.section-heading-row`, `.site-outline-button`, and section classes for the client, process, services, projects, technology, team, testimonials, contact, and footer layouts. Reuse or improve these patterns instead of making a one-off visual language for each route.
- Keep content and data connected to existing APIs. Use honest loading, empty, and error states; never fabricate client names, testimonials, projects, or team members.
- Keep the current header intact by default. If asked to change it, apply these same tokens, type, border, spacing, and accessibility rules.
- Before finishing a visual change, review the affected route at desktop and phone widths and fix clipping, inconsistent spacing, or unreadable contrast.
