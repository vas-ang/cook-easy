import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryFn,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { IProduct } from 'src/app/shared/interfaces/IProduct';
import { IRecipe } from 'src/app/shared/interfaces/IRecipe';
import { IStep } from 'src/app/shared/interfaces/IStep';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Injectable()
export class RecipeService {
  private _recipeCollection: AngularFirestoreCollection<IRecipe>;

  recipes$: Observable<IRecipe[]>;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private fileUploadService: FileUploadService
  ) {
    this._recipeCollection = this.firestore.collection<IRecipe>('recipes');
    this.recipes$ = this._recipeCollection.valueChanges({
      idField: 'recipeId',
    });
  }

  getRecipesQueriedCollection(
    queryFn?: QueryFn<firebase.default.firestore.DocumentData>
  ) {
    return this.firestore.collection<IRecipe>('recipes', queryFn);
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
