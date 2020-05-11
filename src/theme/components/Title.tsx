import { Platform } from 'react-native';

import { PLATFORM } from './../variables/commonColor';
import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const titleTheme: any = {
    fontSize: variables.titleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.titleFontColor,
    fontWeight: Platform.OS === PLATFORM.IOS ? '700' : undefined,
    textAlign: 'center',
    paddingLeft: Platform.OS === PLATFORM.IOS ? 4 : 0,
    marginLeft: Platform.OS === PLATFORM.IOS ? undefined : -3,
    paddingTop: 1
  };

  return titleTheme;
};
