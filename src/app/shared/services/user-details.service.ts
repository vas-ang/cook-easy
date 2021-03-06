import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { IUserInfo } from '../interfaces/IUserInfo';

@Injectable()
export class UserDetailsService {
  private _usersCollection: AngularFirestoreCollection<IUserInfo>;

  constructor(private angularFirestore: AngularFirestore) {
    this._usersCollection = this.angularFirestore.collection<IUserInfo>(
      'users'
    );
  }

  setUserCredentials(userId: string, userInfo: IUserInfo) {
    this._usersCollection.doc(userId).set(userInfo);
  }

  getUserDetails$(userId: string | undefined) {
    return this._usersCollection.doc(userId).valueChanges();
  }
}
