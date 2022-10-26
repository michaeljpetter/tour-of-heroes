import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService, CancelFunction } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit, OnDestroy {
  cancelRefresh?: CancelFunction;
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    const all = this.heroService.getAllAutoRefresh(1000);
    this.cancelRefresh = all.cancel;
    all.subscribe(heroes => this.heroes = heroes);
  }

  ngOnDestroy(): void {
    (this.cancelRefresh)?.();
  }

  add(name: string) {
    const sanitizedName = name.trim();
    if(!sanitizedName) return;
    this.heroService.add({ name: sanitizedName } as Hero).subscribe();
  }

  delete({ id }: Hero) {
    this.heroService.remove(id).subscribe();
  }
}
