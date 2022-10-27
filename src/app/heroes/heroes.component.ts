import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes?: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.heroes = this.heroService.getAll();
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
