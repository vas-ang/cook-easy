import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css'],
})
export class CreateRecipeComponent {
  private _imageFile: File | null = null;

  form: FormGroup;
  imageName: string = 'Choose file...';
  imagePreview: ArrayBuffer | string | null = null;

  get nameControl() {
    return this.form.get('name');
  }

  get imageControl() {
    return this.form.get('image');
  }

  get shortDescControl() {
    return this.form.get('shortDesc');
  }

  get difficultyControl() {
    return this.form.get('difficulty');
  }

  get productsArray() {
    const ingredientsArray = this.form.get('products');

    return ingredientsArray === null ? null : (ingredientsArray as FormArray);
  }

  get stepsArray() {
    const stepsArray = this.form.get('steps');

    return stepsArray === null ? null : (stepsArray as FormArray);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recipeService: RecipeService
  ) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      image: ['', [Validators.required]],
      shortDesc: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(200),
        ],
      ],
      difficulty: ['', [Validators.required]],
      products: this.fb.array([this._generateProductControl()]),
      steps: this.fb.array([this._generateStepControl()]),
    });
  }

  submitHandler() {
    if (this._imageFile === null) {
      console.error();
      return;
    }

    const { name, shortDesc, difficulty, products, steps } = this.form.value;

    this.recipeService
      .addRecipe$(name, this._imageFile, shortDesc, difficulty, products, steps)
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: () => {
          console.error();
        },
      });
  }

  previewHandler(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);

    if (file === undefined) {
      return;
    } else if (
      file === null ||
      !/.+\.(png|jpg|jpeg)/.test(file.name.toLocaleLowerCase())
    ) {
      console.error('Invalid image!');
      return;
    }

    this._imageFile = file;
    this.imageName = file.name;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (reader.result !== null) {
        this.imagePreview = reader.result;
      }
    };
  }

  addProduct() {
    this.productsArray?.push(this._generateProductControl());
  }

  removeProduct(index: number) {
    this.productsArray?.removeAt(index);
  }

  addStep() {
    this.stepsArray?.push(this._generateStepControl());
  }

  removeStep(index: number) {
    this.stepsArray?.removeAt(index);
  }

  private _generateProductControl() {
    return this.fb.group({
      quantity: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  private _generateStepControl() {
    return this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
    });
  }
}
