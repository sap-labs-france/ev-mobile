import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    status: {
      borderWidth: 1,
      borderRadius: '12@s'
    },
    statusText: {
      fontSize: '11@s',
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: '3@s',
      paddingHorizontal: '10@s'
    },
    success: {
      borderColor: commonColor.brandSuccess,
      color: commonColor.brandSuccess
    },
    danger: {
      color: commonColor.brandDanger,
      borderColor: commonColor.brandDanger
    },
    warning: {
      color: commonColor.brandWarning,
      borderColor: commonColor.brandWarning
    },
    default: {
      color: commonColor.brandDisabledDark,
      borderColor: commonColor.brandDisabledDark
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
