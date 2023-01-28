import { once } from 'lodash/fp';
import { AutoMap } from './auto-map';

describe('AutoMap', () => {
  let factory: () => jasmine.Spy<(key: number) => string>;
  let entries: () => [number, string | undefined][] | undefined;
  let instance: () => AutoMap<number, string | undefined>;
  let subject: () => any;

  beforeEach(() => {
    factory = once(() => jasmine.createSpy('factory'));
    entries = () => undefined;

    instance = once(() => new AutoMap(factory(), entries()));
    subject = once(() => instance());
  });

  describe('get', () => {
    let key: () => number;

    beforeEach(() => {
      subject = (map => once(() =>
        map().get(key())
      ))(subject);
    });

    [
      'thing',
      undefined
    ].forEach(value => {
      describe('when the key exists', () => {
        beforeEach(() => {
          entries = once(() => [[33, value]]);
          key = () => 33;
        });

        it('yields the value', () => {
          expect(subject()).toEqual(value);
          expect(factory()).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the key does not exist', () => {
      beforeEach(() => {
        factory().and.returnValue('generated');
        key = () => 77;
      });

      it('uses the factory to generate the value', () => {
        expect(subject()).toEqual('generated');
        expect(factory()).toHaveBeenCalledOnceWith(77);
        expect([...instance()]).toEqual([[77, 'generated']]);
      });
    });
  });
});
