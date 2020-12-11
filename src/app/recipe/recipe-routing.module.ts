import { RouterModule, Routes } from '@angular/router';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';

const routes: Routes = [
  {
    path: 'recipe',
    children: [
      {
        path: 'list',
        component: RecipeListComponent,
      },
      {
        path: 'create',
        component: CreateRecipeComponent,
      },
    ],
  },
];

export const RecipeRoutingModule = RouterModule.forChild(routes);
