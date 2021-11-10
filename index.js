/**
 * @format
 */

import {AppRegistry, Text} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
console.disableYellowBox = true;
console.ignoredYellowBox = true;
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
