import { Platform } from 'react-native';
import { scale } from 'react-native-size-matters';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const tabContainerTheme: any = {
    height: scale(50),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: Platform.OS === PLATFORM.IOS ? themeColor.borderWidth : 0,
    borderColor: themeColor.topTabBarBorderColor
  };

  return tabContainerTheme;
};
