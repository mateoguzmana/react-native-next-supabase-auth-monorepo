import App from '@react-native-next-monorepo/app/src';
import React from 'react';
import { imagePicker } from './utils/image-picker';

export function AppWrapper() {
  return <App imagePicker={imagePicker} />;
}
