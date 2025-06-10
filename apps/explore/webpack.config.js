const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'explore',
  exposes: {
    './Routes': 'apps/explore/src/app/entry.routes.ts',
    './Header': 'apps/explore/src/app/header/header.component.ts',
    './Footer': 'apps/explore/src/app/footer/footer.component.ts',
    './Recommendations':
      'apps/explore/src/app/recommendations/recommendations.component.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },
});
