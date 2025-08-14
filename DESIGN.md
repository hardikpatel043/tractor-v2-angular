# Tractor Store Angular - Microfrontend Architecture Design

## Overview

This project is a modern Angular 19 application built using Nx monorepo architecture with Module Federation for implementing microfrontends. The application represents an e-commerce tractor store with a distributed architecture where different business domains are separated into independent, deployable microfrontends.

## Architecture Pattern

The application follows the **Shell-Remote Pattern** using Module Federation, where:
- **Shell Application**: `tractor-store-angular` acts as the host/container
- **Remote Applications**: Three microfrontends (`explore`, `decide`, `checkout`) that can be developed, deployed, and scaled independently

## Technology Stack

- **Angular**: 19.1.0 (Latest with standalone components)
- **Nx**: 20.4.6 (Monorepo management and build optimization)
- **Module Federation**: @angular-architects/module-federation 19.0.2
- **TypeScript**: Latest with ES2020 target
- **SCSS**: For styling
- **PWA**: Service Worker enabled for offline capabilities
- **Jest**: Testing framework

## Project Structure

```
tractor-v2-angular/
├── apps/
│   ├── tractor-store-angular/    # Shell/Host Application (Port: Default)
│   ├── explore/                  # Product Exploration MFE (Port: 4202)
│   ├── decide/                   # Product Decision MFE (Port: 4203)
│   └── checkout/                 # Shopping Cart & Checkout MFE (Port: 4201)
├── libs/
│   ├── load-mfe/                 # Shared library for dynamic MFE loading
│   └── utils/                    # Shared utilities (image processing, formatting)
├── nx.json                       # Nx workspace configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.base.json           # TypeScript path mappings
```

## Applications Architecture

### 1. Shell Application - `tractor-store-angular`

**Purpose**: Acts as the main container and orchestrator for all microfrontends.

**Key Responsibilities**:
- Application routing and navigation
- Loading and integrating remote microfrontends
- Providing shared layout structure
- Managing global application state

**Module Federation Configuration**:
```javascript
// webpack.config.js
module.exports = withModuleFederationPlugin({
  name: 'tractor-store-angular',
  exposes: {
    './Component': './apps/tractor-store-angular/src/app/app.component.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

**Routing Strategy**:
- Uses lazy loading with `loadRemoteModule` for each microfrontend
- Routes: `/explore`, `/decide`, `/checkout`
- Default redirect to `/explore`

### 2. Explore Microfrontend - `explore`

**Purpose**: Product discovery and browsing experience.

**Exposed Modules**:
- `./Routes`: Main routing configuration
- `./Header`: Shared header component
- `./Footer`: Shared footer component  
- `./Recommendations`: Product recommendation engine

**Business Domain**: Product catalog, search, filtering, recommendations

### 3. Decide Microfrontend - `decide`

**Purpose**: Product comparison and decision-making tools.

**Exposed Modules**:
- `./Routes`: Decision flow routing

**Business Domain**: Product comparison, specifications, decision support tools

### 4. Checkout Microfrontend - `checkout`

**Purpose**: Shopping cart and purchase flow.

**Exposed Modules**:
- `./Routes`: Checkout flow routing
- `./miniCart`: Mini shopping cart component
- `./addToCart`: Add to cart functionality

**Business Domain**: Cart management, payment processing, order completion

## Shared Libraries

### 1. `@tractor-store-angular/load-mfe`

**Purpose**: Provides dynamic microfrontend loading capabilities.

**Key Components**:
- `LoadRemoteComponentService`: Service for dynamically loading remote components
- `MfeComponentLoaderComponent`: Component wrapper for MFE integration
- `MfeLoaderModule`: Angular module for MFE loading functionality

**Usage Pattern**:
```typescript
loadAndCreateRemoteComponent(
  viewContainer: ViewContainerRef,
  remoteEntry: string,
  exposedModule: string,
  moduleName: string
)
```

### 2. `@tractor-store-angular/utils`

**Purpose**: Shared utility functions across all applications.

**Key Functions**:
- `src(image, size)`: Dynamic image URL generation
- `srcset(image, sizes)`: Responsive image srcset generation
- `fmtprice(price)`: Price formatting with currency

## Module Federation Strategy

### Sharing Strategy
- **Singleton Pattern**: All Angular dependencies are shared as singletons
- **Strict Versioning**: Ensures version compatibility across microfrontends
- **Auto Version Resolution**: Automatically resolves compatible versions

### Loading Strategy
- **Manifest-based Loading**: Uses type: 'manifest' for dynamic discovery
- **Lazy Loading**: Routes are loaded on-demand
- **Component-level Sharing**: Individual components can be shared between MFEs

## Development Workflow

### Local Development
```bash
# Start all microfrontends simultaneously
npm run run:all

