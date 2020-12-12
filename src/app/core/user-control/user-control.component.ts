import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css'],
})
export class UserControlComponent {
  isLogged$ = this.auth.isLogged$;
  currentUser$ = this.auth.currentUser$;

  constructor(private auth: AuthService, private router: Router) {}

  logoutHandler() {
    this.auth.logout$().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
