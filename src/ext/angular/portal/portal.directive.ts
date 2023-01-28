import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { PortalService } from './portal.service';

@Directive({
  selector: '[portal]'
})
export class PortalDirective implements OnInit, OnChanges, OnDestroy {
  @Input() portal = '';

  constructor(
    private template: TemplateRef<any>,
    private service: PortalService
  ) {}

  ngOnInit(): void {
    if(!this.portal) {
      this.service.registerTemplate(this.template, this.portal);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['portal']) {
      if(!changes['portal'].isFirstChange()) {
        this.service.unregisterTemplate(this.template);
      }

      this.service.registerTemplate(this.template, this.portal);
    }
  }

  ngOnDestroy(): void {
    this.service.unregisterTemplate(this.template);
  }
}
