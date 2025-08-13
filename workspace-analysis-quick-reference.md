# Nx Angular Micro Frontend Workspace - Quick Reference Guide

## Immediate Analysis Checklist

### 1. Initial Workspace Discovery (2 minutes)

**Key Files to Examine First:**
```bash
# Essential configuration files
├── package.json                           # Dependencies and scripts
├── nx.json                                # Nx workspace config  
├── tsconfig.base.json                     # Path mappings
└── apps/tractor-store-angular/public/     
    └── module-federation.manifest.json    # MFE registry
```

**Quick Commands:**
```bash
# View all apps and libs
ls apps/ libs/

# Check MFE ports in project configs
grep -r "port.*42" apps/*/project.json

# Find exposed modules
grep -r "exposes" apps/*/webpack.config.js
```

### 2. Domain Mapping (3 minutes)

**Current Workspace Domains:**
```
🏪 explore   (Port 4202) → Product Discovery
   ├── Homepage, Product Catalog, Store Locator
   └── Exposes: Routes, Header, Footer, Recommendations

🤔 decide    (Port 4203) → Product Decision  
   ├── Product Details, Variants Selection
   └── Exposes: Routes

🛒 checkout  (Port 4201) → Shopping Cart
   ├── Cart Management, Purchase Flow
   └── Exposes: Routes, miniCart, addToCart

🏠 shell     (Port 4200) → Application Shell
   └── Orchestrates all MFEs via routing
```

### 3. Communication Pattern Identification (2 minutes)

**Event-Driven Communication:**
```typescript
// Search for these patterns:
grep -r "CustomEvent\|dispatchEvent" apps/

// Current events in the workspace:
'add-to-cart'     → Triggers cart addition
'remove-from-cart' → Removes item from cart  
'clear-cart'      → Empties shopping cart
'updated-cart'    → Notifies cart state change
```

---

## Practical Analysis Examples

### Example 1: Analyzing MFE Dependencies

```bash
# Find what each MFE exposes
echo "=== CHECKOUT MFE ==="
grep -A 10 "exposes:" apps/checkout/webpack.config.js

echo "=== EXPLORE MFE ==="  
grep -A 10 "exposes:" apps/explore/webpack.config.js

echo "=== DECIDE MFE ==="
grep -A 10 "exposes:" apps/decide/webpack.config.js
```

**Expected Output Analysis:**
- **checkout**: Exposes cart components → Used by other MFEs for shopping
- **explore**: Exposes navigation components → Shared across all MFEs  
- **decide**: Minimal exposure → Focused domain responsibility

### Example 2: Shared Library Assessment

```typescript
// Current shared libraries analysis:

// @tractor-store-angular/load-mfe
// Purpose: Infrastructure for dynamic MFE loading
// Exports: MfeComponentLoaderComponent, LoadRemoteComponentService
// Usage: All MFEs use this for component integration

// @tractor-store-angular/utils  
// Purpose: Utility functions for formatting
// Exports: src(), srcset(), fmtprice()
// Usage: Image handling and price formatting
```

**Assessment**: ✅ Good separation - only infrastructure and utilities shared

### Example 3: Communication Flow Analysis

```typescript
// Add to Cart Flow Example:
// 1. User clicks "Add to Cart" in decide MFE
// 2. AddToCartComponent dispatches 'add-to-cart' event
// 3. StoreService in checkout MFE listens and updates cart
// 4. StoreService dispatches 'updated-cart' event
// 5. All cart displays refresh automatically

// Flow Diagram:
decide MFE → 'add-to-cart' → checkout MFE → 'updated-cart' → all MFEs
```

---

## Common Issues & Red Flags

### 🚨 Architectural Anti-Patterns to Watch For

1. **Tight Coupling Indicators:**
   ```bash
   # Look for these warning signs:
   grep -r "import.*from.*\.\./\.\./apps/" apps/  # Cross-app imports
   grep -r "localhost:42" apps/                   # Hardcoded URLs
   ```

2. **Shared Business Logic:**
   ```bash
   # Check for business logic in shared libs:
   find libs/ -name "*.service.ts" | grep -v load-mfe
   ```

