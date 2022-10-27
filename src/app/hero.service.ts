import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { of, shareReplay, BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

const JSONOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private refresh = new BehaviorSubject(null);
  private all: Observable<Hero[]>

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.all = this.refresh.pipe(
      switchMap(() =>
        this.http.get<Hero[]>('api/heroes').pipe(
          tap(() => this.messageService.add('Fetched all heroes.'))
        )
      ),
      shareReplay()
    );
  }

  getAll() {
    return this.all;
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
      tap(() => this.refresh.next(null)),
      shareReplay(),
    );
  }

  update(hero: Hero) {
    return this.http.put('api/heroes', hero, JSONOptions).pipe(
      tap(() => this.messageService.add(`Updated hero with id ${hero.id}.`)),
      tap(() => this.refresh.next(null)),
      shareReplay()
    );
  }

  remove(id: number) {
    return this.http.delete(`api/heroes/${id}`).pipe(
      tap(() => this.messageService.add(`Removed hero with id ${id}.`)),
      tap(() => this.refresh.next(null)),
      shareReplay()
    );
  }
}
