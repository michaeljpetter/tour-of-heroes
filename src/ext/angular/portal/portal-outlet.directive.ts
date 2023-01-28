import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { PortalService } from './portal.service';

@Directive({
  selector: '[portalOutlet]'
})
export class PortalOutletDirective implements OnInit, OnChanges, OnDestroy {
  @Input() portalOutlet = '';

  constructor(
    private viewContainer: ViewContainerRef,
    private service: PortalService
  ) {}

  ngOnInit(): void {
    if(!this.portalOutlet) {
      this.service.registerOutlet(this.portalOutlet, this.viewContainer);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['portalOutlet']) {
      if(!changes['portalOutlet'].isFirstChange()) {
        this.service.unregisterOutlet(changes['portalOutlet'].previousValue);
      }

      this.service.registerOutlet(this.portalOutlet, this.viewContainer);
    }
  }

  ngOnDestroy(): void {
    this.service.unregisterOutlet(this.portalOutlet);
  }
}
