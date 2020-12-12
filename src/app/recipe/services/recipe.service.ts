import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IRecipe } from 'src/app/shared/interfaces/IRecipe';
import { IStep } from 'src/app/shared/interfaces/IStep';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Injectable()
export class RecipeService {
  private _difficultyFilter = new BehaviorSubject<string | null>(null);
  private _nameFilter = new BehaviorSubject<string | null>(null);
  private _recipeCollection: AngularFirestoreCollection<IRecipe>;

  recipes$: Observable<IRecipe[]>;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private fileUploadService: FileUploadService
  ) {
    this._recipeCollection = this.firestore.collection<IRecipe>('recipes');
    this.recipes$ = this._nameFilter.pipe(
      switchMap((name) => {
        return this._difficultyFilter.pipe(
          switchMap((difficulty) => {
            return this.firestore
              .collection<IRecipe>('recipes', (ref) => {
                let query:
                  | firebase.default.firestore.CollectionReference
                  | firebase.default.firestore.Query = ref;

                if (name !== null && name !== '') {
                  query = query.where('name', '==', name);
                }
                if (difficulty !== null && difficulty !== 'all') {
                  query = query.where('difficulty', '==', difficulty);
                }

                return query;
              })
              .valueChanges();
          })
        );
      })
    );
  }

  updateDifficultyFilter(diffType: string | null) {
    this._difficultyFilter.next(diffType);
  }

  updateNameFilter(name: string | null) {
    this._nameFilter.next(name);
  }

  getQueryResults$(query: string | null) {
    if (query === null || query === '') {
      return of([]);
    }

    return this.firestore
      .collection<IRecipe>('recipes', (ref) =>
        ref
          .orderBy('name')
          .startAt(query)
          .endAt(query + '\uf8ff')
      )
      .valueChanges({
        idField: 'recipeId',
      })
      .pipe(map((arr) => arr.slice(0, 5)));
  }

  addRecipe$(
    name: string,
    image: File,
    shortDesc: string,
    difficulty: string,
    products: IProduct[],
    steps: IStep[]
  ) {
    const user = this.authService.currentUserSnapshot;
    if (user === null) {
      throw new Error('User is not logged.');
    }

    const path = `pictures/${image.name}`;
    return from(this.fileUploadService.uploadImage(path, image)).pipe(
      switchMap((imageUrl) => {
        const recipe: IRecipe = {
          creatorId: user.uid,
          name,
          imageUrl,
          shortDesc,
          difficulty,
          products,
          steps,
        };

        return from(this._recipeCollection.add(recipe)).pipe(
          switchMap((reference) => {
            return reference.id;
          })
        );
      })
    );
  }

  getRecipe$(recipeId: string) {
    return this._recipeCollection.doc(recipeId).valueChanges();
  }
}
