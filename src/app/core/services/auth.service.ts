import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable()
export class AuthService {
  get user$() {
    return this.auth.user;
  }

  constructor(private auth: AngularFireAuth) {}

  logout$() {
    return from(this.auth.signOut());
  }
}
