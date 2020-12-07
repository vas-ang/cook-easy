import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { UserControlComponent } from './user-control/user-control.component';

const exports = [HeaderComponent];

@NgModule({
  declarations: [...exports, UserControlComponent],
  imports: [CommonModule, RouterModule, NgbCollapseModule],
  exports: exports,
})
export class CoreModule {}
