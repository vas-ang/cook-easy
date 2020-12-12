import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, map, skip, switchMap, take } from 'rxjs/operators';
import { IRecipe } from 'src/app/shared/interfaces/IRecipe';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipeQuery$: Observable<IRecipe[]> | null = null;

  get recipes$() {
    return this.recipeService.recipes$;
  }

  constructor(private recipeService: RecipeService, private router: Router) {}

  redirectClickHandler(recipeId: string | undefined) {
    this.router.navigate(['recipe', recipeId]);
  }

  ngOnInit(): void {
    const nameInput = document.getElementById('queryInput') as HTMLInputElement;
    this.recipeQuery$ = fromEvent(nameInput, 'keyup').pipe(
      debounceTime(500),
      map((e) => {
        return (e.target as HTMLInputElement).value;
      }),
      switchMap((query) => {
        if (query === null || query === '') {
          return of([]);
        }
        return this.recipeService
          .getRecipesQueriedCollection((ref) =>
            ref
              .orderBy('name')
              .startAt(query)
              .endAt(query + '\uf8ff')
          )
          .valueChanges({
            idField: 'recipeId',
          })
          .pipe(map((arr) => arr.slice(0, 5)));
      })
    );
  }
}
