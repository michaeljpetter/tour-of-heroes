import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-new-hero',
  templateUrl: './new-hero.component.html',
  styleUrls: ['./new-hero.component.scss']
})
export class NewHeroComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder, private heroService: HeroService, private router: Router) {
    this.form = formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/\S+/)]]
    });
  }

  submit() {
    const hero = {
      name: this.form.get('name')?.value.trim()
    };

    this.heroService.add(hero as Hero)
      .subscribe(() => this.router.navigateByUrl('/heroes'));
  }
}
