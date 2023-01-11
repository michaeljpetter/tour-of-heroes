import { defer, shareReplay, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { memoize } from 'lodash/fp';

export const cacheUntil = (notifier$: Observable<any>) => {
  const cache = memoize(<T>(source$: Observable<T>) => {
    notifier$.pipe(take(1)).subscribe(() => cache.cache.delete(source$));
    return source$.pipe(shareReplay());
  });

  return <T>(source$: Observable<T>) => defer(() => cache(source$));
};
