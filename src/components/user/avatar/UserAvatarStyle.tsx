import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    accessory: {
      color: commonColor.textColor
    },
    avatarSelected: {
      color: commonColor.textColor,
      opacity: 0.3
    },
    avatarTitle: {
      color: commonColor.textColor
    },
    avatarContainer: {
      backgroundColor: commonColor.listBorderColor,
      height: '100%',
      width: '100%'
    },
    avatar: {
      fontSize: '60@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
