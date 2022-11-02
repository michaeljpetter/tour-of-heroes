import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  results?: Observable<Hero[]>;
  private terms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.results = this.terms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.heroService.search(term))
    );
  }

  search(term: string) {
    this.terms.next(term);
  }
}
