# Nx Angular Micro Frontend Workspace Analysis Rules

## Overview

This document provides comprehensive rules for analyzing, navigating, and understanding Nx workspaces containing Angular micro frontends using Module Federation. These rules support both manual inspection and automated tooling for documentation generation.

## Table of Contents

1. [Workspace Navigation Rules](#workspace-navigation-rules)
2. [Shared Module Identification Rules](#shared-module-identification-rules)
3. [Communication Pattern Recognition Rules](#communication-pattern-recognition-rules)
4. [Cross-Cutting Concerns Detection Rules](#cross-cutting-concerns-detection-rules)
5. [Architectural Assessment Rules](#architectural-assessment-rules)
6. [Automation Support Rules](#automation-support-rules)

---

## Workspace Navigation Rules

### Rule 1: Apps Directory Structure Analysis

**Purpose**: Identify and categorize micro frontend applications

**Detection Pattern**:
```
apps/
├── [mfe-name]/           # Individual micro frontend
│   ├── webpack.config.js # Module Federation config
│   ├── src/app/
│   │   ├── entry.routes.ts    # Exposed routes
│   │   └── [domain-components]/ # Domain-specific features
│   └── project.json      # Nx project configuration
└── [shell-name]/         # Shell/Host application
    ├── webpack.config.js # Federation consumer config
    ├── src/app/
    │   └── app.routes.ts # Route integration
    └── public/
        └── module-federation.manifest.json # MFE registry
```

**Analysis Steps**:
1. **Identify Shell Application**: Look for the main app with module federation manifest
2. **Catalog MFE Applications**: Apps with `webpack.config.js` containing `exposes` configuration
3. **Map Domain Boundaries**: Analyze app names and folder structures for business domain alignment
4. **Port Configuration**: Extract port assignments from project.json or documentation

**Expected Findings**:
- Shell application (orchestrator): `tractor-store-angular` (Port 4200)
- Domain MFEs: `explore` (Port 4202), `decide` (Port 4203), `checkout` (Port 4201)
- Domain alignment: Business capability-based splitting

### Rule 2: Libs Directory Assessment

**Purpose**: Identify shared infrastructure and utilities

**Detection Pattern**:
```
libs/
├── [shared-lib]/
│   ├── src/
│   │   ├── index.ts      # Public API exports
│   │   └── lib/          # Implementation
│   ├── README.md         # Library documentation
│   └── project.json      # Build configuration
```

**Analysis Steps**:
1. **Infrastructure Libraries**: Libraries providing MFE loading capabilities
2. **Utility Libraries**: Shared functions and helpers
3. **Component Libraries**: Reusable UI components (if present)
4. **Service Libraries**: Shared business logic (if present)

**Expected Findings**:
- `load-mfe`: MFE dynamic loading infrastructure
- `utils`: Shared utility functions (image handling, formatting)
- Minimal shared libraries (architectural principle of independence)

### Rule 3: TypeScript Path Mapping Analysis

**Purpose**: Understand module resolution and dependencies

**Detection Pattern** in `tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@workspace-name/[lib-name]": ["libs/[lib-name]/src/index.ts"]
    }
  }
}
```

**Analysis Steps**:
1. Extract all path mappings
2. Identify shared library imports
3. Map dependency relationships
4. Verify consistent naming conventions

---

## Shared Module Identification Rules

### Rule 4: Module Federation Configuration Analysis

**Purpose**: Identify exposed and consumed modules

**Detection Pattern** in `webpack.config.js`:
```javascript
module.exports = withModuleFederationPlugin({
  name: 'mfe-name',
  exposes: {
    './Routes': 'path/to/entry.routes.ts',
    './ComponentName': 'path/to/component.ts',
  },
  shared: { /* shared dependencies */ }
});
```

**Analysis Steps**:
1. **Extract Exposed Modules**: Parse `exposes` configuration
2. **Categorize Exports**: Routes vs Components vs Services
3. **Shared Dependencies**: Analyze `shared` configuration
4. **Naming Conventions**: Verify consistent module naming

**Classification Matrix**:
| Export Type | Pattern | Example | Purpose |
|-------------|---------|---------|---------|
| Routes | `./Routes` | Entry point routing | Full page integration |
| Components | `./ComponentName` | Specific component | Widget integration |
| Services | `./ServiceName` | Business logic | Data/state sharing |

### Rule 5: Shared Library Analysis

**Purpose**: Identify infrastructure and utility sharing patterns

**Detection Pattern**:
```typescript
// In libs/[lib-name]/src/index.ts
export * from './lib/[module-name]';

// Usage in apps
import { UtilityFunction } from '@workspace-name/lib-name';
```

**Analysis Categories**:
1. **Infrastructure Libraries**: MFE loading, routing utilities
2. **Utility Libraries**: Formatting, validation, helpers
3. **UI Component Libraries**: Shared design system components
4. **Data Libraries**: Shared models, interfaces, constants

### Rule 6: Component Sharing Patterns

**Purpose**: Understand component reuse across MFEs

**Detection Patterns**:
```typescript
// Cross-MFE component loading
const componentConfig = {
  REMOTE_URL: 'http://localhost:PORT/remoteEntry.js',
  EXPOSED_MODULE: './ComponentName',
  MODULE_NAME: 'ComponentClass',
};

// Dynamic loading service usage
loadRemoteComponent(viewContainer, config.REMOTE_URL, config.EXPOSED_MODULE, config.MODULE_NAME)
```

**Analysis Steps**:
1. **Find Dynamic Loading**: Search for `LoadRemoteComponentService` usage
2. **Map Component Dependencies**: Track which MFEs consume which components
3. **Identify Shared UI Elements**: Common headers, footers, navigation
4. **Document Component Contracts**: Input/output interfaces

---

## Communication Pattern Recognition Rules

### Rule 7: Event-Driven Communication Detection

**Purpose**: Identify cross-MFE communication mechanisms

**Detection Pattern**:
```typescript
// Event dispatching
window.dispatchEvent(new CustomEvent('event-name', { detail: data }));

// Event listening
window.addEventListener('event-name', (event) => {
  const data = (event as any).detail;
  // Handle event
});
```

**Analysis Steps**:
1. **Search for Custom Events**: Grep for `CustomEvent`, `dispatchEvent`, `addEventListener`
2. **Map Event Flow**: Publisher → Event → Subscriber relationships
3. **Document Event Contracts**: Event names, payload structures
4. **Identify Event Categories**: State synchronization, user actions, system events

**Common Event Patterns**:
| Event Type | Pattern | Purpose | Example |
|------------|---------|---------|---------|
| State Sync | `updated-[entity]` | Notify state changes | `updated-cart` |
| User Actions | `[action]-[entity]` | Trigger operations | `add-to-cart` |
| System Events | `[system]-[event]` | System notifications | `mfe-loaded` |

### Rule 8: State Management Pattern Analysis

**Purpose**: Understand state management and synchronization

**Detection Pattern**:
```typescript
// Angular Signals usage
export class ServiceName {
  state = signal<DataType>([]);
  
  // Effect for cross-MFE synchronization
  effect(() => {
    window.addEventListener('event-name', handler);
    return () => window.removeEventListener('event-name', handler);
  });
}
```

**Analysis Steps**:
1. **Identify State Services**: Services with `signal()` usage
2. **Map State Synchronization**: Effects listening to custom events
3. **Document State Flow**: Local state → Events → Remote state updates
4. **Analyze State Isolation**: Verify MFE state independence

### Rule 9: Data Flow Pattern Recognition

**Purpose**: Understand data sharing and consistency

**Detection Patterns**:
```typescript
// Data service patterns
export class DataService {
  data = { /* static or dynamic data */ };
  
  // API integration
  loadData(): Observable<DataType> { /* implementation */ }
}

// Cross-MFE data access
const dataFromMFE = this.mfeDataService.getData();
```

**Analysis Steps**:
1. **Identify Data Sources**: Services providing data
2. **Map Data Dependencies**: Which MFEs depend on which data
3. **Document Data Contracts**: Interface definitions, data structures
4. **Analyze Data Consistency**: How data synchronization is maintained

---

## Cross-Cutting Concerns Detection Rules

### Rule 10: Authentication & Authorization Detection

**Purpose**: Identify security implementation patterns

**Detection Checklist**:
- [ ] Authentication service in shared libraries
- [ ] Route guards for protected routes
- [ ] Token management across MFEs
- [ ] User context sharing patterns

**Search Patterns**:
```bash
# Look for auth-related files and patterns
grep -r "auth\|Auth\|login\|token\|guard" apps/ libs/
grep -r "CanActivate\|@Injectable.*guard" apps/ libs/
```

### Rule 11: Error Handling & Resilience Detection

**Purpose**: Identify error handling and fault tolerance patterns

**Detection Patterns**:
```typescript
// MFE loading error handling
.catch((error) => {
  observer.error('Error loading remote module: ' + error);
});

// Graceful degradation
try {
  // Load MFE
} catch (error) {
  // Fallback behavior
}
```

**Analysis Checklist**:
- [ ] MFE load failure handling
- [ ] Error boundaries for component isolation
- [ ] Fallback mechanisms
- [ ] Error logging and monitoring

### Rule 12: Logging & Observability Detection

**Purpose**: Identify monitoring and debugging capabilities

**Detection Patterns**:
```typescript
// Console logging
console.error('MFE loading failed:', error);

// Performance monitoring
performance.mark('mfe-load-start');
// ... load MFE
performance.mark('mfe-load-end');
```

**Analysis Areas**:
1. **Error Logging**: Console outputs, error services
2. **Performance Monitoring**: Load times, bundle sizes
3. **User Analytics**: Navigation tracking, feature usage
4. **Debug Capabilities**: Development mode features

### Rule 13: Configuration Management Detection

**Purpose**: Identify configuration patterns and environment handling

**Detection Patterns**:
```json
// Environment-specific configurations
{
  "development": {
    "checkout": "http://localhost:4201/remoteEntry.js"
  },
  "production": {
    "checkout": "https://checkout.domain.com/remoteEntry.js"
  }
}
```

**Analysis Steps**:
1. **Environment Files**: Look for `.env`, `environment.ts` files
2. **Configuration Services**: Services managing app configuration
3. **Build-time Configuration**: Webpack, Angular build configurations
4. **Runtime Configuration**: Dynamic configuration loading

---

## Architectural Assessment Rules

### Rule 14: Domain Boundary Evaluation

**Purpose**: Assess domain-driven design implementation

**Evaluation Criteria**:
```
✅ Good Domain Boundaries:
- Clear business capability alignment
- Minimal cross-domain dependencies
- Independent data models
- Autonomous deployment capability

❌ Poor Domain Boundaries:
- Tight coupling between domains
- Shared business logic across domains
- Cross-domain database dependencies
- Frequent cross-domain changes
```

**Assessment Questions**:
1. Do MFE names reflect business domains?
2. Can each MFE be developed independently?
3. Are there clear ownership boundaries?
4. Is there minimal cross-MFE business logic sharing?

### Rule 15: Independence & Coupling Analysis

**Purpose**: Evaluate MFE independence and coupling levels

**Independence Metrics**:
```typescript
// Good: Minimal shared business logic
libs/
├── load-mfe/     // Infrastructure only
└── utils/        // Pure utilities

// Warning: Shared business services
libs/
├── user-service/     // Business logic coupling
├── product-service/  // Domain coupling
└── shared-models/    // Data coupling
```

**Coupling Assessment**:
1. **Data Coupling**: Shared databases, APIs, data models
2. **Technology Coupling**: Shared frameworks, versions
3. **Deployment Coupling**: Must deploy together
4. **Development Coupling**: Changes require coordination

### Rule 16: Scalability Pattern Assessment

**Purpose**: Evaluate scalability and maintainability patterns

**Scalability Indicators**:
```
✅ Scalable Patterns:
- Route-based integration (lazy loading)
- Component-level integration (granular)
- Event-driven communication (loose coupling)
- Independent build/deploy pipelines

⚠️ Scalability Concerns:
- Monolithic shared libraries
- Synchronous cross-MFE calls
- Shared databases
- Tight version coupling
```

### Rule 17: Performance Pattern Analysis

**Purpose**: Identify performance optimization patterns

**Performance Checklist**:
- [ ] Bundle splitting and sharing
- [ ] Lazy loading implementation
- [ ] Code splitting at route/component level
- [ ] Caching strategies for MFE modules
- [ ] Progressive loading patterns

**Bundle Analysis**:
```javascript
// Good: Shared common dependencies
shared: {
  '@angular/core': { singleton: true },
  '@angular/common': { singleton: true },
  'rxjs': { singleton: true }
}
```

---

## Automation Support Rules

### Rule 18: Documentation Generation Patterns

**Purpose**: Support automated documentation tools

**Extractable Information**:
```typescript
/**
 * MFE Metadata Structure
 */
interface MFEMetadata {
  name: string;
  port: number;
  domain: string;
  exposedModules: {
    [key: string]: string; // './Routes' -> 'path/to/routes.ts'
  };
  consumedModules: string[];
  dependencies: string[];
  routes: RouteDefinition[];
}
```

**File Patterns for Automation**:
1. **Webpack Configs**: Parse `module.exports.exposes`
2. **Route Files**: Extract route definitions
3. **Package Dependencies**: Parse `package.json`
4. **TypeScript Paths**: Extract from `tsconfig.base.json`

### Rule 19: Dependency Graph Generation

**Purpose**: Automate dependency visualization

**Graph Generation Rules**:
```typescript
// Dependency relationships
interface DependencyGraph {
  nodes: {
    id: string;           // MFE or library name
    type: 'mfe' | 'lib';  // Node type
    domain?: string;      // Business domain
  }[];
  edges: {
    source: string;       // Consuming MFE
    target: string;       // Provided MFE/lib
    type: 'route' | 'component' | 'service';
  }[];
}
```

**Extraction Points**:
1. Module Federation `exposes` and `remotes`
2. Dynamic import statements
3. Shared library imports
4. Event communication patterns

### Rule 20: Health Check Generation

**Purpose**: Automate architectural health assessment

**Health Metrics**:
```typescript
interface ArchitectureHealth {
  domainBoundaries: 'good' | 'warning' | 'poor';
  independence: 'high' | 'medium' | 'low';
  coupling: 'loose' | 'moderate' | 'tight';
  testability: 'good' | 'adequate' | 'poor';
  documentation: 'complete' | 'partial' | 'missing';
}
```

**Automated Checks**:
1. **Circular Dependencies**: Check for MFE circular references
2. **Bundle Size**: Monitor shared dependency sizes
3. **Load Performance**: Track MFE loading times
4. **Test Coverage**: Verify comprehensive testing

---

## Implementation Guidelines

### For Manual Analysis

1. **Start with Workspace Structure**: Use Rules 1-3 for initial orientation
2. **Map Communications**: Apply Rules 7-9 to understand data flow
3. **Assess Architecture**: Use Rules 14-17 for quality evaluation
4. **Document Findings**: Structure according to Rule 18 patterns

### For Automated Tools

1. **Parse Configuration Files**: Extract metadata using Rules 4-6
2. **Build Dependency Graph**: Implement Rule 19 algorithms
3. **Generate Health Reports**: Apply Rule 20 metrics
4. **Continuous Monitoring**: Track metrics over time

### Best Practices

1. **Document Assumptions**: Record architectural decisions
2. **Version Compatibility**: Track MFE version dependencies
3. **Performance Baselines**: Establish loading time benchmarks
4. **Security Review**: Regular auth/auth pattern audits

---

## Conclusion

These rules provide a comprehensive framework for understanding and analyzing Nx workspaces with Angular micro frontends. They support both human comprehension and automated tooling, enabling effective governance and evolution of micro frontend architectures.

The rules emphasize domain-driven design, independence, and scalability while providing concrete patterns for identification and assessment. Regular application of these rules ensures architectural consistency and quality over time.