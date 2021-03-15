import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    accessory: {
      color: commonColor.textColor,
      fontSize: '30@s'
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
      fontSize: '50@s'
    },
    status: {
      width: '8@s',
      height: '8@s',
    },
    statusContainer: {
      position: 'absolute',
      top: '3@s',
      right: '2@s',
    },
    pending: {
      backgroundColor: commonColor.brandWarningLight
    },
    inactive: {
      backgroundColor: commonColor.danger
    },
    active: {
      backgroundColor: commonColor.success
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
