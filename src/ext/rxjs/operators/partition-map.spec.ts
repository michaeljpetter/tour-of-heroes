import { concat, Observable, of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { once } from 'lodash/fp';
import { mapIf, mapNonNil, partitionMap } from './partition-map';

interface Entity {
  id: number
}

const isEntityBoolean = (x: object) => (x as Entity).id !== undefined;
const isEntityGuard = (x: object): x is Entity => (x as Entity).id !== undefined;

let source$: () => Observable<object>;

let subject: () => any;

beforeEach(() => {
  source$ = once(() => of<object[]>({ a: 1 }, { id: 2 }, { id: 3 }, { d: 4 }));
});

describe('partitionMap', () => {
  let projectFalse: () => (value: object) => string;

  beforeEach(() => {
    projectFalse = once(() => x => Object.keys(x)[0]);
  });

  describe('with boolean predicate', () => {
    let projectTrue: () => (value: object) => number;

    beforeEach(() => {
      projectTrue = once(() => x => (x as Entity).id);

      subject = once(() => source$().pipe(
        partitionMap(isEntityBoolean, projectTrue(), projectFalse()),
        toArray()
      ));
    });

    it('yields mapped values', done => {
      subject().subscribe((values: (number | string)[]) => {
        expect(values).toEqual(['a', 2, 3, 'd']);
        done();
      });
    });
  });

  describe('with type guard predicate', () => {
    let projectTrue: () => (value: Entity) => number;

    beforeEach(() => {
      projectTrue = once(() => x => x.id);

      subject = once(() => source$().pipe(
        partitionMap(isEntityGuard, projectTrue(), projectFalse()),
        toArray()
      ));
    });

    it('yields mapped values', done => {
      subject().subscribe((values: (number | string)[]) => {
        expect(values).toEqual(['a', 2, 3, 'd']);
        done();
      });
    });
  });
});

describe('mapIf', () => {
  describe('with boolean predicate', () => {
    let project: () => (value: object) => number;

    beforeEach(() => {
      project = once(() => x => (x as Entity).id);

      subject = once(() => source$().pipe(
        mapIf(isEntityBoolean, project()),
        toArray()
      ));
    });

    it('yields mapped values', done => {
      subject().subscribe((values: (number | object)[]) => {
        expect(values).toEqual([{ a: 1 }, 2, 3, { d: 4 }]);
        done();
      });
    });
  });

  describe('with type guard predicate', () => {
    let project: () => (value: Entity) => number;

    beforeEach(() => {
      project = once(() => x => x.id);

      subject = once(() => source$().pipe(
        mapIf(isEntityGuard, project()),
        toArray()
      ));
    });

    it('yields mapped values', done => {
      subject().subscribe((values: (number | object)[]) => {
        expect(values).toEqual([{ a: 1 }, 2, 3, { d: 4 }]);
        done();
      });
    });
  });
});

describe('mapNonNil', () => {
  let project: () => (value: object) => number;

  beforeEach(() => {
    project = once(() => x => Object.values(x)[0]);
  });

  describe('with only null', () => {
    beforeEach(() => {
      subject = once(() => concat(of(null), source$()).pipe(
        mapNonNil(project()),
        toArray()
      ));
    });

    it('yields mapped values', done => {
      subject().subscribe((values: (number | null)[]) => {
        expect(values).toEqual([null, 1, 2, 3, 4]);
        done();
      });
    });
  });

  describe('with only undefined', () => {
    beforeEach(() => {
      subject = once(() => concat(of(undefined), source$()).pipe(
        mapNonNil(project()),
        toArray()
      ));
    });

    it('yields mapped values', done => {
      subject().subscribe((values: (number | undefined)[]) => {
        expect(values).toEqual([undefined, 1, 2, 3, 4]);
        done();
      });
    });
  });

  describe('with null and undefined', () => {
    beforeEach(() => {
      subject = once(() => concat(of(null), source$(), of(undefined)).pipe(
        mapNonNil(project()),
        toArray()
      ));
    });

    it('yields mapped values', done => {
      subject().subscribe((values: (number | null | undefined)[]) => {
        expect(values).toEqual([null, 1, 2, 3, 4, undefined]);
        done();
      });
    });
  });
});