3. **Event Overuse:**
   ```bash
   # Too many custom events might indicate poor boundaries:
   grep -r "CustomEvent" apps/ | wc -l
   ```

### ✅ Positive Patterns to Recognize

1. **Clean Domain Separation:**
   - Each app has clear business focus
   - Minimal cross-domain dependencies
   - Independent data models

2. **Infrastructure Sharing:**
   - Only utilities and MFE loading shared
   - No business logic in shared libraries
   - Clear separation of concerns

3. **Event-Driven Architecture:**
   - Loose coupling via browser events
   - State synchronization without tight binding
   - Technology-agnostic communication

---

## Quick Improvement Assessment

### Performance Checklist
```bash
# Check bundle sharing efficiency:
grep -r "shareAll" apps/*/webpack.config.js

# Verify lazy loading:
grep -r "loadChildren" apps/*/src/app/

# Check for unnecessary dependencies:
npm list --depth=0
```

### Security Checklist  
```bash
# Look for authentication patterns:
find apps/ -name "*auth*" -o -name "*guard*"

# Check for environment configurations:
find . -name "environment*" -o -name ".env*"
```

### Maintainability Checklist
```bash
# Test coverage check:
find . -name "*.spec.ts" | wc -l

# Documentation presence:
find . -name "README.md" | wc -l

# Configuration consistency:
grep -r "strictVersion.*true" apps/*/webpack.config.js
```

---

## Automation Scripts

### Generate MFE Dependency Graph
```bash
#!/bin/bash
echo "digraph MFE_Dependencies {"
for app in apps/*/; do
  name=$(basename "$app")
  if [ -f "$app/webpack.config.js" ]; then
    echo "  $name [shape=box];"
    grep -o "\./[^']*" "$app/webpack.config.js" | while read module; do
      echo "  $name -> \"$module\";"
    done
  fi
done
echo "}"
```

### Health Score Calculator
```bash
#!/bin/bash
score=0

# Check domain separation (25 points)
if [ $(ls apps/ | wc -l) -gt 3 ]; then score=$((score + 25)); fi

# Check shared library minimalism (25 points)  
if [ $(find libs/ -name "*.service.ts" | grep -v load-mfe | wc -l) -eq 0 ]; then 
  score=$((score + 25))
fi

# Check event-driven communication (25 points)
if grep -q "CustomEvent" apps/*/src/app/**/*.ts; then score=$((score + 25)); fi

# Check test presence (25 points)
if [ $(find apps/ -name "*.spec.ts" | wc -l) -gt 10 ]; then score=$((score + 25)); fi

echo "Architecture Health Score: $score/100"
```

---

## Quick Decision Matrix

### When to Split into New MFE
| Factor | Split | Don't Split |
|--------|-------|-------------|
| Business Domain | Different domain | Same domain |
| Team Ownership | Different team | Same team |
| Release Cycle | Independent | Coupled |
| Data Dependencies | Minimal sharing | Heavy sharing |
| User Journey | Different flows | Same flow |

### When to Create Shared Library
| Factor | Create Lib | Keep Private |
|--------|------------|-------------|
| Reuse Pattern | 3+ MFEs use it | 1-2 MFEs use it |
| Logic Type | Pure utilities | Business logic |
| Change Frequency | Stable | Frequent changes |
| Dependencies | Minimal deps | Heavy deps |

---

## Troubleshooting Guide

### MFE Won't Load
1. Check module federation manifest URLs
2. Verify exposed module names match imports
3. Confirm ports are correct and accessible
4. Check for CORS issues

### State Not Syncing
1. Verify event names match between dispatcher and listener
2. Check event payload structure
3. Ensure Angular change detection triggers
4. Verify effect cleanup in Angular services

### Performance Issues  
1. Check for duplicate dependencies in bundles
2. Verify lazy loading implementation
3. Monitor bundle sizes and loading times
4. Check for unnecessary eager loading

This quick reference provides immediate, actionable guidance for analyzing and understanding the Nx Angular micro frontend workspace architecture.