# Tractor Store Angular - Micro Frontend Architecture Design

## Overview

This project is a comprehensive e-commerce application built using Angular and Nx workspace, implementing a micro frontend architecture using Module Federation. The application represents a tractor store with multiple specialized micro frontends that work together to provide a complete shopping experience.

## Architecture Overview

### High-Level Architecture

The application follows a **Module Federation** pattern with a **Shell-Remote** architecture:

- **Shell Application**: `tractor-store-angular` (Host) - Acts as the main container and orchestrator
- **Remote Applications**: Three specialized micro frontends
  - `explore` - Product discovery and browsing
  - `decide` - Product details and decision making
  - `checkout` - Shopping cart and checkout process

### Technology Stack

- **Framework**: Angular 19.1.0
- **Build System**: Nx 20.4.6
- **Module Federation**: @angular-architects/module-federation 19.0.2
- **Styling**: SCSS
- **Testing**: Jest
- **Linting**: ESLint
- **Package Manager**: npm

## Application Structure

### 1. Shell Application (`tractor-store-angular`)

**Port**: 4200  
**Role**: Main host application that orchestrates all micro frontends

**Key Responsibilities**:
- Route management and navigation between micro frontends
- Service Worker integration for PWA capabilities
- Module federation manifest management
- Overall application bootstrapping

**Key Files**:
- `app.routes.ts` - Defines lazy-loaded routes to remote modules
- `webpack.config.js` - Module federation configuration
- `public/module-federation.manifest.json` - Remote entry points mapping

### 2. Explore Micro Frontend (`explore`)

**Port**: 4202  
**Role**: Product discovery, browsing, and navigation

**Key Features**:
- Homepage with product teasers
- Category pages for product browsing
- Store locator functionality
- Header and footer components (shared across other MFEs)
- Product recommendations
- Navigation components

**Exposed Modules**:
- `./Routes` - Main routing configuration
- `./Header` - Shared header component
- `./Footer` - Shared footer component
- `./Recommendations` - Product recommendation component

### 3. Decide Micro Frontend (`decide`)

**Port**: 4203  
**Role**: Product details and variant selection

**Key Features**:
- Product detail pages
- Variant selection (color, model options)
- Product image galleries
- Integration with other MFEs for header/footer/recommendations

**Exposed Modules**:
- `./Routes` - Product detail routing

### 4. Checkout Micro Frontend (`checkout`)

**Port**: 4201  
**Role**: Shopping cart and checkout functionality

**Key Features**:
- Mini cart component (embedded in header)
- Add to cart functionality
- Full cart page
- Shopping cart state management

**Exposed Modules**:
- `./Routes` - Cart page routing
- `./miniCart` - Mini cart component for header
- `./addToCart` - Add to cart button component

## Shared Libraries

### 1. `@tractor-store-angular/load-mfe`

**Purpose**: Dynamic micro frontend component loading utility

**Key Components**:
- `MfeLoaderModule` - Angular module for MFE loading
- `LoadRemoteComponentService` - Service for dynamic component loading
- `MfeComponentLoaderComponent` - Component wrapper for remote components

**Usage Pattern**:
```typescript
config = {
  REMOTE_URL: 'http://localhost:4201/remoteEntry.js',
  EXPOSED_MODULE: './miniCart',
  MODULE_NAME: 'MiniCartComponent',
};
```

### 2. `@tractor-store-angular/utils`

**Purpose**: Shared utility functions

**Functions**:
- `src(image, size)` - Image URL generation with size replacement
- `srcset(image, sizes)` - Responsive image srcset generation
- `fmtprice(price)` - Price formatting utility

## Module Federation Configuration

### Host Configuration (`tractor-store-angular`)

```javascript
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

### Remote Configurations

Each remote application exposes specific modules:

- **Checkout**: Routes, miniCart, addToCart components
- **Decide**: Routes for product details
- **Explore**: Routes, Header, Footer, Recommendations components

## Communication Patterns

### 1. Route-Based Communication

Primary navigation between micro frontends uses Angular routing with lazy-loaded remote modules:

```typescript
{
  path: 'explore',
  loadChildren: () =>
    loadRemoteModule({
      type: 'manifest',
      remoteName: 'explore',
      exposedModule: './Routes',
    }).then((m) => m.remoteRoutes),
}
```

### 2. Event-Driven Communication

Shopping cart functionality uses custom DOM events for cross-MFE communication:

```typescript
// Adding to cart
window.dispatchEvent(
  new CustomEvent('add-to-cart', {
    detail: { sku: this.sku },
  })
);

// Listening for cart updates
window.addEventListener('add-to-cart', (ev: Event) => {
  const { sku } = (ev as any).detail;
  // Update cart state
});
```

### 3. Component Embedding

Micro frontends embed components from other MFEs using the `MfeLoaderComponent`:

```html
<lib-mfe-loader [config]="config" [inputs]="inputs"></lib-mfe-loader>
```

## Data Management

### Shared Data Service Pattern

Each micro frontend maintains its own data service with a consistent structure:

- `DataService` - Contains static product, category, and store data
- `StoreService` (in checkout) - Manages shopping cart state using Angular signals

### State Management

- **Local State**: Each MFE manages its own component state using Angular signals
- **Shared State**: Shopping cart state is shared via custom events and browser storage
- **Data Consistency**: Shared data models ensure consistency across MFEs

## Development Workflow

### Running the Application

```bash
# Start all micro frontends simultaneously
npm run run:all

