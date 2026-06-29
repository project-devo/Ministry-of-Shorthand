# Ministry of Shorthand — UI Overhaul Design Spec

This document details the visual, typographic, motion, and structural specifications for the Ministry of Shorthand UI redesign. It serves as the primary implementation blueprint for subsequent milestones.

---

## 1. Theme Concept & Premium Color Palette

### 1.1 The Concept: Royal Obsidian & Glowing Accents
The current user interface is bound to a flat grayscale theme (`chroma = 0` in OKLCH). To establish a professional, premium, and high-performance feel, the application will shift to a **Royal Obsidian & Slate** foundation, punctuated by vibrant, glowing accents in **Electric Violet** (primary brand actions) and **Neon Emerald** (success metrics and accuracy). 

### 1.2 Proposed OKLCH Variable Configurations (`app/globals.css`)
Modify the theme variables in `app/globals.css` to introduce subtle color values (chroma > 0) with a blue-gray hue (240–270) to eliminate the dullness of pure gray:

```css
:root {
  /* Premium Light Mode: Cool Slate & Indigo */
  --background: oklch(0.99 0.006 240);       /* Clean canvas with subtle blue-gray tint */
  --foreground: oklch(0.18 0.025 240);       /* Deep slate-blue body text */
  --card: oklch(1 0 0);                      /* Pure white card backgrounds */
  --card-foreground: oklch(0.18 0.025 240);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0.025 240);
  
  --primary: oklch(0.48 0.182 270);          /* Rich Royal Violet/Indigo */
  --primary-foreground: oklch(0.99 0.005 240);
  
  --secondary: oklch(0.95 0.015 240);        /* Pale cool gray-blue background */
  --secondary-foreground: oklch(0.35 0.11 270); /* Deep indigo highlight text */
  
  --muted: oklch(0.95 0.01 240);
  --muted-foreground: oklch(0.52 0.035 240);  /* Soft readable metadata slate */
  
  --accent: oklch(0.94 0.02 245);
  --accent-foreground: oklch(0.25 0.09 270);
  
  --destructive: oklch(0.60 0.18 20);        /* Deep Rose/Red for mistakes */
  --destructive-foreground: oklch(0.99 0.005 240);
  
  --border: oklch(0.92 0.015 240);           /* Low-contrast separator */
  --input: oklch(0.92 0.015 240);
  --ring: oklch(0.48 0.182 270);             /* Focused ring outline color */
  --radius: 0.75rem;                         /* Increased for modern, softer elements */
}

.dark {
  /* Premium Dark Mode: Royal Obsidian & Neon Glow */
  --background: oklch(0.12 0.012 240);       /* Deep Obsidian Base */
  --foreground: oklch(0.97 0.008 240);       /* Crisp, readable off-white text */
  
  --card: oklch(0.16 0.018 240);             /* Lighter slate-obsidian for card surfaces */
  --card-foreground: oklch(0.97 0.008 240);
  
  --popover: oklch(0.14 0.015 240);
  --popover-foreground: oklch(0.97 0.008 240);
  
  --primary: oklch(0.65 0.22 272);           /* Neon Electric Violet brand action */
  --primary-foreground: oklch(0.99 0.005 240);
  
  --secondary: oklch(0.20 0.025 240);        /* Dark obsidian secondary buttons */
  --secondary-foreground: oklch(0.85 0.04 260); /* Glowing purple-tinted labels */
  
  --muted: oklch(0.20 0.02 240);
  --muted-foreground: oklch(0.68 0.025 240);  /* Soft silver/gray for subheaders */
  
  --accent: oklch(0.22 0.035 260);
  --accent-foreground: oklch(0.95 0.02 260);
  
  --destructive: oklch(0.55 0.20 18);        /* Vivid crimson red for spelling/omit errors */
  --destructive-foreground: oklch(0.99 0.005 240);
  
  --border: oklch(0.22 0.02 240);            /* Dark hairline border edge */
  --input: oklch(0.22 0.02 240);
  --ring: oklch(0.65 0.22 272);              /* Glowing active border ring */
}
```

