// @flow

import { Dimensions, Platform } from 'react-native';

import { PLATFORM } from './../variables/commonColor';
import variable from './../variables/platform';

const deviceHeight = Dimensions.get('window').height;
export default (variables /* : * */ = variable) => {
  const theme = {
    flex: 1,
    height: Platform.OS === PLATFORM.IOS ? deviceHeight : deviceHeight - 20,
    backgroundColor: variables.containerBgColor
  };

  return theme;
};
