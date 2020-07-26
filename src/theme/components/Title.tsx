import { Platform } from 'react-native';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const titleTheme: any = {
    fontSize: themeColor.titleFontSize,
    fontFamily: themeColor.titleFontfamily,
    color: themeColor.titleFontColor,
    fontWeight: Platform.OS === PLATFORM.IOS ? '700' : undefined,
    textAlign: 'center',
    paddingLeft: Platform.OS === PLATFORM.IOS ? 4 : 0,
    marginLeft: Platform.OS === PLATFORM.IOS ? undefined : -3,
    paddingTop: 1
  };

  return titleTheme;
};
