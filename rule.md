# Nx Angular Micro Frontend Workspace: Navigation & Documentation Rules

## 1. Navigating and Exploring Apps & Libraries

- Start at the root `apps/` and `libs/` folders.
- Each subfolder in `apps/` is a distinct micro frontend; inspect its `src/`, `project.json`, and `webpack.config.js` for entry points and federation setup.
- Libraries in `libs/` are shared code; review their `src/` for reusable modules, services, and components.
- Use Nx CLI (`nx list`, `nx graph`) to visualize dependencies and relationships.

## 2. Identifying Shared Modules, Services, and UI Components

- Look for libraries in `libs/` that are imported in multiple apps.
- Shared Angular modules/services are typically exported in `libs/<lib>/src/index.ts`.
- UI components intended for reuse should be documented and exported from shared libraries.
- Automated tools should flag any duplicate code across apps and suggest refactoring into a shared library.

## 3. Recognizing Communication and Data Flow Patterns

- Inspect each app’s `webpack.config.js` for `exposes` and `remotes` to understand federation boundaries.
- Data flow between MFEs is often handled via input/output bindings, shared services, or custom events.
- Document how MFEs load remote components (e.g., via configuration objects and loader services).
- Automated tools should trace remote module usage and visualize runtime integration points.

## 4. Detecting Cross-Cutting Concerns

- Search for authentication, logging, and observability logic in both apps and shared libraries.
- Centralize cross-cutting concerns in dedicated libraries (e.g., `libs/auth`, `libs/logging`).
- Document where and how these concerns are injected or consumed in each app.
- Automated tools should highlight any cross-cutting logic duplicated across apps and recommend centralization.

## 5. Suggesting Improvements and Architectural Refactors

- Prefer code sharing via libraries over duplication in apps.
- Ensure all shared dependencies (Angular core, RxJS, etc.) are configured as singletons in module federation.
- Regularly review and update federation configs to avoid stale or unused exposes/remotes.
- Recommend splitting large libraries into smaller, focused ones for maintainability.
- Automated tools should check for circular dependencies, unused code, and opportunities to extract common logic.

## 6. Documentation Consistency

- All apps and libraries should have a README or documentation section describing their purpose and integration points.
- Document federation setup, shared modules, and cross-cutting concerns in a central `DESIGN.md`.
- Automated tools should validate the presence and freshness of documentation for each workspace element.

---

These rules help anyone—developer or tool—quickly understand, reason about, and maintain the workspace design. They support scalable, maintainable architecture and enable automated generation of consistent design documentation.
