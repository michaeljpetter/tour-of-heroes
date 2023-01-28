import { EmbeddedViewRef, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, delay, Subscription } from 'rxjs';
import { AutoMap } from 'src/ext/collections/auto-map';

interface TemplateState {
  subscription?: Subscription;
  view?: EmbeddedViewRef<any>;
}

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private readonly outlets = new AutoMap((_: string) => new BehaviorSubject<ViewContainerRef | null>(null));
  private readonly templates = new AutoMap((_: TemplateRef<any>) => ({} as TemplateState));

  registerOutlet(name: string, outlet: ViewContainerRef): void {
    const subject = this.outlets.get(name);
    if(subject.getValue()) {
      throw new Error(`outlet already registered: '${name}'`);
    }
    subject.next(outlet);
  }

  unregisterOutlet(name: string): void {
    this.outlets.get(name).next(null);
  }

  registerTemplate(template: TemplateRef<any>, outletName: string): void {
    const state = this.templates.get(template);
    if(state.subscription) {
      throw new Error('template already registered');
    }
    state.subscription =
      this.outlets.get(outletName).pipe(delay(0)).subscribe(outlet => {
        state.view?.destroy();
        state.view = outlet?.createEmbeddedView(template);
      });
  }

  unregisterTemplate(template: TemplateRef<any>): void {
    const state = this.templates.get(template);
    state.subscription?.unsubscribe();
    state.view?.destroy();
    this.templates.delete(template);
  }
}
