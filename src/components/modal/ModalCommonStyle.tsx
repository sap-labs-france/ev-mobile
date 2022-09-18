import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    buttonText: {
      textAlign: 'center',
      fontSize: '20@s',
      color: commonColor.containerBgColor,
      flex: 1,
    },
    primaryButton: {
      backgroundColor: commonColor.primary,
      borderColor: commonColor.primary,
    },
    primaryButtonText: {
      color: commonColor.light
    },
    outlinedButton: {
      backgroundColor: commonColor.listBackgroundHeader,
      borderWidth: 1,
      borderColor: commonColor.textColor
    },
    outlinedButtonText: {
      color: commonColor.textColor,
    },
    warningButton: {
      backgroundColor: commonColor.warning,
      borderColor: commonColor.warning,
    },
    warningButtonText: {
      color: commonColor.light,
    },
    dangerButton: {
      backgroundColor: commonColor.danger,
      borderColor: commonColor.danger,
    },
    dangerButtonText: {
      color: commonColor.light,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
