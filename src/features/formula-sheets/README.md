# EduBuddy Feature 09: Formula Sheets Reference Library

A structured, searchable, and interactive formula reference library for secondary and senior-secondary students (Classes 9–12), covering **Mathematics**, **Physics**, and **Chemistry**.

---

## Architecture & Design Principles

- **Isolated & Non-Invasive**: Built strictly inside `src/features/formula-sheets/`. Does not modify `src/App.tsx`, `src/styles.css`, `server.ts`, the global `Store`, or gamification.
- **Zero New Dependencies**: Uses existing React 18, TypeScript, and Lucide icons. Mathematical typesetting is safely rendered using structured HTML/CSS typography (vertical fractions, superscripts, subscripts, radicals, and Greek characters) with full LaTeX copy support.
- **Dedicated Persistence**: Pinned/favorite formulas are saved in an isolated feature-level localStorage key (`edubuddy_formula_favorites_v1`).
- **Responsive & Dark Mode**: Styled using scoped CSS variables with support for both light mode and `html[data-theme="dark"]`.

---

## Directory Structure

```
src/features/formula-sheets/
├── types.ts                    # Core TypeScript definitions (Formula, Variable, Example, Props)
├── data/
│   ├── index.ts                # Master registry, subject metadata, and category query utilities
│   ├── mathematics.ts          # 14 Class 9–12 Mathematics formulas
│   ├── physics.ts              # 13 Class 9–12 Physics formulas
│   └── chemistry.ts            # 10 Class 9–12 Chemistry formulas
├── components/
│   ├── MathRenderer.tsx        # High-legibility math expression renderer with copy actions
│   ├── FormulaCard.tsx         # Responsive card with math preview, variable chips, and badges
│   ├── FormulaDetailModal.tsx  # Modal deep-dive with variable SI units, assumptions, and worked examples
│   ├── FormulaFilters.tsx      # Subject tabs, Class dropdown, Topic chips, Search, and Pinned filter
│   └── EmptyState.tsx          # Contextual empty state with search suggestions
├── hooks/
│   └── useFormulaSheets.ts     # Multi-parameter filter engine & isolated favorites storage
├── FormulaSheets.css           # Self-contained scoped styles with dark mode and math typesetting
├── FormulaSheetsPage.tsx       # Main feature page component
├── index.ts                    # Public API exports
└── README.md                   # Feature documentation & integration guide
```

---

## Integration Interface

When ready to integrate into the main EduBuddy application shell, import `FormulaSheetsPage`:

```tsx
import { FormulaSheetsPage } from './features/formula-sheets';

// Inside App.tsx or your routing system:
<FormulaSheetsPage
  initialGrade={profile?.grade}          // e.g. "Class 10" (pre-filters by student class)
  initialSubject={currentSubject}        // e.g. "Physics" (pre-selects subject tab)
  onNavigateTopic={(topic, subject) => { // Optional hand-off to Notes / Learn mode
    setTopic(topic);
    if (subject) setSubject(subject);
    openPage('learn');
  }}
  onNavigateQuiz={(topic) => {           // Optional hand-off to Practice Quizzes
    setQuizTopic(topic);
    openPage('practice');
  }}
/>
```

### Component Props (`FormulaSheetsProps`)

| Prop | Type | Default | Description |
|---|---|---|---|
| `initialGrade` | `string` | `'all'` | Initial class level to preselect (e.g. `'Class 10'`). |
| `initialSubject` | `string` | `'all'` | Initial subject tab to activate (`'mathematics'`, `'physics'`, `'chemistry'`). |
| `onNavigateTopic` | `(topic: string, subject?: string) => void` | `undefined` | Callback invoked when user clicks "Study" or "Learn" for a formula's chapter. |
| `onNavigateQuiz` | `(topic: string) => void` | `undefined` | Callback invoked when user clicks "Practice Questions" for a formula's chapter. |
| `title` | `string` | `'Formula Sheets & Reference Library'` | Header title text. |
| `subtitle` | `string` | `'Master key formulas across...'` | Header subtitle text. |

---

## Initial Formula Dataset Overview

Contains **37 comprehensive, verified curriculum formulas**:

