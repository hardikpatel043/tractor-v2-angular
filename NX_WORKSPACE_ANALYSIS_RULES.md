# Nx Workspace Analysis Rules for Angular Micro Frontends

## Overview

This document provides comprehensive rules for analyzing, navigating, and understanding the Nx workspace containing multiple Angular micro frontends using Module Federation architecture. These rules support both manual code inspection and automated tooling for generating design documentation.

## 1. Workspace Structure Navigation Rules

### 1.1 Primary Directory Structure
```
Rule: Follow the standard Nx workspace pattern
- `/apps/` - Contains all micro frontend applications
- `/libs/` - Contains shared libraries and utilities
- Root configuration files control workspace behavior
```

### 1.2 Application Identification
```
Rule: Each micro frontend follows consistent naming and structure
- Application names should be domain-specific (e.g., checkout, explore, decide)
- Each app has its own webpack.config.js for Module Federation
- Each app has project.json for Nx configuration
- Port assignments follow pattern: shell=4200, remotes=4201+
```

### 1.3 Key Configuration Files
```
Rule: Always examine these files first for workspace understanding
- `nx.json` - Workspace configuration and build targets
- `package.json` - Dependencies and scripts
- `tsconfig.base.json` - Shared TypeScript configuration
- `DESIGN.md` - Architecture documentation (if present)
- `apps/*/webpack.config.js` - Module Federation configuration
- `apps/*/project.json` - Individual app configuration
```

## 2. Module Federation Architecture Rules

### 2.1 Host-Remote Pattern Recognition
```
Rule: Identify the shell application and remote applications
- Shell/Host: Usually named with full application name (e.g., tractor-store-angular)
- Remotes: Domain-specific names (checkout, explore, decide)
- Shell runs on port 4200, remotes on 4201+
- Shell contains module-federation.manifest.json mapping remotes
```

### 2.2 Exposed Module Analysis
```
Rule: Each remote exposes specific modules via webpack configuration
- `./Routes` - Always exposed for routing integration
- Component exports follow pattern: `./ComponentName`
- Check webpack.config.js `exposes` section for available modules
- Naming convention: PascalCase for components, camelCase for services
```

### 2.3 Module Federation Manifest
```
Rule: The manifest file defines remote entry points
Location: `apps/{shell-app}/public/module-federation.manifest.json`
Format: { "remoteName": "http://localhost:port/remoteEntry.js" }
Purpose: Maps remote names to their entry points
```

## 3. Shared Libraries Identification Rules

### 3.1 Library Classification
```
Rule: Categorize libraries by their purpose
- `/libs/load-mfe/` - Micro frontend loading utilities
- `/libs/utils/` - Shared utility functions
- `/libs/{domain}/` - Domain-specific shared code
- Each library has its own project.json and tsconfig.lib.json
```

### 3.2 Library Structure Analysis
```
Rule: Standard library structure pattern
- `src/index.ts` - Public API exports
- `src/lib/` - Implementation code
- `README.md` - Library documentation
- `project.json` - Build and test configuration
```

### 3.3 Shared Dependency Management
```
Rule: Dependencies are shared via Module Federation configuration
- Check `shared` section in webpack.config.js
- `singleton: true` ensures single instance across MFEs
- `strictVersion: true` enforces version consistency
- `requiredVersion: 'auto'` uses package.json versions
```

## 4. Communication Pattern Detection Rules

### 4.1 Route-Based Communication
```
Rule: Primary navigation uses Angular routing with lazy-loaded remotes
Pattern: loadRemoteModule({ type: 'manifest', remoteName: 'name', exposedModule: './Routes' })
Location: Shell app's app.routes.ts
Purpose: Navigate between micro frontends
```

### 4.2 Event-Driven Communication
```
Rule: Cross-MFE communication uses custom DOM events
Pattern: window.dispatchEvent(new CustomEvent('event-name', { detail: data }))
Listener: window.addEventListener('event-name', handler)
Common Events: 'add-to-cart', 'remove-from-cart', 'updated-cart', 'clear-cart'
```

### 4.3 Component Embedding
```
Rule: MFEs embed components from other MFEs using MfeLoaderComponent
Service: LoadRemoteComponentService
Component: MfeComponentLoaderComponent
Configuration: { REMOTE_URL, EXPOSED_MODULE, MODULE_NAME }
```

## 5. Data Flow Analysis Rules

### 5.1 State Management Patterns
```
Rule: Each MFE manages its own state with shared state via events
- Local State: Angular signals within each MFE
- Shared State: Custom events + browser storage
- Data Services: Each MFE has its own DataService
- Store Services: Centralized state management (e.g., StoreService for cart)
```

### 5.2 Data Service Structure
```
Rule: Consistent data service pattern across MFEs
- `data.service.ts` - Static data (products, categories, stores)
- `store.service.ts` - Dynamic state management
- Services use Angular signals for reactivity
- Injectable with providedIn: 'root' for singleton behavior
```

### 5.3 Cross-MFE Data Sharing
```
Rule: Data sharing follows event-driven pattern
- Events carry data in `detail` property
- State changes trigger 'updated-*' events
- Services listen for events in constructor
- Use effect() for reactive updates
```

## 6. Cross-Cutting Concerns Detection Rules

### 6.1 Authentication Patterns
```
Rule: Look for authentication implementation
- Check for auth services in shared libraries
- Look for JWT token handling
- Examine route guards in routing configuration
- Check for auth state management
```

