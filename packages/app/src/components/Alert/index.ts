import { Alert as RNAlert, Platform } from 'react-native';

const isBrowser = () => typeof window !== 'undefined';

const Alert = (message: string) =>  isBrowser() && Platform.OS === 'web' ? window.alert(message) : RNAlert(message)

export default Alert;
