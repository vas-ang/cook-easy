import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecipeService } from './services/recipe.service';
import { FileUploadService } from '../shared/services/file-upload.service';

@NgModule({
  declarations: [CreateRecipeComponent],
  providers: [RecipeService, FileUploadService],
  imports: [CommonModule, ReactiveFormsModule, RecipeRoutingModule, NgbModule],
})
export class RecipeModule {}