1. **Mathematics (14 formulas)**:
   - *Quadratic Formula* ($x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$)
   - *Discriminant & Nature of Roots* ($\Delta = b^2 - 4ac$)
   - *Arithmetic Progression $n$-th Term* ($a_n = a + (n-1)d$)
   - *Arithmetic Progression Sum* ($S_n = \frac{n}{2}[2a + (n-1)d]$)
   - *Distance Formula in 2D Plane* ($d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$)
   - *Section Formula for Internal Division* ($P = \frac{m_1 x_2 + m_2 x_1}{m_1 + m_2}$)
   - *Fundamental Trigonometric Identities* ($\sin^2\theta + \cos^2\theta = 1$)
   - *Compound Angle Formulas* ($\sin(A \pm B), \cos(A \pm B)$)
   - *Heron's Formula for Scalene Triangles* ($A = \sqrt{s(s-a)(s-b)(s-c)}$)
   - *Binomial Theorem Expansion* ($(a+b)^n = \sum \binom{n}{k} a^{n-k} b^k$)
   - *Derivative Rules (Power, Product, Chain)*
   - *Integration by Parts* ($\int u \, dv = uv - \int v \, du$)
   - *Bayes' Theorem of Conditional Probability*
   - *Vector Dot & Cross Products*

2. **Physics (13 formulas)**:
   - *Kinematic Equations of Motion* ($v = u + at, s = ut + \frac{1}{2}at^2, v^2 = u^2 + 2as$)
   - *Newton's Second Law of Motion* ($F_{\text{net}} = ma = \frac{dp}{dt}$)
   - *Newton's Law of Universal Gravitation* ($F = G \frac{m_1 m_2}{r^2}$)
   - *Work-Energy Theorem & Kinetic Energy* ($K = \frac{1}{2}mv^2, W_{\text{net}} = \Delta K$)
   - *Time Period of a Simple Pendulum* ($T = 2\pi\sqrt{\frac{L}{g}}$)
   - *Ohm's Law & Electric Power* ($V = IR, P = VI = I^2R$)
   - *Resistance, Length, Area and Resistivity* ($R = \rho \frac{L}{A}$)
   - *Coulomb's Law of Electrostatics* ($F = \frac{1}{4\pi\varepsilon_0}\frac{|q_1 q_2|}{r^2}$)
   - *Capacitance of a Parallel Plate Capacitor* ($C = \frac{\varepsilon_0 A}{d}$)
   - *Mirror and Thin Lens Equations with Magnification*
   - *Snell's Law of Refraction* ($n_1 \sin\theta_1 = n_2 \sin\theta_2$)
   - *Einstein's Photoelectric Equation* ($h\nu = \phi + K_{\max}$)
   - *De Broglie Matter Wave Equation* ($\lambda = \frac{h}{p}$)

3. **Chemistry (10 formulas)**:
   - *The Mole Concept & Avogadro Relations* ($n = \frac{m}{M} = \frac{N}{N_A} = \frac{V}{22.4\,\text{L}}$)
   - *Molarity & Molality of Solutions* ($M = \frac{n}{V}, m = \frac{n}{w_{\text{kg}}}$)
   - *Ideal Gas Equation* ($PV = nRT = \frac{\rho RT}{M}$)
   - *pH, pOH & Ionic Product of Water* ($\text{pH} = -\log[\text{H}^+], \text{pH}+\text{pOH}=14$)
   - *First Law of Thermodynamics* ($\Delta U = q + w$)
   - *Gibbs Free Energy & Spontaneity* ($\Delta G = \Delta H - T\Delta S$)
   - *Arrhenius Equation for Reaction Rates* ($k = A e^{-E_a/RT}$)
   - *First-Order Reaction Rate & Half-Life* ($t_{1/2} = \frac{0.693}{k}$)
   - *Nernst Equation for Electrochemical Cells* ($E = E^\circ - \frac{0.0591}{n}\log Q$)
   - *Raoult's Law & Colligative Properties* ($\frac{\Delta P}{P^\circ} = x_2$)

---

## Validation & Verification

- **TypeScript Compatibility**: Strict type check with `tsc --noEmit` and `tsc -p tsconfig.server.json --noEmit`.
- **Production Build**: Passes `vite build` without errors or bundle warnings.
- **Mathematical Accuracy**: Every expression verified against standard NCERT / CBSE Class 9–12 physics, chemistry, and mathematics textbooks.
- **Copy Verification**: Both visual plain text and standard LaTeX representations provided and verified.
