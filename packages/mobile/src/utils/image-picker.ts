import { launchImageLibrary } from 'react-native-image-picker';

export const imagePicker = async () => {
  const result = await launchImageLibrary({ selectionLimit: 1, mediaType: 'photo' });

  return result
};
