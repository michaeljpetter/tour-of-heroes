import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { flow, invoke, once, tap } from 'lodash/fp';
import { PortalModule } from './portal.module';

describe('PortalModule', () => {
  @Component({
    selector: 'template1',
    template: `{{text}}`
  })
  class Template1Component {
    @Input() text = '';
  }

  @Component({
    template: `
      <div *ngIf="showOutlet1" data-outlet1>
        <ng-container *portalOutlet></ng-container>
      </div>
      <div data-outlet2>
        <ng-container *portalOutlet="outlet2Name"></ng-container>
      </div>

      <main>
        <ng-container *ngIf="showTemplate1">
          <template1 *portal data-template1 [text]="template1Text"></template1>
        </ng-container>
        <div data-fixed>Fixed</div>
        <div *portal="template2OutletName" data-template2>Template 2</div>
      </main>
    `
  })
  class HostComponent {
    @Input() showOutlet1 = true;
    @Input() showTemplate1 = true;
    @Input() template1Text = 'Template 1';
    @Input() outlet2Name = 'outlet2';
    @Input() template2OutletName = 'outlet2';
  }

  let host: () => Promise<ComponentFixture<HostComponent>>;
  let subject: () => any;

  beforeEach(() => {
    host = once(async () => {
      await TestBed.configureTestingModule({
        declarations: [Template1Component, HostComponent],
        imports: [PortalModule]
      }).compileComponents();

      return tap(invoke('detectChanges'))(
        TestBed.createComponent(HostComponent)
      );
    });

    subject = once(async () => {
      const fixture = await host();
      await fixture.whenStable();
      fixture.detectChanges();
      return fixture.debugElement;
    });
  });

  it('moves template 1 to outlet 1', () => subject().then((root: DebugElement) => {
    expect(root.query(By.css('[data-outlet1] [data-template1]'))).not.toBeNull();
    expect(root.query(By.css('main [data-template1]'))).toBeNull();
  }));

  it('moves template 2 to outlet 2', () => subject().then((root: DebugElement) => {
    expect(root.query(By.css('[data-outlet2] [data-template2]'))).not.toBeNull();
    expect(root.query(By.css('main [data-template2]'))).toBeNull();
  }));

  it('leaves fixed content in place', () => subject().then((root: DebugElement) => {
    expect(root.query(By.css('main [data-fixed]'))).not.toBeNull();
  }));

  it('renders template 1 with bound values', () => subject().then((root: DebugElement) => {
    expect(root.query(By.css('[data-template1]')).nativeElement.textContent).toEqual('Template 1');
  }));

  describe('when template 1 bound values are changed', () => {
    beforeEach(() => {
      host = (fixture => once(() =>
        fixture().then(flow(
          tap(({ componentInstance }) => componentInstance.template1Text = 'Template 1 Changed'),
          tap(invoke('detectChanges'))
        ))
      ))(host);
    });

    it('updates rendered values', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-template1]')).nativeElement.textContent).toEqual('Template 1 Changed');
    }));
  });

  describe('when outlet 2 changes to the same name as outlet 1', () => {
    beforeEach(() => {
      host = (fixture => once(() =>
        fixture().then(flow(
          tap(({ componentInstance }) => componentInstance.outlet2Name = ''),
          tap(invoke('detectChanges'))
        ))
      ))(host);
    });

    it('throws an error', () => subject()
      .then(() => { fail('expected an error to be thrown'); })
      .catch((err: any) => { expect(err).toMatch(/outlet already registered/); })
    );
  });

  describe('when template 2 changes to outlet 1', () => {
    beforeEach(() => {
      host = (fixture => once(() =>
        fixture().then(flow(
          tap(({ componentInstance }) => componentInstance.template2OutletName = ''),
          tap(invoke('detectChanges'))
        ))
      ))(host);
    });

    it('moves template 2 to outlet 1', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-outlet1] [data-template2]'))).not.toBeNull();
      expect(root.query(By.css('[data-outlet2] [data-template2]'))).toBeNull();
    }));

    it('retains template 1 in outlet 1', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-outlet1] [data-template1]'))).not.toBeNull();
    }));
  });

  describe('when outlet 2 changes its name', () => {
    beforeEach(() => {
      host = (fixture => once(() =>
        fixture().then(flow(
          tap(({ componentInstance }) => componentInstance.outlet2Name = 'outlet2Changed'),
          tap(invoke('detectChanges'))
        ))
      ))(host);
    });

    it('empties outlet 2', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-outlet2] *'))).toBeNull();
    }));

    it('destroys template 2', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-template2]'))).toBeNull();
    }));

    describe('when template 2 changes its outlet name to match', () => {
      beforeEach(() => {
        host = (fixture => once(() =>
          fixture().then(flow(
            tap(({ componentInstance }) => componentInstance.template2OutletName = 'outlet2Changed'),
            tap(invoke('detectChanges'))
          ))
        ))(host);
      });

      it('recreates template 2 in outlet 2', () => subject().then((root: DebugElement) => {
        expect(root.query(By.css('[data-outlet2] [data-template2]'))).not.toBeNull();
      }));
    });
  });

  describe('when template 2 changes its outlet name', () => {
    beforeEach(() => {
      host = (fixture => once(() =>
        fixture().then(flow(
          tap(({ componentInstance }) => componentInstance.template2OutletName = 'outlet2Changed'),
          tap(invoke('detectChanges'))
        ))
      ))(host);
    });

    it('empties outlet 2', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-outlet2] *'))).toBeNull();
    }));

    it('destroys template 2', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-template2]'))).toBeNull();
    }));

    describe('when outlet 2 changes its name to match', () => {
      beforeEach(() => {
        host = (fixture => once(() =>
          fixture().then(flow(
            tap(({ componentInstance }) => componentInstance.outlet2Name = 'outlet2Changed'),
            tap(invoke('detectChanges'))
          ))
        ))(host);
      });

      it('recreates template 2 in outlet 2', () => subject().then((root: DebugElement) => {
        expect(root.query(By.css('[data-outlet2] [data-template2]'))).not.toBeNull();
      }));
    });
  });

  describe('when outlet 1 is removed', () => {
    beforeEach(() => {
      host = (fixture => once(() =>
        fixture().then(flow(
          tap(({ componentInstance }) => componentInstance.showOutlet1 = false),
          tap(invoke('detectChanges'))
        ))
      ))(host);
    });

    it('destroys template 1', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-template1]'))).toBeNull();
    }));

    describe('when outlet 1 is re-added', () => {
      beforeEach(() => {
        host = (fixture => once(() =>
          fixture().then(flow(
            tap(({ componentInstance }) => componentInstance.showOutlet1 = true),
            tap(invoke('detectChanges'))
          ))
        ))(host);
      });

      it('recreates template 1 in outlet 1', () => subject().then((root: DebugElement) => {
        expect(root.query(By.css('[data-outlet1] [data-template1]'))).not.toBeNull();
      }));
    });

    describe('when outlet 2 changes to the same name as outlet 1', () => {
      beforeEach(() => {
        host = (fixture => once(() =>
          fixture().then(flow(
            tap(({ componentInstance }) => componentInstance.outlet2Name = ''),
            tap(invoke('detectChanges'))
          ))
        ))(host);
      });

      it('recreates template 1 in outlet 2', () => subject().then((root: DebugElement) => {
        expect(root.query(By.css('[data-outlet2] [data-template1]'))).not.toBeNull();
      }));

      it('destroys template 2', () => subject().then((root: DebugElement) => {
        expect(root.query(By.css('[data-template2]'))).toBeNull();
      }));
    });
  });

  describe('when template 1 is removed', () => {
    beforeEach(() => {
      host = (fixture => once(() =>
        fixture().then(flow(
          tap(({ componentInstance }) => componentInstance.showTemplate1 = false),
          tap(invoke('detectChanges'))
        ))
      ))(host);
    });

    it('destroys template 1', () => subject().then((root: DebugElement) => {
      expect(root.query(By.css('[data-template1]'))).toBeNull();
    }));

    describe('when template 1 is re-added', () => {
      beforeEach(() => {
        host = (fixture => once(() =>
          fixture().then(flow(
            tap(({ componentInstance }) => componentInstance.showTemplate1 = true),
            tap(invoke('detectChanges'))
          ))
        ))(host);
      });

      it('recreates template 1 in outlet 1', () => subject().then((root: DebugElement) => {
        expect(root.query(By.css('[data-outlet1] [data-template1]'))).not.toBeNull();
      }));
    });
  });
});
