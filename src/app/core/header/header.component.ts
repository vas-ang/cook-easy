import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuCollapsed = true;

  constructor() {}

  menuClickHandler() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  collapseMenu() {
    this.isMenuCollapsed = true;
  }
}
