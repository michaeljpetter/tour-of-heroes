import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-new-hero',
  templateUrl: './new-hero.component.html',
  styleUrls: ['./new-hero.component.scss']
})
export class NewHeroComponent {
  constructor(private heroService: HeroService, private router: Router) { }

  submitted(hero: Hero) {
    this.heroService.add(hero)
      .subscribe(() => this.router.navigateByUrl('/heroes'));
  }
}
