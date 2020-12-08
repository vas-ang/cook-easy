import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private auth: AngularFireAuth) {}

  login(email: string, password: string) {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  register(email: string, password: string) {
    return from(this.auth.createUserWithEmailAndPassword(email, password));
  }
}
