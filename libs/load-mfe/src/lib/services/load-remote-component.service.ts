import { Injectable, ViewContainerRef } from '@angular/core';

import { Observable } from 'rxjs';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Injectable({ providedIn: 'root' })
export class LoadRemoteComponentService {
  loadAndCreateRemoteComponent(
    viewContainer: ViewContainerRef,
    remoteEntry: string,
    exposedModule: string,
    moduleName: string
  ) {
    return new Observable((observer) => {
      try {
        viewContainer?.clear();
        loadRemoteModule({
          type: 'module',
          remoteEntry: remoteEntry,
          exposedModule: exposedModule,
        })
          .then((m) => {
            const componentType = m[moduleName];
            if (!componentType) {
              throw new Error(
                `Component '${moduleName}' not found in remote module.`
              );
            }
            const componentRef = viewContainer.createComponent(m[moduleName]);
            observer.next(componentRef.instance);
            observer.complete();
          })
          .catch((error) => {
            observer.error('Error loading remote module: ' + error);
          });
      } catch (error) {
        observer.error('Error loading remote module: ' + error);
      }
    });
  }
}
