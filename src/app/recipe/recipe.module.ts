import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecipeService } from './services/recipe.service';
import { FileUploadService } from '../shared/services/file-upload.service';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { UserDetailsService } from '../shared/services/user-details.service';
import { RecipeStepComponent } from './recipe-step/recipe-step.component';

@NgModule({
  declarations: [
    CreateRecipeComponent,
    RecipeListComponent,
    RecipeDetailsComponent,
    RecipeStepComponent,
  ],
  providers: [RecipeService, FileUploadService, UserDetailsService],
  imports: [CommonModule, ReactiveFormsModule, RecipeRoutingModule, NgbModule],
})
export class RecipeModule {}
