# Tractor Store Angular - Micro Frontend Architecture Design

## Overview

The Tractor Store Angular is a comprehensive e-commerce application built using **Micro Frontend Architecture** with **Angular 19** and **Module Federation**. The application is organized as an Nx workspace containing multiple Angular applications that work together to provide a seamless shopping experience for agricultural tractors.

## Architecture Principles

### Domain-Driven Design (DDD)
Each micro frontend represents a distinct business domain:
- **Explore**: Product discovery and catalog browsing
- **Decide**: Product decision-making and variant selection
- **Checkout**: Shopping cart and purchase flow
- **Shell**: Application orchestration and navigation

### Micro Frontend Benefits
- **Independent Development**: Teams can work independently on different domains
- **Technology Independence**: Each MFE can evolve its technology stack independently
- **Scalable Deployment**: Individual MFEs can be deployed separately
- **Fault Isolation**: Issues in one MFE don't affect others

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Shell Application                      │
│                  (tractor-store-angular)                   │
│                      Port 4200                             │
├─────────────────────────────────────────────────────────────┤
│  Route-based Micro Frontend Integration                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Explore   │  │   Decide    │  │  Checkout   │        │
│  │ Port 4202   │  │ Port 4203   │  │ Port 4201   │        │
│  │             │  │             │  │             │        │
│  │ - Homepage  │  │ - Product   │  │ - Cart      │        │
│  │ - Products  │  │   Details   │  │ - Mini Cart │        │
│  │ - Stores    │  │ - Variants  │  │ - Add to    │        │
│  │ - Header    │  │ - Reviews   │  │   Cart      │        │
│  │ - Footer    │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Shared Libraries │
                    │ ┌─────────────┐  │
                    │ │  load-mfe   │  │
                    │ │   utils     │  │
                    │ └─────────────┘  │
                    └─────────────────┘
```

### Port Configuration
- **Shell (tractor-store-angular)**: `4200`
- **Checkout MFE**: `4201`
- **Explore MFE**: `4202`
- **Decide MFE**: `4203`

## Folder Structure

```
tractor-v2-angular/
├── apps/                           # Micro Frontend Applications
│   ├── tractor-store-angular/      # Shell Application (Host)
│   │   ├── src/app/
│   │   │   ├── app.component.ts    # Root component
│   │   │   └── app.routes.ts       # Module federation routing
│   │   ├── webpack.config.js       # MF configuration
│   │   └── public/
│   │       └── module-federation.manifest.json  # MFE registry
│   │
│   ├── explore/                    # Product Discovery MFE
│   │   ├── src/app/
│   │   │   ├── homepage/           # Landing page
│   │   │   ├── categorypage/       # Product catalog
│   │   │   ├── store-page/         # Store locator
│   │   │   ├── header/             # Shared navigation
│   │   │   ├── footer/             # Shared footer
│   │   │   ├── recommendations/    # Product recommendations
│   │   │   └── data/
│   │   │       └── data.service.ts # Product catalog data
│   │   └── webpack.config.js       # Exposes: Routes, Header, Footer, Recommendations
│   │
│   ├── decide/                     # Product Decision MFE
│   │   ├── src/app/
│   │   │   ├── product-page/       # Product detail page
│   │   │   ├── components/
│   │   │   │   └── variant-option/ # Product variants
│   │   │   └── data/
│   │   │       └── data.service.ts # Product details data
│   │   └── webpack.config.js       # Exposes: Routes
│   │
│   └── checkout/                   # Shopping Cart MFE
│       ├── src/app/
│       │   ├── cart-page/          # Shopping cart page
│       │   ├── minicart/           # Mini cart widget
│       │   ├── add-to-cart/        # Add to cart button
│       │   └── data/
│       │       └── store.service.ts # Cart state management
│       └── webpack.config.js       # Exposes: Routes, miniCart, addToCart
│
├── libs/                          # Shared Libraries
│   ├── load-mfe/                  # Dynamic MFE Loading
│   │   ├── src/lib/
│   │   │   ├── components/
│   │   │   │   └── mfe-component-loader.component.ts
│   │   │   ├── services/
│   │   │   │   └── load-remote-component.service.ts
│   │   │   └── mfe-loader.module.ts
│   │   └── README.md
│   │
│   └── utils/                     # Shared Utilities
│       ├── src/lib/
│       │   └── utils.ts           # Image and price formatting
│       └── README.md
│
├── nx.json                        # Nx workspace configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.base.json            # TypeScript path mapping
```

## Module Federation Configuration

### Shell Application Configuration
```javascript
// apps/tractor-store-angular/webpack.config.js
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

