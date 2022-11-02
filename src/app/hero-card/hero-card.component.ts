import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss']
})
export class HeroCardComponent {
  @Input() hero!: Hero;
  @Input() clickable = true;
  @Input() showActions = true;
  @Output() deleted = new EventEmitter();

  constructor(private heroService: HeroService, private router: Router) { }

  edit() {
    this.router.navigate(['/heroes', this.hero.id, 'edit']);
  }

  delete() {
    this.heroService.remove(this.hero.id)
      .subscribe(() => this.deleted.emit());
  }
}
