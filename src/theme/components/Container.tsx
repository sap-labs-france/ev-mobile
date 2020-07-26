import { Dimensions, Platform } from 'react-native';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

const deviceHeight = Dimensions.get('window').height;

export default (themeColor: ThemeColor) => {
  const theme: any = {
    flex: 1,
    height: Platform.OS === PLATFORM.IOS ? deviceHeight : deviceHeight - 20,
    backgroundColor: themeColor.containerBgColor
  };

  return theme;
};
