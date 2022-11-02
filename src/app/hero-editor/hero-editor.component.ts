import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-editor',
  templateUrl: './hero-editor.component.html',
  styleUrls: ['./hero-editor.component.scss']
})
export class HeroEditorComponent implements OnInit {
  @Input() title!: string;
  @Input() initialValues?: Hero;
  @Input() submitText!: string;
  @Output() submitted = new EventEmitter<Hero>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.initialValues?.name, [Validators.required, Validators.pattern(/\S+/)]],
      tagline: this.initialValues?.tagline
    });
  }

  submit() {
    const hero = {
      ...this.initialValues,
      name: this.form.get('name')!.value.trim(),
      tagline: this.form.get('tagline')!.value?.trim(),
    };

    this.submitted.emit(hero as Hero);
  }
}
