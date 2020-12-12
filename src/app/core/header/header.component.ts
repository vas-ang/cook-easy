import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuCollapsed = true;

  get isLoggedIn() {
    return this.authService.currentUserSnapshot !== null;
  }

  constructor(private authService: AuthService) {}

  menuClickHandler() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  collapseMenu() {
    this.isMenuCollapsed = true;
  }
}
