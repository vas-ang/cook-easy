import { Component } from '@angular/core';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css'],
})
export class UserControlComponent {
  isLoggedIn = false;

  constructor() {}
}