### Micro Frontend Configurations

#### Explore MFE
```javascript
// apps/explore/webpack.config.js
module.exports = withModuleFederationPlugin({
  name: 'explore',
  exposes: {
    './Routes': 'apps/explore/src/app/entry.routes.ts',
    './Header': 'apps/explore/src/app/header/header.component.ts',
    './Footer': 'apps/explore/src/app/footer/footer.component.ts',
    './Recommendations': 'apps/explore/src/app/recommendations/recommendations.component.ts',
  },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});
```

#### Decide MFE
```javascript
// apps/decide/webpack.config.js
module.exports = withModuleFederationPlugin({
  name: 'decide',
  exposes: {
    './Routes': 'apps/decide/src/app/entry.routes.ts',
  },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});
```

#### Checkout MFE
```javascript
// apps/checkout/webpack.config.js
module.exports = withModuleFederationPlugin({
  name: 'checkout',
  exposes: {
    './Routes': 'apps/checkout/src/app/entry.routes.ts',
    './miniCart': 'apps/checkout/src/app/minicart/minicart.component.ts',
    './addToCart': 'apps/checkout/src/app/add-to-cart/add-to-cart.component.ts',
  },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});
```

### Module Federation Manifest
```json
{
  "checkout": "http://localhost:4201/remoteEntry.js",
  "decide": "http://localhost:4203/remoteEntry.js", 
  "explore": "http://localhost:4202/remoteEntry.js"
}
```

## Routing Strategy

### Shell Application Routes
```typescript
// apps/tractor-store-angular/src/app/app.routes.ts
export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'explore',
  },
  {
    path: 'explore',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'explore',
        exposedModule: './Routes',
      }).then((m) => m.remoteRoutes),
  },
  {
    path: 'decide',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest', 
        remoteName: 'decide',
        exposedModule: './Routes',
      }).then((m) => m.remoteRoutes),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'checkout', 
        exposedModule: './Routes',
      }).then((m) => m.remoteRoutes),
  },
];
```

### MFE Routes

#### Explore Routes
- `/explore` → Homepage
- `/explore/products` → Product catalog/category page
- `/explore/stores` → Store locator page

#### Decide Routes  
- `/decide/product` → Product detail page

#### Checkout Routes
- `/checkout/cart` → Shopping cart page

## Communication Patterns

### 1. Route-Level Integration
The shell application loads entire route modules from micro frontends using Angular's lazy loading with module federation.

### 2. Component-Level Integration
Individual components are dynamically loaded using the shared `load-mfe` library:

```typescript
// Example: Loading Add to Cart component in Decide MFE
addToCartConfig = {
  REMOTE_URL: 'http://localhost:4201/remoteEntry.js',
  EXPOSED_MODULE: './addToCart', 
  MODULE_NAME: 'AddToCartComponent',
};

addToCartInputs = {
  sku: this.variant().sku,
};
```

### 3. Cross-MFE Communication via Custom Events

#### Event-Driven Architecture
The application uses browser custom events for cross-MFE communication:

```typescript
// Dispatching events (from any MFE)
window.dispatchEvent(
  new CustomEvent('add-to-cart', {
    detail: { sku: this.sku },
  })
);

// Listening for events (in Checkout MFE)
window.addEventListener('add-to-cart', (ev: Event) => {
  const { sku } = (ev as any).detail;
  // Update cart state
});
```

