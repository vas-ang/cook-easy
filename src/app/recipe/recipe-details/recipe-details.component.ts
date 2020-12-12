import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
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

  get currentUser$() {
    return this.authService.currentUser$;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private userDetailsService: UserDetailsService
  ) {}

  deleteClickHandler() {
    this.recipeService
      .deleteRecipe$(this.currentRoute.snapshot.params['id'])
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
      });
  }

  ngOnInit(): void {
    this.recipeInfo$ = this.recipeService
      .getRecipe$(this.currentRoute.snapshot.params['id'])
      .pipe(
        switchMap((recipe) => {
          return this.userDetailsService
            .getUserDetails$(recipe?.creatorId)
            .pipe(
              map((user) => {
                if (user === undefined) {
                  this.router.navigate(['/home']);
                }

                return { recipe, user };
              })
            );
        })
      );
  }
}
