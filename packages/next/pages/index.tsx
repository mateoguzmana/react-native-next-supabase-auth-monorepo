// Many libraries in the React ecosystem use the setImmediate() API (like react-native-reanimated),
// which Next.js doesn't polyfill by default.
import 'setimmediate';

import { App } from '@react-native-next-monorepo/app';
import { imagePicker } from '../utils/image-picker';

const AppWrapper = () => <App imagePicker={imagePicker} />;

export default AppWrapper;
