// @flow

import { Platform } from 'react-native';

import { PLATFORM } from './../variables/commonColor';
import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const subtitleTheme = {
    fontSize: variables.subTitleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.subtitleColor,
    textAlign: Platform.OS === PLATFORM.IOS ? 'center' : 'left',
    paddingLeft: Platform.OS === PLATFORM.IOS ? 4 : 0,
    marginLeft: Platform.OS === PLATFORM.IOS ? undefined : -3
  };

  return subtitleTheme;
};
