/**
 * @format
 */
import './src/config/ReactotronConfig';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.disableYellowBox = false;

AppRegistry.registerComponent(appName, () => App);