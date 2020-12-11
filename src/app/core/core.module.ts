import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserControlComponent } from './user-control/user-control.component';
import { AuthService } from './services/auth.service';
import { FileUploadService } from '../shared/services/file-upload.service';

const importsExports = [HeaderComponent];

@NgModule({
  declarations: [...importsExports, UserControlComponent],
  imports: [CommonModule, RouterModule, NgbModule],
  providers: [AuthService, FileUploadService],
  exports: importsExports,
})
export class CoreModule {}
