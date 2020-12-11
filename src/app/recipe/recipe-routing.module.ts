import { RouterModule, Routes } from '@angular/router';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';

const routes: Routes = [
  {
    path: 'recipe',
    children: [
      {
        path: 'create',
        component: CreateRecipeComponent,
      },
    ],
  },
];

export const RecipeRoutingModule = RouterModule.forChild(routes);
