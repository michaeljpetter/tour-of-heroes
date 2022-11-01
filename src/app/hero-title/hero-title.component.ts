import { Component, Input } from '@angular/core';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-title',
  templateUrl: './hero-title.component.html',
  styleUrls: ['./hero-title.component.scss']
})
export class HeroTitleComponent {
  @Input() hero!: Hero;

  constructor() { }
}
