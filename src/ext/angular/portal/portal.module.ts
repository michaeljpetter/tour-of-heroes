import { NgModule } from '@angular/core';
import { PortalDirective } from './portal.directive';
import { PortalOutletDirective } from './portal-outlet.directive';

@NgModule({
  declarations: [
    PortalDirective,
    PortalOutletDirective
  ],
  exports: [
    PortalDirective,
    PortalOutletDirective
  ]
})
export class PortalModule { }
