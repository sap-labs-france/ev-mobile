import { Platform } from 'react-native';
import { scale } from 'react-native-size-matters';
import { PLATFORM } from './../variables/commonColor';
import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const tabContainerTheme: any = {
    height: scale(50),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: Platform.OS === PLATFORM.IOS ? variables.borderWidth : 0,
    borderColor: variables.topTabBarBorderColor
  };

  return tabContainerTheme;
};
