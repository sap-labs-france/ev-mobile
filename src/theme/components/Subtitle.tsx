import { Platform } from 'react-native';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const subtitleTheme: any = {
    fontSize: themeColor.subTitleFontSize,
    fontFamily: themeColor.titleFontfamily,
    color: themeColor.subtitleColor,
    textAlign: 'center',
    paddingLeft: Platform.OS === PLATFORM.IOS ? 4 : 0,
    marginLeft: Platform.OS === PLATFORM.IOS ? undefined : -3
  };

  return subtitleTheme;
};
