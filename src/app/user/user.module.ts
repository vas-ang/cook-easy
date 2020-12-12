import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../core/services/auth.service';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from '../core/guards/auth.guard';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, SettingsComponent],
  providers: [AuthService, AuthGuard],
  imports: [CommonModule, ReactiveFormsModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
