# Nx Angular Microfrontend Workspace - Architectural Rules

## Overview

This document provides comprehensive rules for navigating, understanding, and maintaining the Nx workspace containing multiple Angular microfrontends using Module Federation. These rules support both human developers and automated documentation tools.

## 🏗️ Workspace Structure Rules

### Rule 1: Directory Organization Pattern
```
workspace-root/
├── apps/                    # Application containers
│   ├── {shell-app}/        # Host/Shell application
│   └── {remote-app}/       # Remote microfrontend applications
├── libs/                   # Shared libraries
│   ├── {domain-lib}/       # Domain-specific shared code
│   └── {utility-lib}/      # Cross-cutting utilities
├── nx.json                 # Nx workspace configuration
├── package.json            # Root dependencies
└── tsconfig.base.json      # TypeScript path mappings
```

**Navigation Rule**: Always start exploration from `apps/` for business logic and `libs/` for shared functionality.

### Rule 2: Application Identification Pattern
- **Shell Application**: Contains `webpack.config.js` with `exposes` but minimal exposed modules
- **Remote Applications**: Contains `webpack.config.js` with multiple `exposes` entries
- **Shared Libraries**: Located in `libs/` with `project.json` but no `webpack.config.js`

## 🔌 Module Federation Rules

### Rule 3: Module Federation Configuration Pattern
Each microfrontend must follow this webpack configuration structure:
```javascript
module.exports = withModuleFederationPlugin({
  name: '{app-name}',
  exposes: {
    './Routes': 'path/to/routes',
    './Component': 'path/to/component',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

**Detection Rule**: Look for `webpack.config.js` files to identify Module Federation boundaries.

### Rule 4: Exposed Module Naming Convention
- `./Routes` - Main routing configuration (required for all remotes)
- `./Component` - Standalone components for cross-MFE usage
- `./{FeatureName}` - Feature-specific exports (e.g., `./miniCart`, `./addToCart`)

**Pattern Recognition**: Exposed modules starting with uppercase are components, lowercase are features/services.

## 🛣️ Routing and Navigation Rules

### Rule 5: Shell Application Routing Pattern
Shell applications use lazy loading with `loadRemoteModule`:
```typescript
{
  path: '{route-name}',
  loadChildren: () =>
    loadRemoteModule({
      type: 'manifest',
      remoteName: '{remote-name}',
      exposedModule: './Routes',
    }).then((m) => m.remoteRoutes),
}
```

**Navigation Rule**: Follow the path from shell routes → remote routes → feature components.

### Rule 6: Remote Application Route Exposure
Remote applications must export routes as `remoteRoutes`:
```typescript
export const remoteRoutes: Routes = [
  // Route definitions
];
```

## 📦 Shared Libraries Rules

### Rule 7: Shared Library Categories
1. **Technical Libraries** (`load-mfe`, `utils`): Cross-cutting technical concerns
2. **Domain Libraries**: Business domain shared code
3. **UI Libraries**: Shared UI components and design system

**Identification Rule**: Check `libs/` directory structure and `project.json` files for library categorization.

### Rule 8: Dynamic Component Loading Pattern
Use the `LoadRemoteComponentService` for runtime component loading:
```typescript
loadAndCreateRemoteComponent(
  viewContainer: ViewContainerRef,
  remoteEntry: string,
  exposedModule: string,
  moduleName: string
)
```

## 🔄 Communication Patterns Rules

### Rule 9: Inter-MFE Communication Patterns
1. **Event-Driven Communication**: Use `window.dispatchEvent` and `window.addEventListener`
   ```typescript
   // Dispatch
   window.dispatchEvent(new CustomEvent('add-to-cart', { detail: { sku } }));
   
   // Listen
   window.addEventListener('add-to-cart', (event) => { /* handle */ });
   ```

2. **Shared Services**: Use `providedIn: 'root'` for cross-MFE services
3. **Route-based Communication**: Pass data through URL parameters and query strings

**Detection Rule**: Look for `window.dispatchEvent`, `window.addEventListener`, and `@Injectable({ providedIn: 'root' })` patterns.

### Rule 10: State Management Pattern
- **Local State**: Angular signals within individual MFEs
- **Shared State**: Event-driven updates with `window` events
- **Persistent State**: Browser storage APIs (localStorage, sessionStorage)

## 🔍 Cross-Cutting Concerns Rules

### Rule 11: Service Identification Patterns
- **Data Services**: Named `*.service.ts`, contain business data and API calls
- **Store Services**: Named `store.service.ts`, manage application state
- **Utility Services**: Located in `libs/`, provide cross-cutting functionality

### Rule 12: Dependency Injection Scope Rules
- `providedIn: 'root'` → Singleton across entire application (including MFEs)
- `providedIn: 'platform'` → Shared across all applications in the platform
- Component-level → Scoped to specific component tree

## 🎯 Business Domain Rules

### Rule 13: Domain Boundary Identification
Each microfrontend represents a distinct business domain:
- **explore**: Product discovery and catalog browsing
- **decide**: Product comparison and decision support
- **checkout**: Shopping cart and purchase flow
- **shell**: Navigation orchestration and shared layout

**Pattern Recognition**: Domain boundaries align with user journey stages.

### Rule 14: Data Service Patterns
Each MFE contains its own `data.service.ts` with domain-specific data:
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  data = {
    // Domain-specific data structure
  };
}
```

