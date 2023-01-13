/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import React from 'react';

const isAndroid = require('react-native').Platform.OS === 'android';
const isHermesEnabled = !!global.HermesInternal;


// polyfills as described here https://github.com/web-ridge/react-native-paper-dates/releases/tag/v0.2.15
require("@formatjs/intl-getcanonicallocales/polyfill");
require("@formatjs/intl-locale/polyfill");

require('@formatjs/intl-pluralrules/polyfill');
require("@formatjs/intl-pluralrules/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-pluralrules/locale-data/it.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-pluralrules/locale-data/es.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-pluralrules/locale-data/pt.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-pluralrules/locale-data/de.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-pluralrules/locale-data/fr.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

require('@formatjs/intl-displaynames/polyfill');
require("@formatjs/intl-displaynames/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-displaynames/locale-data/it.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-displaynames/locale-data/es.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-displaynames/locale-data/pt.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-displaynames/locale-data/de.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-displaynames/locale-data/fr.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

require("@formatjs/intl-listformat/polyfill");
require("@formatjs/intl-listformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-listformat/locale-data/it.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-listformat/locale-data/es.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-listformat/locale-data/pt.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-listformat/locale-data/de.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-listformat/locale-data/fr.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

require('@formatjs/intl-numberformat/polyfill');
require("@formatjs/intl-numberformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-numberformat/locale-data/it.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-numberformat/locale-data/es.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-numberformat/locale-data/pt.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-numberformat/locale-data/de.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-numberformat/locale-data/fr.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

require("@formatjs/intl-relativetimeformat/polyfill");
require("@formatjs/intl-relativetimeformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-relativetimeformat/locale-data/it.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-relativetimeformat/locale-data/es.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-relativetimeformat/locale-data/pt.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-relativetimeformat/locale-data/de.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-relativetimeformat/locale-data/fr.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

require("@formatjs/intl-datetimeformat/polyfill");
require("@formatjs/intl-datetimeformat/locale-data/en.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-datetimeformat/locale-data/it.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-datetimeformat/locale-data/es.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-datetimeformat/locale-data/pt.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-datetimeformat/locale-data/de.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT
require("@formatjs/intl-datetimeformat/locale-data/fr.js"); // USE YOUR OWN LANGUAGE OR MULTIPLE IMPORTS YOU WANT TO SUPPORT

require("@formatjs/intl-datetimeformat/add-golden-tz.js");

// https://formatjs.io/docs/polyfills/intl-datetimeformat/#default-timezone
const RNLocalize = require("react-native-localize");
if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
  Intl.DateTimeFormat.__setDefaultTimeZone(RNLocalize.getTimeZone());
}

// Callback called when notification received by device in background state
messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (__DEV__){
    console.log('Message handled in the background!', remoteMessage);
  }
});

// Required for Firebase, as per the doc https://rnfirebase.io/messaging/usage#background-application-state
function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

