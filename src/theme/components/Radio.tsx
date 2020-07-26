import { Platform } from 'react-native';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const radioTheme: any = {
    '.selected': {
      'NativeBase.IconNB': {
        color: Platform.OS === PLATFORM.IOS ? themeColor.radioColor : themeColor.radioSelectedColorAndroid,
        lineHeight: Platform.OS === PLATFORM.IOS ? 25 : themeColor.radioBtnLineHeight,
        height: Platform.OS === PLATFORM.IOS ? 20 : undefined
      }
    },
    'NativeBase.IconNB': {
      color: Platform.OS === PLATFORM.IOS ? 'transparent' : undefined,
      lineHeight: Platform.OS === PLATFORM.IOS ? undefined : themeColor.radioBtnLineHeight,
      fontSize: Platform.OS === PLATFORM.IOS ? undefined : themeColor.radioBtnSize
    }
  };

  return radioTheme;
};
