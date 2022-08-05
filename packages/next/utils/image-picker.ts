// I created this image picker functions here to be able to get images from the browser.
// Got some inspiration from https://github.com/expo/expo/blob/master/packages/expo-image-picker/src/ExponentImagePicker.web.ts
// But I have created a PR to add it to the react-native-image-picker package so bare with me!
// https://github.com/react-native-image-picker/react-native-image-picker/pull/2014
type Callback = (response: ImagePickerResponse) => any;

interface ImageLibraryOptions {
  selectionLimit?: number;
  mediaType: MediaType;
  includeBase64?: boolean;
}

interface Asset {
  base64?: string;
  uri?: string;
  width?: number;
  height?: number;
}

interface ImagePickerResponse {
  didCancel?: boolean;
  assets?: Asset[];
}

type MediaType = 'image/*';

const DEFAULT_OPTIONS: ImageLibraryOptions = {
  mediaType: 'image/*',
  includeBase64: true,
  selectionLimit: 1
};

export const imagePicker = async () => {
  const result = await launchImageLibrary();

  return result;
};

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
          const img = await readFile(input.files[0], {
            includeBase64: options.includeBase64
          });

          const result = { assets: [img] };

          if (callback) callback(result);

          resolve(result);
        } else {
          const imgs = await Promise.all(
            Array.from(input.files).map(file =>
              readFile(file, { includeBase64: options.includeBase64 })
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

function readFile(
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
