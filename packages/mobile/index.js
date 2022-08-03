import 'react-native-url-polyfill/auto'
import { AppRegistry } from 'react-native';
import { AppWrapper } from './src';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppWrapper);
