import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss']
})
export class HeroCardComponent {
  @Input() hero!: Hero;
  @Input() showActions = true;

  constructor(private heroService: HeroService) { }

  delete() {
    this.heroService.remove(this.hero.id).subscribe();
  }
}
