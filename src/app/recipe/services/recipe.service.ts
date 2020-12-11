import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { Guid } from 'src/app/shared/helpers';
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

  addRecipe(
    name: string,
    image: File,
    shortDesc: string,
    difficulty: string,
    products: IProduct[],
    steps: IStep[]
  ) {
    return this.authService.currentUser$.pipe(
      tap((user) => {
        if (user !== null) {
          const filePath = `${Guid.newGuid()}${image.name}`;

          this.fileUploadService
            .uploadImage(filePath, image)
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.fileUploadService
                  .getFileRef(filePath)
                  .getDownloadURL()
                  .pipe(
                    tap((url) => {
                      this._recipeCollection.doc().set({
                        creatorId: user.uid,
                        name,
                        imageUrl: url,
                        shortDesc,
                        difficulty,
                        products,
                        steps,
                      } as IRecipe);
                    })
                  )
                  .subscribe();
              })
            )
            .subscribe();
        }
      })
    );
  }

  getRecipe(recipeId: string) {
    return this._recipeCollection.doc(recipeId).valueChanges();
  }
}