### 1.3 Contextual and Functional Accents
Extend the Tailwind configuration inside `app/globals.css` with the following variables:
- **Success Accent** (Used for Accuracy passing thresholds of >= 95%):
  - Light mode: `oklch(0.42 0.16 142)` (Emerald Forest Green)
  - Dark mode: `oklch(0.72 0.19 142)` (Vibrant Neon Mint/Emerald)
  - CSS Variable mapping: `--success` and `--success-foreground`
- **Warning Accent** (Used for border-line speed and accuracy margins):
  - Light mode: `oklch(0.70 0.15 75)` (Amber gold)
  - Dark mode: `oklch(0.82 0.16 75)` (Glowing Neon Amber)
- **Gradient Palettes**:
  - **Primary Glow**: `from-[oklch(0.60_0.20_260)] to-[oklch(0.65_0.22_300)]` (Electric Purple-Violet gradient for Hero and highlight elements)
  - **Obsidian card backdrop**: Radial color overlay blending dark card base into a deep dark blue corner glow (`bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/0.05,transparent_50%)]`)

---

## 2. Motion & Animation Specs (Framer Motion)

Animations should feel snappy and deliberate, not sluggish. Physicist-based springs are chosen over duration-based cubic-beziers.

### 2.1 Spring Presets
Use the following configurations when implementing animations:

| Preset Name | Stiffness | Damping | Mass | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `spring-gentle` | 120 | 20 | 1.0 | Card hover lifts, standard menu expands, page-load shifts. |
| `spring-bouncy` | 220 | 12 | 0.85 | Score dial popups, error highlight badges, status updates. |
| `spring-smooth` | 80 | 15 | 1.2 | Expandable sidebar drawers, large test-runner view panel resizing. |

### 2.2 Entrance Animations & Scroll Reveals
1. **Landing Page Section Loads**:
   - Wrap sections in a `ScrollReveal` component using Framer Motion's `useInView`.
   - Motion properties: `initial={{ opacity: 0, y: 30 }}` -> `animate={{ opacity: 1, y: 0 }}`.
   - Transition: `spring-gentle` with a slight stagger.
2. **Staggered Grid Item Entry**:
   - Features section cards and Courses grid cards should enter with a cascade stagger.
   - Container configuration: `variants={{ show: { transition: { staggerChildren: 0.08 } } }}`.
   - Children: `variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}`.

### 2.3 Interactive Micro-Interactions
- **Card Hover Elevation**:
  - Hover: Scale to `1.015`, shift vertically `y: -6px`, and raise shadows from `shadow-sm` to a glowing `shadow-xl shadow-primary/5`.
  - Border transition: Animate border color opacity from `border-border/30` to `border-primary/50` over `0.2s`.
- **Button Micro-transitions**:
  - Hover states should slightly slide the background gradient, and trigger horizontal translations on Lucide arrow elements (`x: 0` to `x: 4px`).
  - Active tap state: `whileTap={{ scale: 0.985 }}`.

---

## 3. Practice Interface Layout Specs

The practice environment is the core value driver of the application. It requires a dedicated, immersive, distraction-free interface.

### 3.1 Test Runner State-Based View Transitions
Using Framer Motion's `AnimatePresence` with `mode="wait"`, the transitioning phases of `test-runner.tsx` must slide out horizontally and fade, avoiding abrupt page jumps:
- **`IDLE` to `DICTATION`**: Slide out left, slide in right.
- **`DICTATION` to `TRANSCRIPTION`**: Cross-fade (`opacity` 0 to 1, scale `0.98` to `1.0`).