# Or start individual applications
nx serve tractor-store-angular  # Port 4200
nx serve checkout              # Port 4201
nx serve explore              # Port 4202
nx serve decide               # Port 4203
```

### Build Process

Each application has independent build configurations:
- Development builds with source maps and optimization disabled
- Production builds with bundle optimization and hashing
- Custom webpack configurations for module federation

## Design Decisions

### 1. Module Federation over Single-SPA

**Rationale**: Module Federation provides better TypeScript support, easier development experience, and native webpack integration.

### 2. Event-Driven Communication

**Rationale**: Loose coupling between micro frontends while maintaining functionality. Avoids complex shared state management.

### 3. Shared Component Strategy

**Rationale**: Header, footer, and common components are exposed from the `explore` MFE to maintain consistency while allowing independent development.

### 4. Nx Workspace Structure

**Rationale**: Provides excellent tooling, shared libraries, and consistent development experience while maintaining micro frontend independence.

### 5. Angular Signals for State Management

**Rationale**: Modern reactive state management without additional dependencies, providing better performance and developer experience.

## Folder Structure

```
tractor-v2-angular/
├── apps/
│   ├── tractor-store-angular/     # Shell application (Host)
│   │   ├── src/app/
│   │   ├── webpack.config.js      # Module federation config
│   │   └── public/
│   │       └── module-federation.manifest.json
│   ├── checkout/                  # Checkout micro frontend
│   │   ├── src/app/
│   │   │   ├── add-to-cart/      # Add to cart component
│   │   │   ├── minicart/         # Mini cart component
│   │   │   ├── cart-page/        # Full cart page
│   │   │   └── data/             # Cart state management
│   │   └── webpack.config.js
│   ├── decide/                    # Product details micro frontend
│   │   ├── src/app/
│   │   │   ├── product-page/     # Product detail page
│   │   │   └── components/       # Product-specific components
│   │   └── webpack.config.js
│   └── explore/                   # Product discovery micro frontend
│       ├── src/app/
│       │   ├── homepage/         # Homepage component
│       │   ├── categorypage/     # Category listing
│       │   ├── header/           # Shared header
│       │   ├── footer/           # Shared footer
│       │   ├── recommendations/  # Product recommendations
│       │   └── components/       # Reusable components
│       └── webpack.config.js
├── libs/
│   ├── load-mfe/                 # MFE loading utilities
│   │   └── src/lib/
│   │       ├── components/       # MFE loader component
│   │       └── services/         # Remote loading service
│   └── utils/                    # Shared utilities
│       └── src/lib/
│           └── utils.ts          # Image and price utilities
├── nx.json                       # Nx workspace configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.base.json           # Shared TypeScript configuration
```

## Performance Considerations

### 1. Bundle Optimization

- Each MFE has independent bundle optimization
- Shared dependencies are configured as singletons
- Code splitting at the micro frontend level

### 2. Lazy Loading

- All remote modules are lazy-loaded
- Route-based code splitting
- Dynamic component loading for embedded components

### 3. Caching Strategy

- Service Worker integration in the shell app
- Module federation enables efficient caching of shared dependencies
- Independent deployment and caching per micro frontend

## Security Considerations

### 1. CORS Configuration

- All micro frontends run on localhost with different ports
- Production deployment requires proper CORS configuration

### 2. Content Security Policy

- Module federation requires appropriate CSP headers
- Dynamic script loading needs to be allowed for remote entries

### 3. Dependency Management

- Shared dependencies are locked to specific versions
- `strictVersion: true` ensures version consistency

## Deployment Strategy

### Development

- All applications run locally on different ports
- Module federation manifest points to localhost URLs
- Parallel development of micro frontends

### Production

- Independent deployment of each micro frontend
- Module federation manifest updated with production URLs
- CDN deployment for static assets
- Container-based deployment for scalability

## Testing Strategy

### Unit Testing

- Jest configuration for each application
- Shared test utilities in workspace
- Component-level testing for each MFE

### Integration Testing

- Cross-MFE communication testing
- Module federation loading tests
- End-to-end user journey testing

## Future Enhancements

### 1. Micro Frontend Registry

- Dynamic discovery of available micro frontends
- Runtime configuration of module federation

### 2. Shared Design System

- Component library for consistent UI across MFEs
- Shared styling and theming system

### 3. Advanced State Management

- Shared state management solution for complex scenarios
- Event sourcing for audit trails

### 4. Monitoring and Observability

- Micro frontend performance monitoring
- Error tracking across MFE boundaries
- User journey analytics

## Conclusion

This micro frontend architecture provides a scalable, maintainable solution for the tractor store e-commerce application. The design enables independent development and deployment while maintaining a cohesive user experience through shared components and consistent communication patterns.

The use of Nx workspace provides excellent developer experience and tooling, while Module Federation enables true micro frontend capabilities with optimal performance characteristics.
