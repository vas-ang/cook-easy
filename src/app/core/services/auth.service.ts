import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { map, tap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserInfo } from 'src/app/shared/interfaces/IUserInfo';
import { UserDetailsService } from 'src/app/shared/services/user-details.service';
import { Guid } from 'src/app/shared/helpers';

@Injectable()
export class AuthService {
  currentUserSnapshot: firebase.default.User | null = null;

  currentUser$ = this.auth.user;
  isLogged$ = this.currentUser$.pipe(map((user) => user !== null));

  constructor(
    private auth: AngularFireAuth,
    private userDetailsService: UserDetailsService,
    private fileUploadService: FileUploadService
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUserSnapshot = user;
    });
  }

  changeEmail$(newEmail: string) {
    this._nullUserValidator();

    return from(this.currentUserSnapshot!.updateEmail(newEmail));
  }

  changeUsername$(newUsername: string) {
    return new Observable<void>(() => {
      this._nullUserValidator();
      this.currentUserSnapshot!.updateProfile({ displayName: newUsername });
      const userInfo: IUserInfo = {
        displayName: newUsername,
        photoURL: this.currentUserSnapshot!.photoURL,
      };

      this.userDetailsService.setUserCredentials(
        this.currentUserSnapshot!.uid,
        userInfo
      );
      return;
    });
  }

  changePassword$(newPassword: string) {
    this._nullUserValidator();
    return from(this.currentUserSnapshot!.updatePassword(newPassword));
  }

  changeProfilePicture$(data: File) {
    this._nullUserValidator();
    return from(
      this.fileUploadService.uploadImage(
        `profilePictures/${Guid.newGuid() + data.name}`,
        data
      )
    ).pipe(
      tap((photoURL) => {
        const displayName = this.currentUserSnapshot!.displayName;
        this.userDetailsService.setUserCredentials(
          this.currentUserSnapshot!.uid,
          {
            photoURL,
            displayName,
          }
        );
        this.currentUserSnapshot!.updateProfile({
          photoURL,
        });
      })
    );
  }

  login$(email: string, password: string) {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  register$(email: string, username: string, password: string) {
    return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(
      tap((credential) => {
        const user = credential.user;
        if (user !== null) {
          user.updateProfile({
            displayName: username,
            photoURL: environment.defaultProfilePictureUrl,
          });

          const userInfo: IUserInfo = {
            displayName: username,
            photoURL: environment.defaultProfilePictureUrl,
          };

          this.userDetailsService.setUserCredentials(user.uid, userInfo);
        }
      })
    );
  }

  logout$() {
    return from(this.auth.signOut());
  }

  private _nullUserValidator() {
    if (this.currentUserSnapshot === null) {
      throw new Error('User is null.');
    }
  }
}
