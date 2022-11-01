import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  hero?: Observable<Hero | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private heroService: HeroService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(({ id }: any) => {
      this.hero = this.heroService.get(id);
    });
  }

  save(hero: Hero) {
    this.heroService.update(hero)
      .subscribe(() => this.router.navigate(['heroes']));
  }
}
