import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { Observable, of, shareReplay, Subject } from 'rxjs';
import { repeat, takeUntil, tap } from 'rxjs/operators';

const JSONOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

export type CancelFunction = () => void;

export interface Cancelable {
  cancel: CancelFunction;
}

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getAll() {
    return this.http.get<Hero[]>('api/heroes').pipe(
      tap(() => this.messageService.add('Fetched all heroes.')),
      shareReplay()
    );
  }

  getAllAutoRefresh(delay: number): Observable<Hero[]> & Cancelable {
    const stop = new Subject();
    return Object.assign(
      this.http.get<Hero[]>('api/heroes').pipe(
        tap(() => this.messageService.add('Fetched all heroes.')),
        repeat({ delay }),
        takeUntil(stop),
        shareReplay()
      ),
      { cancel: () => stop.next(null) }
    );
  }

  get(id: number) {
    return this.http.get<Hero>(`api/heroes/${id}`).pipe(
      tap(() => this.messageService.add(`Fetched hero with id ${id}.`)),
      shareReplay()
    );
  }

  search(term: string) {
    if(!term.trim()) return of([]);
    const params = new HttpParams().append('name', term);
    return this.http.get<Hero[]>('api/heroes', { params }).pipe(
      tap(({ length }) => this.messageService.add(`Found ${length} heroes for search term '${term}'.`)),
      shareReplay()
    );
  }

  add(hero: Hero) {
    return this.http.post('api/heroes', hero, JSONOptions).pipe(
      tap(() => this.messageService.add(`Added hero with name ${hero.name}.`)),
      shareReplay()
    );
  }

  update(hero: Hero) {
    return this.http.put('api/heroes', hero, JSONOptions).pipe(
      tap(() => this.messageService.add(`Updated hero with id ${hero.id}.`)),
      shareReplay()
    );
  }

  remove(id: number) {
    return this.http.delete(`api/heroes/${id}`).pipe(
      tap(() => this.messageService.add(`Removed hero with id ${id}.`)),
      shareReplay()
    );
  }
}
