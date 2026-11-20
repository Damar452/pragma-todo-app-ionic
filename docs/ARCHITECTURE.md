# Architecture

The app is organized **by feature** (the folder tree says "tasks" and "categories", not
"services" and "components"), with a light **hexagonal** split inside each feature and
**Atomic Design** for the UI. The layer rules below are enforced by
`eslint-plugin-boundaries` (see `eslint.config.js`), so a wrong import fails `npm run lint`.

## Folder layout

```
src/app/
├── core/                      App-wide singletons and ports/adapters (storage, feature flags, platform)
├── shared/
│   ├── ui/
│   │   ├── atoms/             Smallest domain-agnostic UI pieces (color-dot, badge)
│   │   ├── molecules/         Compositions of atoms (chip-selector, empty-state)
│   │   └── templates/         Page layouts with content projection
│   └── utils/                 Pure helpers (id generation, etc.)
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

## Path aliases

`@core/*`, `@shared/*` and `@features/*` map to `src/app/*` (see `tsconfig.json`). Use them
for cross-layer imports; relative imports are fine inside the same element.
