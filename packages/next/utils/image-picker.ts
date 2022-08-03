// Got some inspiration from https://github.com/expo/expo/blob/master/packages/expo-image-picker/src/ExponentImagePicker.web.ts
export const imagePicker = async () => {
  const result = await openFileBrowserAsync({
    mediaTypes: 'jpg',
    allowsMultipleSelection: true,
    capture: true,
    base64: true
  });

  return result;
};

function openFileBrowserAsync({
  mediaTypes,
  capture = false,
  allowsMultipleSelection = false,
  base64
}) {
  const mediaTypeFormat = mediaTypes;

  const input = document.createElement('input');
  input.style.display = 'none';
  input.setAttribute('type', 'file');
  input.setAttribute('accept', mediaTypeFormat);
  input.setAttribute('id', 'whateverid');
  if (allowsMultipleSelection) {
    input.setAttribute('multiple', 'multiple');
  }
  if (capture) {
    input.setAttribute('capture', 'camera');
  }
  document.body.appendChild(input);

  return new Promise((resolve, reject) => {
    input.addEventListener('change', async () => {
      if (input.files) {
        if (!allowsMultipleSelection) {
          const img = await readFile(input.files[0], { base64 });
          resolve({ ...img });
        } else {
          const imgs = await Promise.all(
            Array.from(input.files).map(file => readFile(file, { base64 }))
          );
          resolve({
            cancelled: false,
            selected: imgs
          });
        }
      }
      document.body.removeChild(input);
    });

    const event = new MouseEvent('click');
    input.dispatchEvent(event);
  });
}

function readFile(targetFile: Blob, options: { base64: boolean }) {
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
      const uri = (target as any).result;
      const returnRaw = () =>
        resolve({
          uri,
          width: 0,
          height: 0,
          cancelled: false
        });

      if (typeof uri === 'string') {
        const image = new Image();
        image.src = uri;
        image.onload = () =>
          resolve({
            uri,
            width: image.naturalWidth ?? image.width,
            height: image.naturalHeight ?? image.height,
            cancelled: false,
            // The blob's result cannot be directly decoded as Base64 without
            // first removing the Data-URL declaration preceding the
            // Base64-encoded data. To retrieve only the Base64 encoded string,
            // first remove data:*/*;base64, from the result.
            // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
            ...(options.base64 && { base64: uri.substr(uri.indexOf(',') + 1) })
          });
        image.onerror = () => returnRaw();
      } else {
        returnRaw();
      }
    };

    reader.readAsDataURL(targetFile);
  });
}