# Start individual applications
nx serve tractor-store-angular
nx serve explore --port 4202
nx serve decide --port 4203  
nx serve checkout --port 4201
```

### Build Strategy
- **Independent Builds**: Each MFE can be built independently
- **Shared Dependencies**: Common dependencies are shared to reduce bundle size
- **Production Optimization**: Webpack optimizations for Module Federation

## Communication Patterns

### 1. Route-based Communication
- Primary communication through URL routing
- Each MFE manages its own route segment
- Shell application orchestrates navigation

### 2. Component-level Integration
- Shared components exposed through Module Federation
- Cross-MFE component usage (e.g., miniCart in shell)
- Event-driven communication between components

### 3. Shared State Management
- Shared services through Module Federation
- Singleton pattern ensures state consistency
- RxJS observables for reactive state management

## Design Decisions

### Why Module Federation?
1. **Independent Deployment**: Each MFE can be deployed separately
2. **Team Autonomy**: Different teams can work on different MFEs
3. **Technology Flexibility**: Each MFE can evolve independently
4. **Runtime Integration**: Dynamic loading without build-time coupling

### Why Nx Monorepo?
1. **Code Sharing**: Efficient sharing of libraries and utilities
2. **Build Optimization**: Intelligent caching and incremental builds
3. **Developer Experience**: Unified tooling and consistent development workflow
4. **Dependency Management**: Centralized dependency management

### Standalone Components
- Leverages Angular 19's standalone component architecture
- Reduces bundle size and improves tree-shaking
- Simplifies component sharing across MFEs

## Deployment Architecture

### Development Environment
- All MFEs run locally on different ports
- Shell application loads remotes from localhost
- Hot module replacement for efficient development

### Production Environment
- Each MFE deployed to separate CDN/server
- Shell application configured with production remote URLs
- Independent scaling and versioning

## Performance Considerations

### Bundle Optimization
- Shared dependencies reduce overall bundle size
- Tree-shaking eliminates unused code
- Lazy loading improves initial load time

### Caching Strategy
- Module Federation enables efficient caching
- Shared chunks cached across MFEs
- Service Worker for offline capabilities

### Loading Performance
- Preloading strategies for critical MFEs
- Progressive loading of non-critical components
- Optimized chunk splitting

## Security Considerations

### Module Federation Security
- Trusted remote sources only
- Runtime validation of loaded modules
- Content Security Policy (CSP) compliance

### Cross-MFE Communication
- Secure event handling
- Input validation for shared components
- Isolated execution contexts

## Testing Strategy

### Unit Testing
- Jest configuration for each MFE
- Shared test utilities in libs
- Component isolation testing

### Integration Testing
- Cross-MFE integration tests
- Route-based testing
- Module Federation loading tests

### E2E Testing
- Full user journey testing
- Cross-MFE navigation testing
- Performance testing

## Future Enhancements

### Planned Features
1. **State Management**: Implement NgRx for complex state management
2. **Micro-services Integration**: Backend API integration per MFE
3. **Advanced Routing**: Nested routing within MFEs
4. **Performance Monitoring**: Real-time performance tracking
5. **A/B Testing**: Component-level experimentation

### Scalability Considerations
- Additional MFEs for new business domains
- Micro-service backend architecture
- Container-based deployment
- Advanced caching strategies

## Conclusion

This architecture provides a scalable, maintainable foundation for a complex e-commerce application. The combination of Nx monorepo management with Module Federation enables both development efficiency and runtime flexibility, allowing the application to grow and evolve with changing business requirements while maintaining high performance and developer productivity.
