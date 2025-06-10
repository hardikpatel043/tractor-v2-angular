import { loadManifest } from '@angular-architects/module-federation';

loadManifest('/module-federation.manifest.json')
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
