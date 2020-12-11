import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { finalize, map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUserInfo } from 'src/app/shared/interfaces/IUserInfo';

@Injectable()
export class AuthService {
  public currentUser$ = this.auth.user;
  public isLogged$ = this.currentUser$.pipe(map((user) => user !== null));

  constructor(
    private auth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private fileUploadService: FileUploadService
  ) {}

  changeEmail(newEmail: string) {
    return this.auth.user.pipe(
      tap((user) => {
        if (user !== null) {
          user.updateEmail(newEmail);
        }
      })
    );
  }

  changeUsername(newUsername: string) {
    return this.auth.user.pipe(
      tap((user) => {
        if (user !== null) {
          user.updateProfile({
            displayName: newUsername,
          });
          const userInfo: IUserInfo = {
            displayName: newUsername,
            photoURL: user.photoURL,
          };

          this.angularFirestore
            .collection<IUserInfo>('users')
            .doc(user.uid)
            .set(userInfo);
        }
      })
    );
  }

  changePassword(newPassword: string) {
    return this.auth.user.pipe(
      tap((user) => {
        if (user !== null) {
          user.updatePassword(newPassword);
        }
      })
    );
  }

  changeProfilePicture(data: File) {
    return this.auth.user.pipe(
      tap((user) => {
        if (user !== null) {
          const filePath = `/profilePictures/${user.uid}/${data.name}`;

          this.fileUploadService
            .uploadImage(filePath, data)
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.fileUploadService
                  .getFileRef(filePath)
                  .getDownloadURL()
                  .subscribe({
                    next: (path) => {
                      if (user !== null) {
                        user.updateProfile({
                          photoURL: path,
                        });

                        const userInfo: IUserInfo = {
                          displayName: user.displayName,
                          photoURL: path,
                        };

                        this.angularFirestore
                          .collection<IUserInfo>('users')
                          .doc(user.uid)
                          .set(userInfo);
                      }
                    },
                  });
              })
            )
            .subscribe();
        }
      })
    );
  }

  login(email: string, password: string) {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  register(email: string, username: string, password: string) {
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

          this.angularFirestore
            .collection<IUserInfo>('users')
            .doc(user.uid)
            .set(userInfo);
        }
      })
    );
  }

  logout() {
    return from(this.auth.signOut());
  }
}
