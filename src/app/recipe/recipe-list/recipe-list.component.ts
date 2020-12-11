import { Component } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  get recipes$() {
    return this.recipeService.recipes$;
  }

  constructor(private recipeService: RecipeService) {}
}
