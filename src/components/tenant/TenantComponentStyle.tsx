import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      width: '100%',
      paddingVertical: '15@s'
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '12@s',
      textAlign: 'center'
    },
    errorText: {
      color: commonColor.danger
    },
    tenantName: {
      fontWeight: 'bold',
      fontSize: '14@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
