import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { IRecipe } from 'src/app/shared/interfaces/IRecipe';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private currentPage = 1;

  showResetBtn = false;
  recipeQuery$: Observable<IRecipe[]> | null = null;

  get recipes$() {
    return this.recipeService.recipes$;
  }

  get isFirstPage() {
    return this.currentPage === 1;
  }

  constructor(private recipeService: RecipeService, private router: Router) {}

  navigateToStart() {
    this._resetPaginationState();
  }

  previousPageHandler(first: IRecipe) {
    if (this.currentPage < 2) {
      return;
    }

    this.currentPage--;
    this.recipeService.updatePaginationData({
      recipe: first,
      action: 'backward',
    });
  }

  nextPageHandler(last: IRecipe) {
    this.currentPage++;
    this.recipeService.updatePaginationData({
      recipe: last,
      action: 'forward',
    });
  }

  viewAllClickHandler(queryInput: HTMLInputElement) {
    queryInput.value = '';
    this.showResetBtn = false;
    this._resetPaginationState();
    this.recipeService.updateNameFilter(null);
  }

  getByNameClickHandler(name: string) {
    this.showResetBtn = true;
    this._resetPaginationState();
    this.recipeService.updateNameFilter(name);
  }

  changeDifficultyFilterHandler(event: Event) {
    this._resetPaginationState();
    this.recipeService.updateDifficultyFilter(
      (event.target as HTMLSelectElement).value
    );
  }

  ngOnInit(): void {
    const nameInput = document.getElementById('queryInput') as HTMLInputElement;
    this.recipeQuery$ = fromEvent(nameInput, 'keyup').pipe(
      debounceTime(500),
      map((e) => {
        return (e.target as HTMLInputElement).value;
      }),
      switchMap((query) => {
        return this.recipeService.getQueryResults$(query);
      })
    );
  }

  ngOnDestroy(): void {
    this.recipeService.updateNameFilter(null);
    this.recipeService.updateDifficultyFilter(null);
    this._resetPaginationState();
  }

  private _resetPaginationState() {
    this.recipeService.updatePaginationData({
      action: 'forward',
    });
    this.currentPage = 1;
  }
}
