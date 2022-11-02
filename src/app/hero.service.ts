import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { of, shareReplay } from 'rxjs';

const JSONOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getAll() {
    const get = this.http.get<Hero[]>('api/heroes').pipe(shareReplay());
    get.subscribe(() => this.messageService.add('Fetched all heroes.'));
    return get;
  }

  get(id: number) {
    const get = this.http.get<Hero>(`api/heroes/${id}`).pipe(shareReplay());
    get.subscribe(() => this.messageService.add(`Fetched hero with id ${id}.`));
    return get;
  }

  update(hero: Hero) {
    const put = this.http.put('api/heroes', hero, JSONOptions).pipe(shareReplay());
    put.subscribe(() => this.messageService.add(`Updated hero with id ${hero.id}.`));
    return put;
  }

  add(hero: Hero) {
    const post = this.http.post('api/heroes', hero, JSONOptions).pipe(shareReplay());
    post.subscribe(() => this.messageService.add(`Added hero with name ${hero.name}.`));
    return post;
  }

  remove(id: number) {
    const del = this.http.delete(`api/heroes/${id}`).pipe(shareReplay());
    del.subscribe(() => this.messageService.add(`Removed hero with id ${id}.`));
    return del;
  }

  search(term: string) {
    if(!term.trim()) return of([]);
    const params = new HttpParams().append('name', term);
    const get = this.http.get<Hero[]>('api/heroes', { params }).pipe(shareReplay());
    get.subscribe(({ length }) => this.messageService.add(`Found ${length} heroes for search term '${term}'.`));
    return get;
  }
}
