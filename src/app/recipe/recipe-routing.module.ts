import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
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
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'recipe/:id',
    component: RecipeDetailsComponent,
  },
];

export const RecipeRoutingModule = RouterModule.forChild(routes);
