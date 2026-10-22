# Rule 11: UI/UX & Design System Standards

## 🎨 1. Modern SaaS Aesthetic (Linear/Jira Design Language)

DevFlow must deliver a premium, state-of-the-art SaaS feel:

- **Theme & Color Palette:** Deep obsidian dark mode (`bg-slate-950` / `bg-zinc-900`) with high-contrast text (`text-slate-100` / `text-slate-400`), accented with sleek indigo/violet primary tones (`indigo-500`, `violet-500`).
- **Crisp Borders & Surfaces:** Use refined border contrast (`border-slate-800` / `border-slate-700/50`) rather than heavy drop shadows.
- **Micro-Interactions:** Subtle scale shifts on button clicks (`active:scale-[0.98]`), smooth card lifts on hover (`hover:-translate-y-0.5 transition-all duration-150`).

---

## 🏷️ 2. Status & Priority Visual Taxonomy

Use standardized color codes and badge styles:

### Priority Badges
- **URGENT:** Rose / Crimson badge (`bg-rose-500/10 text-rose-400 border-rose-500/20`) with Flame / Alert icon.
- **HIGH:** Amber / Orange badge (`bg-amber-500/10 text-amber-400 border-amber-500/20`) with Chevron Up.
- **MEDIUM:** Blue badge (`bg-sky-500/10 text-sky-400 border-sky-500/20`) with Equal icon.
- **LOW:** Slate / Muted badge (`bg-slate-500/10 text-slate-400 border-slate-500/20`) with Chevron Down.

### Status Columns
- **BACKLOG:** Muted slate column header with count indicator.
- **TODO:** Neutral indigo column header.
- **IN PROGRESS:** Amber / Yellow pulsating active indicator.
- **IN REVIEW:** Purple / Violet status indicator.
- **DONE:** Emerald / Green checkmark indicator.

---

## 🧩 3. Component States & Accessibility
- **Skeleton Screens:** Skeletons must match exact card dimensions to eliminate cumulative layout shift (CLS).
- **Empty States:** Include an illustrative icon, friendly explanation, and primary call-to-action button (e.g. "Create your first task").
- **Keyboard Navigation:** Escape key closes modals; keyboard arrow keys support Kanban card selection.
