import { defer, delay, from, noop, of, range, Observable, Observer, Subject } from 'rxjs';
import { concatAll, concatMap, mergeAll, tap, toArray } from 'rxjs/operators';
import { once, times } from 'lodash/fp';
import { cacheUntil } from './cache-until';

describe('cacheUntil', () => {
  let notifier$: () => Subject<any>;
  let source$: () => Observable<number>;
  let sourceObserver: () => jasmine.SpyObj<Observer<number>>;
  let subject: () => any;

  beforeEach(() => {
    source$ = once(() => defer((() => {
      let seq = 0;
      return () => range(1 + 3 * seq++, 3);
    })()));

    sourceObserver = once(() => jasmine.createSpyObj('sourceObserver', ['next', 'error']));

    notifier$ = once(() => new Subject<any>());

    subject = once(() => source$().pipe(
      tap(sourceObserver()),
      cacheUntil(notifier$())
    ));
  });

  it('does not pre-emptively subscribe to notifier', () => {
    subject();
    expect(notifier$().observers).toHaveSize(0);
  });

  describe('when subscribed to 3 times in series', () => {
    beforeEach(() => {
      subject = (cached => once(() =>
        from(times(cached, 3)).pipe(concatAll(), toArray())
      ))(subject);
    });

    it('caches source values', done => {
      subject().subscribe((values: number[]) => {
        expect(values).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
        expect(sourceObserver().next).toHaveBeenCalledTimes(3);
        done();
      });
    });

    it('subscribes only once to notifier', done => {
      subject().subscribe(() => {
        expect(notifier$().observers).toHaveSize(1);
        done();
      });
    });

    describe('then notifier emits', () => {
      beforeEach(() => {
        subject = (series => once(() => {
          series().subscribe();
          notifier$().next(null);
          return series();
        }))(subject);
      });

      it('refreshed and re-caches source values', done => {
        subject().subscribe((values: number[]) => {
          expect(values).toEqual([4, 5, 6, 4, 5, 6, 4, 5, 6]);
          expect(sourceObserver().next).toHaveBeenCalledTimes(6);
          done();
        });
      });

      it('does not pre-emptively re-subscribe to notifier', () => {
        subject();
        expect(notifier$().observers).toHaveSize(0);
      });
    });
  });

  describe('when subscribed to 3 times in parallel', () => {
    beforeEach(() => {
      source$ = (sync => once(() =>
        sync().pipe(concatMap(v => of(v).pipe(delay(20))))
      ))(source$);
      subject = (cached => once(() =>
        from(times(cached, 3)).pipe(mergeAll(), toArray())
      ))(subject);
    });

    it('caches source values', done => {
      subject().subscribe((values: number[]) => {
        expect(values).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
        expect(sourceObserver().next).toHaveBeenCalledTimes(3);
        done();
      });
    });

    it('subscribes only once to notifier', done => {
      subject().subscribe(() => {
        expect(notifier$().observers).toHaveSize(1);
        done();
      });
    });

    describe('then notifier emits', () => {
      beforeEach(() => {
        subject = (series => once(() => {
          series().subscribe();
          notifier$().next(null);
          return series();
        }))(subject);
      });

      it('refreshed and re-caches source values', done => {
        subject().subscribe((values: number[]) => {
          expect(values).toEqual([4, 4, 4, 5, 5, 5, 6, 6, 6]);
          expect(sourceObserver().next).toHaveBeenCalledTimes(6);
          done();
        });
      });

      it('does not pre-emptively re-subscribe to notifier', () => {
        subject();
        expect(notifier$().observers).toHaveSize(0);
      });
    });
  });

  describe('when source has an error', () => {
    beforeEach(() => {
      source$ = once(() => new Observable<number>(subscriber => subscriber.error('whoops')));
    });

    it('does not cache the error', () => {
      times(() => subject().subscribe({ error: noop }), 3);

      expect(sourceObserver().error).toHaveBeenCalledTimes(3);
      expect(sourceObserver().error).toHaveBeenCalledWith('whoops');
    });
  });
});
