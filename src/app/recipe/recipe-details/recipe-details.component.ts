import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, merge, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IRecipe } from 'src/app/shared/interfaces/IRecipe';
import { IUserInfo } from 'src/app/shared/interfaces/IUserInfo';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css'],
})
export class RecipeDetailsComponent implements OnInit {
  recipeInfo$: Observable<{
    recipe: IRecipe | undefined;
    user: IUserInfo | undefined;
  }> = EMPTY;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private userDetailsService: UserDetailsService
  ) {}

  ngOnInit(): void {
    this.recipeInfo$ = this.recipeService
      .getRecipe(this.route.snapshot.params['id'])
      .pipe(
        switchMap((recipe) => {
          return this.userDetailsService
            .getUserDetails$(recipe?.creatorId)
            .pipe(
              map((user) => {
                return { recipe, user };
              })
            );
        })
      );
  }
}
