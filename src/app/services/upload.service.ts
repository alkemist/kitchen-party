import {Injectable} from '@angular/core';
import {FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {LoggedError, LoggerService} from "./logger.service";
import {generatePushID} from "../tools/generate-pushid";

export class NotFoundUploadError extends LoggedError<string> {
  override type = 'Upload';
  override message = 'File not found';

  constructor(public override context: string) {
    super();
  }
}

export class UploadError extends LoggedError<File> {
  override type = 'Upload';
  override message = 'Upload error';

  constructor(public override context: File) {
    super();
  }
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly basePath = 'upload';
  private readonly storage: FirebaseStorage;

  constructor(private loggerService: LoggerService) {
    this.storage = getStorage();
  }

  async download(image: string): Promise<string | undefined> {
    try {
      const refImage = ref(this.storage, `${this.basePath}/${image}`);
      return await getDownloadURL(refImage);
    } catch (e) {
      this.loggerService.error(new NotFoundUploadError(image));
      return undefined;
    }
  }

  upload(localFile: File): Promise<{ name: string, path: string } | undefined> {
    return new Promise<{ name: string, path: string } | undefined>(resolve => {
      try {
        const localFileName = localFile.name.split('.');

        if (localFileName.length > 1) {
          const fileName = `${generatePushID()}.${localFileName.pop()}`;
          const file = new File([localFile], fileName, {type: localFile.type});

          const refImage = ref(this.storage, `${this.basePath}/${file.name}`);
          uploadBytes(refImage, file).then(async (snapshot) => {
            const imagePath = await this.download(snapshot.ref.name);
            resolve({name: fileName, path: imagePath!});
          });
        } else {
          resolve(undefined);
        }
      } catch (e) {
        this.loggerService.error(new UploadError(localFile));
        resolve(undefined);
      }
    });
  }


}
