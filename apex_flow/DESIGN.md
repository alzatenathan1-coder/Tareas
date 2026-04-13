# Design System Document: The Fluid Taskscape

## 1. Overview & Creative North Star: "Kinetic Serenity"
This design system moves beyond the rigid, boxy constraints of traditional project management tools. Our Creative North Star is **Kinetic Serenity**. We aim to balance the high-stakes urgency of task management with a calm, editorial digital environment. 

By utilizing **intentional asymmetry** and **tonal layering**, we break the "template" look. We reject the standard grid in favor of a "floating" interface where tasks feel like physical objects resting on a soft, expansive surface. This approach ensures the PWA feels like a premium, bespoke application rather than a generic utility.

## 2. Colors & Atmospheric Tones
The palette is rooted in a sophisticated spectrum that communicates priority through temperature rather than just alarm.

### The Priority Gradient
*   **Urgent (Tertiary):** `#b61722` (Tertiary) transitioning to `#da3437` (Tertiary Container). We use a deeper, more editorial red to avoid "error fatigue."
*   **Standard (Primary):** `#0058be` (Primary) to `#2170e4` (Primary Container). A vibrant, trustworthy blue that drives action.
*   **Low Priority (Secondary):** `#495e8a` (Secondary) to `#b6ccff` (Secondary Container). A muted, calm slate-blue.

### Semantic Surface Rules
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background shifts. For example, a Kanban column (using `surface-container-low`) sits on the main `background` without an outline.
*   **The Glass & Gradient Rule:** Use **Glassmorphism** for floating action buttons (FABs) and navigation bars. Apply `surface` colors at 80% opacity with a `20px` backdrop blur. 
*   **Signature Textures:** Hero areas and active task states should utilize a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide "soul" and depth.

## 3. Typography: Editorial Clarity
We utilize **Inter** for its mathematical precision and readability. The hierarchy is designed to feel like a high-end magazine, where the scale itself defines the importance.

*   **Display (lg/md/sm):** Used for "Zero State" screens or daily summaries. Large, tight tracking (-0.02em) to create an authoritative presence.
*   **Headline (lg/md/sm):** Reserved for Column Titles and Project Names. These should feel "heavy" to anchor the fluid layout.
*   **Title (lg/md/sm):** Used for Task Card titles. High contrast against body text ensures scannability.
*   **Body (lg/md/sm):** Standardized for task descriptions. Use `on_surface_variant` for secondary details to reduce visual noise.
*   **Label (md/sm):** Used for metadata (dates, tags). Always uppercase with +0.05em letter spacing for a "designed" feel.

## 4. Elevation & Depth: Tonal Layering
We abandon traditional "drop shadows" for a more sophisticated, naturalistic approach to hierarchy.

*   **The Layering Principle:** Depth is achieved by "stacking" the surface tiers. 
    *   *Level 0 (Base):* `surface` (The "Floor")
    *   *Level 1 (Columns):* `surface-container-low`
    *   *Level 2 (Cards):* `surface-container-lowest` (The "Lift")
*   **Ambient Shadows:** For dragged cards or modals, use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(21, 28, 39, 0.06);`. The shadow color is a tinted version of `on_surface`, never pure black.
*   **The Ghost Border Fallback:** If accessibility requires a stroke, use `outline_variant` at **15% opacity**. It should be felt, not seen.

## 5. Components: Fluid Primitives

### Kanban Task Cards
*   **Style:** `surface-container-lowest` background with a `lg` (1rem) corner radius. 
*   **Constraint:** No dividers between card elements. Use `0.75rem` vertical spacing to separate the title from the metadata.
*   **Priority Indicator:** A 4px vertical "glow" (gradient) on the left edge of the card, using the Priority Gradient colors.

### High-Touch Buttons
*   **Primary:** Solid `primary` background, white text. Radius: `full`. Minimum height of `48px` for mobile ergonomics.
*   **Secondary (Action Chips):** `surface-container-high` with `on_surface_variant` text. These should feel like "pebbles" on the interface.

### Input Fields & Search
*   **Style:** `surface-container-low` background, no border. On focus, transition the background to `surface-container-highest` and add a subtle `primary` glow.
*   **Interaction:** Floating labels using `label-md` for a modern, minimalist footprint.

### Navigation (PWA Optimized)
*   **Bottom Bar:** Glassmorphic container (`surface` @ 85% + blur). Icons use `on_surface_variant`, with active states using `primary` and a small circular `primary_fixed` glow behind the icon.

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a structural element. If an interface feels cluttered, increase the padding, don't add a line.
*   **DO** use `xl` (1.5rem) rounded corners for top-level modals and "Bottom Sheets" to emphasize the mobile-first nature.
*   **DO** ensure all touch targets are at least `44x44px`, even if the visual element (like a small icon) is smaller.

### Don't
*   **DON'T** use `error` red for "Urgent" tasks. Use the `tertiary` (#b61722) editorial red to maintain the premium aesthetic.
*   **DON'T** use traditional cards with 1px borders. Use the Surface Hierarchy (Lowest on Low) to create the "Card" effect.
*   **DON'T** use pure black (#000000) for text. Always use `on_surface` (#151c27) to maintain tonal softness.