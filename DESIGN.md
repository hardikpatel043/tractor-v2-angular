# DESIGN.md

## Overview

This Nx workspace is architected to support multiple Angular micro frontends (MFEs) using module federation. The workspace leverages Nx for monorepo management, Angular for application development, and @angular-architects/module-federation for dynamic integration of MFEs. The design enables independent development, deployment, and scaling of each micro frontend while sharing code and UI components via libraries.

## Architecture

- **Monorepo Structure**: Nx organizes all applications and libraries in a single repository, enabling code sharing and unified tooling.
- **Micro Frontends**: Each app in `apps/` (e.g., `checkout`, `decide`, `explore`, `tractor-store-angular`) is a standalone Angular application, configured for module federation.
- **Module Federation**: MFEs expose and consume modules/components using webpack's module federation, managed via `@angular-architects/module-federation`.
- **Shared Libraries**: Common code (utilities, loaders, etc.) is placed in `libs/` (e.g., `load-mfe`, `utils`) and shared across MFEs.

## Folder Structure

```
tractor-v2-angular/
├── apps/
│   ├── checkout/
│   ├── decide/
│   ├── explore/
│   └── tractor-store-angular/
├── libs/
│   ├── load-mfe/
│   └── utils/
├── package.json
├── nx.json
├── tsconfig.base.json
└── ...
```

- **apps/**: Contains individual Angular MFEs, each with its own source, config, and webpack federation setup.
- **libs/**: Contains shared libraries for utilities and MFE loading logic.

## Key Modules & Libraries

- **@angular-architects/module-federation**: Enables dynamic loading and sharing of Angular modules/components between MFEs.
- **@nx/angular, @nx/web, @nx/eslint, @nx/jest**: Nx plugins for Angular, web, linting, and testing.
- **libs/load-mfe**: Provides services and components for loading remote MFEs at runtime.
- **libs/utils**: General-purpose utilities shared across apps.

## Micro Frontend Integration

- **Exposing Modules**: Each MFE exposes routes/components via its `webpack.config.js` (see below).
- **Consuming Remotes**: MFEs dynamically load remote modules using configuration objects and the loader service from `libs/load-mfe`.
- **Shared Dependencies**: All Angular core packages and other dependencies are shared as singletons to avoid duplication and version conflicts.

### Example: Module Federation Config (apps/explore/webpack.config.js)

```js
module.exports = withModuleFederationPlugin({
  name: 'explore',
  exposes: {
    './Routes': 'apps/explore/src/app/entry.routes.ts',
    './Header': 'apps/explore/src/app/header/header.component.ts',
    './Footer': 'apps/explore/src/app/footer/footer.component.ts',
    './Recommendations': 'apps/explore/src/app/recommendations/recommendations.component.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### Example: Consuming Remote Components (Angular)

```ts
const headerConfig = {
  REMOTE_URL: 'http://localhost:4202/remoteEntry.js',
  EXPOSED_MODULE: './Header',
  MODULE_NAME: 'HeaderComponent',
};
```

## Communication Between MFEs

- **Routing**: Each MFE manages its own routes and can expose them for consumption by other MFEs.
- **Shared State**: Shared libraries (e.g., `utils`) can provide state management or utility functions.
- **Events/Data**: MFEs communicate via input/output bindings, shared services, or custom events if needed.

## Design Decisions

- **Module Federation**: Chosen for its ability to load remote modules at runtime, enabling true micro frontend architecture.
- **Nx Monorepo**: Facilitates code sharing, unified tooling, and scalable development.
- **Shared Libraries**: Reduces duplication and centralizes common logic.
- **Singleton Shared Dependencies**: Prevents multiple instances of Angular core packages, avoiding runtime errors.

## Build & Serve

- Each app can be built and served independently using Nx commands (`nx build <app>`, `nx serve <app>`).
- The workspace supports running all builds/tests/lints together via `nx run-many`.

## Extending the Workspace

- Add new MFEs by creating a new app in `apps/` and configuring module federation.
- Share new utilities or components by adding to `libs/`.
- Integrate new MFEs by updating federation configs and loader logic.

## References

- [Nx Documentation](https://nx.dev/angular)
- [Angular Module Federation](https://www.angulararchitects.io/en/module-federation/)

---

This document provides a high-level overview. For implementation details, refer to individual app and library folders.
