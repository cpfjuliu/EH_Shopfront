# Accessibility requirements

Use WCAG-conscious design, targeting WCAG 2.2 Level AA for future UI work. This is a design and verification target, not a claim of audited conformance. Use native semantic elements first; add ARIA only where necessary and accurate.

## Perception and layout

- Aim for at least 4.5:1 contrast for normal text, 3:1 for large text, and 3:1 for essential control boundaries and graphical information against adjacent colors. Check actual rendered combinations, including status and focus states.
- Never convey meaning through color alone. Pair statuses, chart series and validation with labels, symbols or patterns.
- Support text resizing and zoom without losing content or controls. Verify reflow at 320 CSS pixels wide; isolate necessary two-dimensional table/chart scrolling.
- Prefer touch targets of at least 44 by 44 CSS pixels. For dense layouts, maintain at least 24 by 24 CSS pixels and adequate separation; do not shrink controls merely to fit more features.
- Respect reduced-motion preferences. Avoid unnecessary animation, flashing and time-dependent reading requirements.

## Keyboard and assistive technology

- Make every action keyboard-operable in a logical order, with a visible, unobscured focus indicator. Avoid positive `tabindex` and keyboard traps.
- Provide landmarks, logical heading levels, a main-content skip route and meaningful accessible names. Icon-only buttons need an accessible label.
- Label form inputs persistently and associate hints and errors programmatically. Do not rely on placeholder text or tooltips for essential instructions.
- For tab widgets, use appropriate tab roles, selected state and arrow-key behavior. Ensure the active panel is associated with its tab.
- For modal dialogs/drawers, move focus inside, contain it, make the background inert and restore focus to the trigger or a logical successor. Support Escape where safe; handle unsaved changes explicitly. Nonmodal drawers must not trap focus.
- Announce important async status and validation changes without excessive live-region chatter. Do not move focus unexpectedly when results refresh.
- Give tables associated headers and charts a meaningful summary plus accessible values. Tooltips must not require a mouse, and essential evidence must remain available without them.

## Verification

For affected flows, manually test keyboard-only completion, focus after overlays and async updates, zoom/reflow, target sizes and contrast. Check names, roles, labels and important announcements with a screen reader. Include mobile/touch layouts and reduced motion when relevant. Automated checks complement these checks; they do not prove conformance. Record unverified checks and gaps in the [UX review](ux-review-checklist.md).
