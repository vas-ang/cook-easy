import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-step',
  templateUrl: './recipe-step.component.html',
  styleUrls: ['./recipe-step.component.css'],
})
export class RecipeStepComponent {
  isCollapsed: boolean = true;

  @Input() title: string = '';
  @Input() content: string = '';

  constructor() {}
}
