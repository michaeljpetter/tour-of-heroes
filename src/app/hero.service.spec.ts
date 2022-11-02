import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;
  let messageService: MessageService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    let heroes: Hero[];

    beforeEach(() => {
      heroes = [{id: 1, name: 'Magnus'}, {id: 2, name: 'Shazam'}];
    })

    it('gets all heroes', () => {
      service.getAll().subscribe({
        next: res => expect(res).toEqual(heroes),
        error: fail,
      });

      httpMock.expectOne({ method: 'GET', url: 'api/heroes' }).flush(heroes);

      expect(messageService.messages).toEqual(['Fetched all heroes.']);
    })
  });

  describe('search', () => {
    let heroes: Hero[];

    beforeEach(() => {
      heroes = [{id: 3, name: 'Ragnar'}, {id: 4, name: 'Tiki'}];
    })

    it('searches heroes', () => {
      service.search('chungus').subscribe({
        next: res => expect(res).toEqual(heroes),
        error: fail,
      });

      httpMock.expectOne(({ method, url, params }) =>
        method === 'GET' &&
        url === 'api/heroes' &&
        params.get('name') === 'chungus'
      ).flush(heroes);

      expect(messageService.messages).toEqual([`Found 2 heroes for search term 'chungus'.`]);
    })
  });

  describe('update', () => {
    let hero: Hero;

    beforeEach(() => {
      hero = { id: 3, name: 'Halibut' };
    });

    it('updates a hero', () => {
      service.update(hero).subscribe({ error: fail });

      const put = httpMock.expectOne({ method: 'PUT', url: 'api/heroes' });
      expect(put.request.body).toEqual(hero);
      put.flush(null);

      expect(messageService.messages).toEqual(['Updated hero with id 3.']);
    })
  });
});
