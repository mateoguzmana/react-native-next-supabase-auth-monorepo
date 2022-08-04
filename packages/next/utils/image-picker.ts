// Got some inspiration from https://github.com/expo/expo/blob/master/packages/expo-image-picker/src/ExponentImagePicker.web.ts
export declare type Callback = (response: ImagePickerResponse) => any;
export interface ImageLibraryOptions {
  selectionLimit?: number;
  mediaType: MediaType;
  maxWidth?: number;
  maxHeight?: number;
  quality?: PhotoQuality;
  videoQuality?: AndroidVideoOptions | iOSVideoOptions;
  includeBase64?: boolean;
  includeExtra?: boolean;
  presentationStyle?:
    | 'currentContext'
    | 'fullScreen'
    | 'pageSheet'
    | 'formSheet'
    | 'popover'
    | 'overFullScreen'
    | 'overCurrentContext';
}
export interface CameraOptions
  extends Omit<ImageLibraryOptions, 'selectionLimit'> {
  durationLimit?: number;
  saveToPhotos?: boolean;
  cameraType?: CameraType;
}
export interface Asset {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  type?: string;
  fileName?: string;
  duration?: number;
  bitrate?: number;
  timestamp?: string;
  id?: string;
}
export interface ImagePickerResponse {
  didCancel?: boolean;
  errorCode?: ErrorCode;
  errorMessage?: string;
  assets?: Asset[];
}
export declare type PhotoQuality =
  | 0
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1;
export declare type CameraType = 'back' | 'front';
export declare type MediaType = 'photo' | 'video' | 'mixed';
export declare type AndroidVideoOptions = 'low' | 'high';
export declare type iOSVideoOptions = 'low' | 'medium' | 'high';
export declare type ErrorCode = 'camera_unavailable' | 'permission' | 'others';

// @TODO: Image types are not working and also check video

const DEFAULT_OPTIONS: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo',
  videoQuality: 'high',
  quality: 1,
  maxWidth: 0,
  maxHeight: 0,
  includeBase64: false,
  cameraType: 'back',
  selectionLimit: 1,
  saveToPhotos: false,
  durationLimit: 0,
  includeExtra: false,
  presentationStyle: 'pageSheet'
};

export const imagePicker = async () => {
  const result = await launchImageLibrary({
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: true
  });

  return result;
};

export function launchCamera(
  options: ImageLibraryOptions = DEFAULT_OPTIONS,
  callback?: Callback
): Promise<ImagePickerResponse> {
  return new Promise(resolve => {
    const result = {
      errorCode: 'camera_unavailable' as ErrorCode,
      errorMessage: 'launchCamera is not supported for web yet'
    };

    if (callback) callback(result);

    resolve(result);
  });

  // @TODO: Might work but needs to be tested
  // const input = document.createElement('input');
  // input.style.display = 'none';
  // input.setAttribute('type', 'file');
  // input.setAttribute('accept', options.mediaType);
  // input.setAttribute('id', 'whateverid');
  // if (options.selectionLimit > 1) {
  //   input.setAttribute('multiple', 'multiple');
  // }

  // input.setAttribute('capture', 'camera');

  // document.body.appendChild(input);

  // return new Promise(resolve => {
  //   input.addEventListener('change', async () => {
  //     if (input.files) {
  //       if (options.selectionLimit <= 1) {
  //         const img = await readFileForRNWeb(input.files[0], {
  //           includeBase64: options.includeBase64
  //         });

  //         const result = { assets: [img] };

  //         if (callback) callback(result);

  //         resolve(result);
  //       } else {
  //         const imgs = await Promise.all(
  //           Array.from(input.files).map(file =>
  //             readFileForRNWeb(file, { includeBase64: options.includeBase64 })
  //           )
  //         );

  //         const result = {
  //           didCancel: false,
  //           assets: imgs
  //         };

  //         if (callback) callback(result);

  //         resolve(result);
  //       }
  //     }
  //     document.body.removeChild(input);
  //   });

  //   const event = new MouseEvent('click');
  //   input.dispatchEvent(event);
  // });
}

export function launchImageLibrary(
  options: ImageLibraryOptions = DEFAULT_OPTIONS,
  callback?: Callback
): Promise<ImagePickerResponse> {
  const input = document.createElement('input');
  input.style.display = 'none';
  input.setAttribute('type', 'file');
  input.setAttribute('accept', options.mediaType);
  input.setAttribute('id', 'whateverid');

  if (options.selectionLimit > 1) {
    input.setAttribute('multiple', 'multiple');
  }

  document.body.appendChild(input);

  return new Promise(resolve => {
    input.addEventListener('change', async () => {
      if (input.files) {
        if (options.selectionLimit <= 1) {
          const img = await readFileForRNWeb(input.files[0], {
            includeBase64: options.includeBase64
          });

          const result = { assets: [img] };

          if (callback) callback(result);

          resolve(result);
        } else {
          const imgs = await Promise.all(
            Array.from(input.files).map(file =>
              readFileForRNWeb(file, { includeBase64: options.includeBase64 })
            )
          );

          const result = {
            didCancel: false,
            assets: imgs
          };

          if (callback) callback(result);

          resolve(result);
        }
      }
      document.body.removeChild(input);
    });

    const event = new MouseEvent('click');
    input.dispatchEvent(event);
  });
}

function readFileForRNWeb(
  targetFile: Blob,
  options: Partial<ImageLibraryOptions>
): Promise<Asset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(
        new Error(
          `Failed to read the selected media because the operation failed.`
        )
      );
    };
    reader.onload = ({ target }) => {
      const uri = target.result;

      const returnRaw = () =>
        resolve({
          uri: uri as string,
          width: 0,
          height: 0
        });

      if (typeof uri === 'string') {
        const image = new Image();
        image.src = uri;
        image.onload = () =>
          resolve({
            uri,
            width: image.naturalWidth ?? image.width,
            height: image.naturalHeight ?? image.height,
            // The blob's result cannot be directly decoded as Base64 without
            // first removing the Data-URL declaration preceding the
            // Base64-encoded data. To retrieve only the Base64 encoded string,
            // first remove data:*/*;base64, from the result.
            // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
            ...(options.includeBase64 && {
              base64: uri.substr(uri.indexOf(',') + 1)
            })
          });
        image.onerror = () => returnRaw();
      } else {
        returnRaw();
      }
    };

    reader.readAsDataURL(targetFile);
  });
}