### 3.2 Audio Dictation Visualization Component
Rather than hiding the audio player, replace the simple play indicator in the `DICTATION` stage with an interactive player card:
- **Audio Waveform Preview**: A stylized, pre-rendered waveform timeline bar showing progress.
- **Micro-animations**: A pulsing ring overlaying the play button that scales in rhythm with the playback state.
- **Speed Indicator Badge**: Interactive speed control (0.8x, 1.0x, 1.2x speeds) that slides out upon clicking.

### 3.3 The Transcription Area (Editor Panel)
- **Typing Space**: The textarea container must feature an active focus layout. When focused, the container border animates with a glowing violet ring (`ring-2 ring-primary/40`), and background opacity lightens from `bg-background/50` to `bg-background/80`.
- **Caret Indicator**: Typographical adjustments should include an extra wide leading (`leading-loose`) and mono font styles to make shorthand translation comparison readable.
- **Floating Heads-Up Display (HUD)**:
  - Positioned at the bottom margin of the screen, styled with glassmorphism (`bg-background/60 backdrop-blur-md border-t border-border/40`).
  - Contains a real-time word counter, current time-elapsed/time-remaining counter, and a shortcut help guide (e.g., `Esc` to pause, `Ctrl+Enter` to submit).

### 3.4 Test Result & Score Screen Overhaul
- **Performance Dials**: Replace static numeric displays with animated SVG circle dials:
  - Accuracy circle: Animates path length from `0` to `accuracy%` using `motion.circle` (`transition={{ duration: 1.2, ease: "easeOut" }}`).
  - Color-coding: The dial stroke color turns `oklch(success)` if accuracy >= 95%, `oklch(warning)` if between 90-95%, and `oklch(destructive)` if below 90%.
- **Error Analysis Legend & Transcription Diff**:
  - Code-editor style side-by-side diff overlay or inline error highlighter.
  - **Inline highlight rules**:
    - Missed/Omitted words: Highlighted in red with a strike-through background (`bg-destructive/10 text-destructive border-b-2 border-destructive/40`).
    - Incorrect spelling / Typo: Underlined with a wavy orange stroke (`underline decoration-wavy decoration-warning`).
    - Extra words added: Highlighted in violet with a dotted bottom border.

---

## 4. Spacing, Layout & Typography Guide

### 4.1 Typography Scale
Implement the following font weights and sizes to ensure structured text hierarchy:

| Tag/Component | Tailwind Utility Class | Font Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **Hero Title** | `text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight` | Extra Bold (800) | `leading-[1.1]` |
| **Section Header** | `text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight` | Bold (700) | `leading-tight` |
| **Card Header / Widget Title** | `text-lg md:text-xl font-semibold` | Semibold (600) | `leading-snug` |
| **Body Paragraph** | `text-base` | Regular (400) | `leading-relaxed` |
| **Subtext / Table metadata** | `text-sm` | Regular or Medium | `leading-normal` |
| **Micro Labels / Badges** | `text-xs uppercase tracking-wider font-semibold` | Semibold (600) | `leading-none` |

### 4.2 Spacing & Padding Scale
Maintain consistent breathing room:
- **Global Page Containers**: `px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto`
- **Section Margins (Vertical spacing)**: `py-16 md:py-24 lg:py-32` (on landing page sections)
- **Dashboard Sidebar/Layout padding**: Main workspace content utilizes `p-4 md:p-6 lg:p-8`
- **Component Padding Inside Cards**:
  - Standard cards: `p-6` (`--card-spacing: 1.5rem`)
  - Detail/dense tables: `p-4` (`--card-spacing: 1rem`)
  - Hero panels: `p-8 md:p-12`

---

## 5. Implementation Sequence & Guidelines
1. Update `app/globals.css` with the new color palette variables first to establish the foundation.
2. Polish the Landing Page components next, wrapping layout blocks inside the newly defined animation frames.
3. Overhaul the practice interface components (`test-runner.tsx` and `test-result.tsx`) to implement the state-based transitions and accuracy circular dials.
4. Finalize responsive testing and spacing/typography tweaks across mobile and desktop.
