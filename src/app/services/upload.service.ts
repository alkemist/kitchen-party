import {Injectable} from '@angular/core';
import {FirebaseStorage, getDownloadURL, getStorage, ref, StorageReference} from "firebase/storage";

export interface FileUploadInterface {
  key: string;
  name: string;
  url: string;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly basePath = 'upload';
  private readonly storage: FirebaseStorage;

  constructor() {
    this.storage = getStorage();
  }

  async download() {
    const refImage: StorageReference = ref(this.storage, `${this.basePath}/illustration.jpg`);
    const ref404: StorageReference = ref(this.storage, `${this.basePath}/404.jpg`);
    try {
      console.log(await getDownloadURL(refImage));
      console.log(await getDownloadURL(ref404));
    } catch (e) {
      console.log(e);
    }
  }

  upload(file: FileUploadInterface) {

  }

}