### 6.2 Logging and Monitoring
```
Rule: Identify logging and monitoring setup
- Console logging patterns in services
- Error handling in remote module loading
- Performance monitoring hooks
- Analytics event tracking
```

### 6.3 Error Handling
```
Rule: Error handling patterns across MFEs
- Remote module loading error handling
- Component loading fallbacks
- Network error handling in data services
- User-facing error messages
```

## 7. Component Architecture Rules

### 7.1 Shared Component Strategy
```
Rule: Identify shared components and their ownership
- Header/Footer: Usually owned by 'explore' MFE
- UI Components: Check for shared component libraries
- Business Components: Domain-specific ownership
- Utility Components: In shared libraries
```

### 7.2 Component Communication
```
Rule: Components communicate via inputs/outputs and events
- @Input() for data passing
- @Output() for event emission
- Custom events for cross-MFE communication
- Services for shared state
```

### 7.3 Styling Strategy
```
Rule: Styling approach analysis
- SCSS files for component-specific styles
- Global styles in main styles.scss
- Shared styling variables/mixins
- CSS isolation per micro frontend
```

## 8. Build and Deployment Rules

### 8.1 Build Configuration
```
Rule: Each MFE has independent build configuration
- webpack.config.js for Module Federation
- webpack.prod.config.js for production builds
- project.json for Nx build targets
- Independent versioning and deployment
```

### 8.2 Development Workflow
```
Rule: Development setup patterns
- `npm run run:all` - Start all MFEs simultaneously
- Individual serve commands: `nx serve {app-name}`
- Port allocation: shell=4200, remotes=4201+
- Hot reload and live development
```

### 8.3 Production Deployment
```
Rule: Production deployment considerations
- Independent deployment of each MFE
- Module federation manifest updates
- CDN deployment for static assets
- CORS configuration for cross-origin loading
```

## 9. Testing Strategy Rules

### 9.1 Test Structure
```
Rule: Testing follows Nx conventions
- Jest configuration per application
- Unit tests: *.spec.ts files
- Test setup: test-setup.ts in each app
- Shared test utilities in workspace
```

### 9.2 Integration Testing
```
Rule: Cross-MFE testing patterns
- Module federation loading tests
- Event communication tests
- Component embedding tests
- End-to-end user journey tests
```

## 10. Performance Optimization Rules

### 10.1 Bundle Analysis
```
Rule: Analyze bundle optimization
- Code splitting at MFE level
- Shared dependency optimization
- Lazy loading implementation
- Bundle size monitoring
```

### 10.2 Loading Strategies
```
Rule: Optimize loading performance
- Lazy loading of remote modules
- Dynamic component loading
- Preloading strategies
- Caching mechanisms
```

## 11. Security Considerations Rules

### 11.1 Module Federation Security
```
Rule: Security patterns for MFE architecture
- CORS configuration
- Content Security Policy headers
- Dependency version locking
- Remote entry point validation
```

### 11.2 Data Security
```
Rule: Data protection across MFEs
- Sensitive data handling
- Token management
- Secure communication patterns
- Input validation
```

## 12. Architectural Improvement Suggestions

### 12.1 Scalability Improvements
```
Rule: Identify scalability opportunities
- Micro frontend registry implementation
- Dynamic MFE discovery
- Shared design system
- Advanced state management
```

### 12.2 Maintainability Enhancements
```
Rule: Improve maintainability
- Consistent coding standards
- Shared linting configuration
- Documentation automation
- Dependency management
```

### 12.3 Performance Optimizations
```
Rule: Performance improvement opportunities
- Bundle optimization
- Caching strategies
- Loading performance
- Runtime performance monitoring
```

## 13. Documentation Generation Rules

### 13.1 Automated Documentation
```
Rule: Generate documentation from code analysis
- MFE dependency graphs
- Communication flow diagrams
- Component relationship maps
- API documentation
```

### 13.2 Architecture Visualization
```
Rule: Create visual representations
- Module federation architecture diagrams
- Data flow visualizations
- Component hierarchy charts
- Deployment topology maps
```

## 14. Code Quality Rules

### 14.1 Consistency Checks
```
Rule: Ensure consistency across MFEs
- Naming conventions
- File structure patterns
- Code organization
- Configuration alignment
```

### 14.2 Best Practices Validation
```
Rule: Validate against best practices
- Module Federation patterns
- Angular best practices
- Nx workspace conventions
- Performance guidelines
```

## 15. Troubleshooting Rules

### 15.1 Common Issues
```
Rule: Identify and resolve common problems
- Module loading failures
- Version conflicts
- CORS issues
- Build configuration problems
```

### 15.2 Debugging Strategies
```
Rule: Debugging approaches for MFE architecture
- Network tab analysis
- Console error patterns
- Module federation debugging
- Cross-MFE communication issues
```

## Usage Guidelines

### For Manual Analysis
1. Start with workspace configuration files
2. Identify shell and remote applications
3. Analyze Module Federation setup
4. Map communication patterns
5. Document cross-cutting concerns
6. Suggest architectural improvements

### For Automated Tools
1. Parse configuration files programmatically
2. Generate dependency graphs
3. Validate architectural patterns
4. Create documentation automatically
5. Monitor compliance with rules
6. Suggest optimizations

These rules provide a comprehensive framework for understanding, analyzing, and improving the Nx workspace with Angular micro frontends, supporting both human comprehension and automated tooling for consistent, high-quality design documentation.
