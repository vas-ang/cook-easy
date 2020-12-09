import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable()
export class FileUploadService {
  constructor(private storage: AngularFireStorage) {}

  uploadImage(path: string, data: any) {
    return this.storage.upload(path, data);
  }

  getFileRef(path: string) {
    return this.storage.ref(path);
  }
}
