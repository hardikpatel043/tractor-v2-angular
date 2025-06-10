const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'checkout',
  exposes: {
    './Routes': 'apps/checkout/src/app/entry.routes.ts',
    './miniCart': 'apps/checkout/src/app/minicart/minicart.component.ts',
    './addToCart': 'apps/checkout/src/app/add-to-cart/add-to-cart.component.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
});
