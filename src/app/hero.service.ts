import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { of, shareReplay, timer, merge, Subject } from 'rxjs';
import { repeat, tap } from 'rxjs/operators';
import { cacheUntil } from 'src/ext/rxjs/operators';
import { once } from 'lodash/fp';

const JSONOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private refresh = new Subject<null>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.getAll = (({ getAll }) => once(() => getAll.apply(this).pipe(
      cacheUntil(merge(this.refresh, timer(10000))),
      repeat({ delay: () => this.refresh })
    )))(this);
  }

  getAll() {
    return this.http.get<Hero[]>('api/heroes').pipe(
      tap(() => this.messageService.add('Fetched all heroes.'))
    );
  }

  get(id: number) {
    return this.http.get<Hero>(`api/heroes/${id}`).pipe(
      tap(() => this.messageService.add(`Fetched hero with id ${id}.`)),
      shareReplay(1)
    );
  }

  search(term: string) {
    if(!term.trim()) return of([]);
    const params = new HttpParams().append('name', term);
    return this.http.get<Hero[]>('api/heroes', { params }).pipe(
      tap(({ length }) => this.messageService.add(`Found ${length} heroes for search term '${term}'.`)),
      shareReplay(1)
    );
  }

  add(hero: Hero) {
    return this.http.post('api/heroes', hero, JSONOptions).pipe(
      tap(() => this.messageService.add(`Added hero with name ${hero.name}.`)),
      tap(() => this.refresh.next(null)),
      shareReplay(1)
    );
  }

  update(hero: Hero) {
    return this.http.put('api/heroes', hero, JSONOptions).pipe(
      tap(() => this.messageService.add(`Updated hero with id ${hero.id}.`)),
      tap(() => this.refresh.next(null)),
      shareReplay(1)
    );
  }

  remove(id: number) {
    return this.http.delete(`api/heroes/${id}`).pipe(
      tap(() => this.messageService.add(`Removed hero with id ${id}.`)),
      tap(() => this.refresh.next(null)),
      shareReplay(1)
    );
  }
}
