import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable()
export class FileUploadService {
  constructor(private storage: AngularFireStorage) {}

  async uploadImage(path: string, data: any) {
    await this.storage.upload(path, data);
    return (await this.storage
      .ref(path)
      .getDownloadURL()
      .toPromise()) as string;
  }
}
