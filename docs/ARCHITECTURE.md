# Architecture

The app is organized **by feature** (the folder tree says "tasks" and "categories", not
"services" and "components"), with a light **hexagonal** split inside each feature and
**Atomic Design** for the UI. The layer rules below are enforced by
`eslint-plugin-boundaries` (see `eslint.config.js`), so a wrong import fails `npm run lint`.

## Folder layout

```
src/app/
├── core/                      App-wide singletons and ports/adapters (storage, feature flags, platform)
├── layout/                    App shell (tabs layout) around the routed features
├── shared/
│   ├── ui/
│   │   ├── atoms/             Smallest domain-agnostic UI pieces (color-dot, progress-ring, icon-badge, status-pill)
│   │   ├── molecules/         Compositions of atoms (chip-selector, progress-summary, section-header, empty-state)
│   │   └── templates/         Page layouts with content projection
│   └── utils/<topic>/         Global helper functions, one per file (number/clamp.ts, date/format-long-date.ts, ...)
└── features/
    └── <feature>/
        ├── domain/            Models and pure business rules. No Angular.
        ├── data/              Repositories: persistence behind an abstract contract
        ├── state/             Signal-based stores
        ├── ui/
        │   ├── organisms/     Domain-aware presentational components
        │   └── pages/         Routed containers: the only UI that injects state
        └── <feature>.routes.ts
```

Folders are created when the first file needs them; empty layers are not kept around.

## Layer rules

| From         | May import                                                          |
| ------------ | ------------------------------------------------------------------- |
| `core`       | core, shared/utils                                                  |
| `layout`     | core, atoms, molecules, templates, shared/utils                     |
| `atoms`      | atoms, shared/utils                                                 |
| `molecules`  | atoms, molecules, shared/utils                                      |
| `templates`  | atoms, molecules, templates, shared/utils                           |
| `domain`     | its own feature's domain, shared/utils                              |
| `data`       | its own feature's domain and data, core, shared/utils               |
| `state`      | its own feature's domain and data, any feature's state, core, utils |
| `organisms`  | any feature's domain, atoms, molecules, own organisms, utils        |
| `pages`      | everything above except other features' organisms                   |

Key ideas behind them:

- **`shared` never imports `features`.** Shared UI is domain-agnostic and reusable.
- **Ionic components are the atoms' building blocks.** We do not wrap `ion-button` in an
  `app-button` that only forwards inputs.
- **Container / presentational.** Pages inject stores; atoms through organisms only use
  `input()` / `output()` with `OnPush`.
- **Domain stays pure.** Business rules are plain functions, testable without TestBed.

## Code conventions

1. **No magic strings or numbers in classes.** Components, pages, services and stores take them
   from a `<name>.constants.ts` file in the owner's folder (`UPPER_SNAKE_CASE`, `as const` when useful).
   Numeric/config template bindings (`[size]`, `[breakpoints]`) come from a component property
   fed by those constants. Only Angular metadata, import paths, SCSS and markup-only template
   attributes (`slot="start"`, `fill="clear"`) stay inline.
2. **Enums, types, interfaces and classes never live in a component or page file.** Enum-like
   values are an `as const` object plus a derived union type in `<name>.enums.ts`; interfaces and
   types go in `<name>.models.ts` next to the owner. Domain models stay in `domain/`.
3. **Transversal helpers are global functions**, one per file, in `shared/utils/<topic>/<fn-name>.ts`
   with a spec each. Feature-specific pure logic (filtering tasks, counting stats) lives in that
   feature's `domain/` as pure functions with specs; pages only call them inside `computed()`.
4. **No `switch/case`.** Use lookup tables keyed by the enum values (`TaskFilterHandlers` +
   `matchTaskFilter`), `Map`s or ordered rule arrays (`progress-summary.headline.ts`).

File naming: `*.constants.ts`, `*.enums.ts`, `*.models.ts`, `shared/utils/<topic>/<fn>.ts`
(plus `<fn>.spec.ts`).

## Path aliases

`@core/*`, `@shared/*` and `@features/*` map to `src/app/*` (see `tsconfig.json`). Use them
for cross-layer imports; relative imports are fine inside the same element.

## Visual language

Design tokens live in `src/theme/variables.scss` as CSS custom properties (`--app-*` for the
app, `--ion-*` mapped onto Ionic), with a light and a dark set. Components consume the tokens
(`--app-surface`, `--app-radius-lg`, ...) and never hard-code colors. The typeface (Lexend Deca)
is self-hosted through `@fontsource-variable/lexend-deca`, so it works offline.

### Sheet modals

Form modals use `class="auto-sheet"` with breakpoints `[0, 1]` and initial breakpoint `1` (exposed by the page from its `*.page.constants.ts`).
The rules in `src/global.scss` (`--height: auto`, relative `.ion-page`) make the sheet fit its
content. Put the content directly in the modal (no `ion-content`), or the height collapses.

## Internationalization

All user-facing copy lives in `src/assets/i18n/<lang>.json` (today only `es.json`), served as an
asset and loaded over HTTP by `TranslocoHttpLoader` (`src/app/core/i18n/`). The URL is relative
(`assets/i18n/es.json`) so it also resolves inside Cordova's WebView. `provideI18n()` (called in
`main.ts`) wires Transloco, ICU plurals (`@jsverse/transloco-messageformat`), `LOCALE_ID` and an
app initializer that preloads the default language, so the first render never shows raw keys.

- **Keys** are nested by area: `app.*` (tabs), `shared.*` (copy owned by shared molecules),
  `tasks.*` and `categories.*` (pages, organisms, `form.*`, `actions.*` for labels and aria).
- **Atoms stay input-driven**: they receive already-translated text. Molecules with intrinsic copy
  (progress summary, color picker) use `shared.*`; organisms and pages use their feature's keys.
- **Templates** use `| transloco` (with params: `'key' | transloco: { count }`); component code
  uses `translateSignal(key, params)`. Plurals use ICU: `{count, plural, =0 {...} one {# ...} other {# ...}}`.
- **Specs** get the real `es.json` through `provideTranslocoTesting()` (`src/testing/`), registered
  globally in `src/test-setup.ts`, so assertions check the Spanish copy users see.

To add a language (e.g. `en`): create `src/assets/i18n/en.json` with the same keys, add `'en'` to
`AVAILABLE_LANGS` in `provide-i18n.ts` and register its Angular locale data. No component changes.
