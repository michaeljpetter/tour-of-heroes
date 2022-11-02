import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-edit-hero',
  templateUrl: './edit-hero.component.html',
  styleUrls: ['./edit-hero.component.scss']
})
export class EditHeroComponent implements OnInit {
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

  submitted(hero: Hero) {
    this.heroService.update(hero)
      .subscribe(() => this.router.navigateByUrl('/heroes'));
  }
}