#### Event Types
- `add-to-cart`: Add item to shopping cart
- `remove-from-cart`: Remove item from cart
- `clear-cart`: Clear all items from cart
- `updated-cart`: Notify cart state change

## Shared Libraries

### Load-MFE Library (`@tractor-store-angular/load-mfe`)

A comprehensive library for dynamic micro frontend component loading:

#### Components
- **MfeComponentLoaderComponent**: Generic component loader
  ```typescript
  <lib-mfe-loader 
    [config]="addToCartConfig" 
    [inputs]="addToCartInputs">
  </lib-mfe-loader>
  ```

#### Services
- **LoadRemoteComponentService**: Core service for loading remote components
  ```typescript
  loadAndCreateRemoteComponent(
    viewContainer: ViewContainerRef,
    remoteEntry: string,
    exposedModule: string, 
    moduleName: string
  ): Observable<any>
  ```

### Utils Library (`@tractor-store-angular/utils`)

Shared utility functions:

```typescript
// Image URL generation with responsive sizes
export function src(image: string, size: number): string
export function srcset(image: string, sizes: Array<number>): string

// Price formatting (Danish/Norwegian Krone)
export function fmtprice(price: number): string // Returns "2700,00 Ø"
```

## State Management

### Local State (Angular Signals)
Each MFE manages its own state using Angular 19's signals:

```typescript
// Checkout MFE - Cart state
@Injectable({ providedIn: 'root' })
export class StoreService {
  store = signal<{ sku: string; quantity: number }[]>([]);
  
  useLineItems() {
    return this.store;
  }
}
```

### Cross-MFE State Synchronization
State synchronization happens through custom events:

```typescript
// Effect-based reactivity
effect(() => {
  const refresh = () => {
    this.store.set([...this.store()]);
  };
  
  window.addEventListener('updated-cart', refresh);
  return () => {
    window.removeEventListener('updated-cart', refresh);
  };
});
```

### Computed Properties
Reactive computed values based on signals:

```typescript
quantity = computed(() =>
  this.storeService.store().reduce((t, { quantity }) => t + quantity, 0)
);
```

## Data Management

### Product Catalog (Explore MFE)
The Explore MFE contains the complete product catalog with:
- **Categories**: Classic and Autonomous tractors
- **Products**: Detailed product information
- **Variants**: Color and specification variants with SKUs
- **Stores**: Physical store locations
- **Recommendations**: Related product suggestions

### Data Flow
1. **Explore MFE**: Provides product catalog and discovery
2. **Decide MFE**: Consumes product data for detailed views
3. **Checkout MFE**: Manages cart state and product references via SKUs

## Technology Stack

### Core Technologies
- **Angular 19**: Latest Angular framework with standalone components
- **TypeScript 5.7**: Type-safe development
- **SCSS**: Styling and theming
- **Nx 20.4**: Monorepo management and build tools

### Micro Frontend Technologies
- **@angular-architects/module-federation 19.0**: Module federation implementation
- **Webpack 5**: Bundling with module federation support

### Development Tools
- **Jest**: Unit testing framework
- **ESLint**: Code linting and formatting
- **Angular PWA**: Progressive web app features (shell only)

## Development Workflow

### Local Development
```bash
# Start all micro frontends in parallel
npm run run:all

# Or start individual applications
nx serve tractor-store-angular  # Port 4200
nx serve explore               # Port 4202  
nx serve decide                # Port 4203
nx serve checkout              # Port 4201
```

### Build Process
```bash
# Build all applications
nx build tractor-store-angular
nx build explore
nx build decide  
nx build checkout

# Build shared libraries
nx build load-mfe
nx build utils
```

### Testing
```bash
# Run all tests
nx test

# Test specific applications
nx test checkout
nx test explore
nx test decide
```

## Design Decisions

