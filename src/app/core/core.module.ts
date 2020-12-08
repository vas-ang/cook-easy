import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserControlComponent } from './user-control/user-control.component';
import { AuthService } from './services/auth.service';

const importsExports = [HeaderComponent];

@NgModule({
  declarations: [...importsExports, UserControlComponent],
  imports: [CommonModule, NgbModule, RouterModule],
  providers: [AuthService],
  exports: importsExports,
})
export class CoreModule {}
