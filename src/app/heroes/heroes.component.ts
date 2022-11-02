import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.refreshHeroes();
  }

  refreshHeroes() {
    this.heroService.getAll().subscribe(heroes => this.heroes = heroes);
  }

  add(name: string) {
    const sanitizedName = name.trim();
    if(!sanitizedName) return;
    this.heroService.add({ name: sanitizedName } as Hero)
      .subscribe(() => this.refreshHeroes());
  }

  delete({ id }: Hero) {
    this.heroService.remove(id)
      .subscribe(() => this.refreshHeroes());
  }
}