## 🔧 Development and Maintenance Rules

### Rule 15: Port Assignment Convention
- Shell Application: Default port (4200)
- Remote Applications: Sequential ports (4201, 4202, 4203, ...)
- Development Server: Use `run:all` script for multi-MFE development

### Rule 16: Build and Deployment Patterns
- Each MFE can be built and deployed independently
- Shell application orchestrates runtime loading
- Shared libraries are bundled with consuming applications

### Rule 17: Testing Strategy Rules
- **Unit Tests**: Jest configuration in each `project.json`
- **Integration Tests**: Test MFE communication patterns
- **E2E Tests**: Test complete user journeys across MFEs

## 📋 Code Quality and Standards Rules

### Rule 18: TypeScript Configuration
- `tsconfig.base.json`: Defines path mappings for shared libraries
- Each app/lib has its own `tsconfig.json` extending the base
- Path mappings follow pattern: `@workspace/lib-name`

### Rule 19: Linting and Formatting
- ESLint configuration in `eslint.config.mjs`
- Prettier configuration in `.prettierrc`
- Angular-specific linting rules via `angular-eslint`

### Rule 20: Dependency Management
- Root `package.json`: Shared dependencies and scripts
- Individual `project.json`: Project-specific build configurations
- Module Federation handles runtime dependency sharing

## 🚀 Scalability and Performance Rules

### Rule 21: Bundle Optimization
- Shared dependencies configured in Module Federation
- Lazy loading for all remote modules
- Tree-shaking enabled for unused code elimination

### Rule 22: Runtime Performance
- Components loaded on-demand via `loadRemoteModule`
- Singleton pattern for shared services prevents duplication
- Event-driven communication minimizes tight coupling

## 🔍 Automated Documentation Rules

### Rule 23: Documentation Generation Patterns
- **Architecture Diagrams**: Generate from `webpack.config.js` exposed modules
- **API Documentation**: Extract from `@Injectable` services and their methods
- **Route Maps**: Build from shell and remote route configurations
- **Dependency Graphs**: Analyze import statements and Module Federation configs

### Rule 24: Metrics and Analysis
- **Bundle Size Analysis**: Monitor webpack bundle analyzer outputs
- **Dependency Tracking**: Map shared library usage across MFEs
- **Communication Flow**: Trace event dispatching and listening patterns
- **Performance Monitoring**: Track lazy loading and module federation overhead

## 🛠️ Refactoring Guidelines

### Rule 25: Safe Refactoring Patterns
1. **Module Extraction**: Move shared code to `libs/` with proper exports
2. **MFE Splitting**: Create new remote when domain boundaries are clear
3. **Service Consolidation**: Merge similar services while maintaining injection scopes
4. **Route Restructuring**: Update both shell and remote route configurations

### Rule 26: Breaking Change Prevention
- Maintain backward compatibility in exposed module interfaces
- Use semantic versioning for shared library changes
- Test cross-MFE integration after any architectural changes
- Document API changes in shared services

## 🎯 Quick Reference Commands

### Navigation Commands
```bash
# Explore workspace structure
find . -name "webpack.config.js" -type f
find . -name "project.json" -type f
find . -name "*.service.ts" -type f

# Analyze dependencies
grep -r "loadRemoteModule" --include="*.ts"
grep -r "@Injectable" --include="*.ts"
grep -r "window.dispatchEvent" --include="*.ts"
```

### Development Commands
```bash
# Start all MFEs
npm run run:all

# Build specific MFE
nx build {app-name}

# Test specific MFE
nx test {app-name}

# Lint workspace
nx run-many --target=lint --all
```

---

## Summary

These architectural rules provide a comprehensive framework for understanding, navigating, and maintaining the Nx Angular microfrontend workspace. They support both human developers in quickly grasping the system architecture and automated tools in generating consistent, high-quality documentation and analysis.

The rules emphasize the Module Federation pattern, event-driven communication, clear domain boundaries, and scalable development practices that maintain the workspace's modularity and maintainability as it grows.
