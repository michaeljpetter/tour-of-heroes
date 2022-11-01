import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { has, isString } from 'lodash/fp';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  term = new FormControl<string | Hero>('');
  results?: Observable<Hero[]>;

  constructor(private heroService: HeroService, private router: Router) { }

  ngOnInit(): void {
    this.results = this.term.valueChanges.pipe(
      filter(isString),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.heroService.search(term))
    );

    this.term.valueChanges.pipe(
      filter(has('id')),
    ).subscribe(({ id }: any) => {
      this.term.reset('');
      this.router.navigate(['/heroes', id]);
    });
  }

  heroName(hero: Hero) {
    return hero?.name;
  }
}