### 1. Domain-Based MFE Split
**Decision**: Split by business domains rather than technical concerns
**Rationale**: 
- Aligns with business capabilities
- Enables independent team ownership
- Reduces coupling between features

### 2. Event-Driven Communication
**Decision**: Use browser custom events for cross-MFE communication
**Rationale**:
- Technology agnostic approach
- Loose coupling between MFEs
- Simple implementation without shared state management

### 3. Route-Level + Component-Level Integration
**Decision**: Support both routing and component embedding
**Rationale**:
- Routing for full page experiences
- Component embedding for shared widgets (cart, navigation)
- Maximum flexibility for different integration patterns

### 4. Shared Library Strategy
**Decision**: Minimal shared libraries focused on MFE infrastructure
**Rationale**:
- Avoid creating dependencies between MFEs
- Share only infrastructure concerns (loading, utilities)
- Keep business logic isolated

### 5. Angular Signals for State Management
**Decision**: Use Angular 19 signals instead of external state management
**Rationale**:
- Native Angular reactivity
- Simpler than external libraries
- Good performance characteristics
- Aligns with Angular's future direction

## Performance Considerations

### Bundle Optimization
- **Common Chunk Disabled**: Each MFE manages its own chunks
- **Shared Dependencies**: Angular, RxJS, and common libraries shared as singletons
- **Lazy Loading**: Routes and components loaded on demand

### Loading Strategy
- **Manifest-Based Loading**: Runtime discovery of MFE endpoints
- **Component Caching**: Loaded components cached in memory
- **Progressive Loading**: Critical features loaded first

### Bundle Budgets
- **Initial Bundle**: 500KB warning, 1MB error
- **Component Styles**: 4KB warning, 8KB error

## Security Considerations

### Content Security Policy (CSP)
- Configure CSP headers to allow module federation scripts
- Whitelist MFE endpoints and CDN resources

### Cross-Origin Resource Sharing (CORS)
- Configure proper CORS headers for MFE communication
- Validate origins in production environments

## Deployment Strategy

### Independent Deployments
Each micro frontend can be deployed independently:
- **Shell**: Main application deployment
- **MFEs**: Independent deployments with versioned endpoints
- **Libraries**: Published to internal npm registry

### Environment Configuration
```json
// Production manifest
{
  "checkout": "https://checkout.tractor-store.com/remoteEntry.js",
  "decide": "https://decide.tractor-store.com/remoteEntry.js", 
  "explore": "https://explore.tractor-store.com/remoteEntry.js"
}
```

## Monitoring and Observability

### Error Boundaries
- Each MFE includes error handling for graceful degradation
- Failed MFE loads don't crash the entire application

### Performance Monitoring
- Track MFE load times and bundle sizes
- Monitor cross-MFE communication performance
- Core Web Vitals tracking for user experience

## Future Enhancements

### Potential Improvements
1. **Server-Side Rendering (SSR)**: Implement Angular Universal for better SEO
2. **Edge Deployment**: Deploy MFEs to CDN edges for better performance
3. **A/B Testing**: Framework for testing different MFE versions
4. **Micro Services**: Backend services aligned with MFE boundaries
5. **Design System**: Shared component library for consistent UI

### Scalability Considerations
- **Team Scalability**: Each domain can be owned by separate teams
- **Technical Scalability**: Independent technology choices per MFE
- **Deployment Scalability**: Independent release cycles and rollbacks

## Conclusion

The Tractor Store Angular application demonstrates a well-architected micro frontend system that balances independence with integration. The domain-driven approach, combined with modern Angular features and module federation, creates a scalable and maintainable e-commerce platform.

The architecture supports:
- **Developer Productivity**: Independent development and deployment
- **User Experience**: Seamless integration and fast loading
- **Business Agility**: Rapid iteration on individual domains
- **Technical Evolution**: Independent technology upgrades

This design provides a solid foundation for a growing e-commerce platform while maintaining the flexibility to evolve with changing business requirements.