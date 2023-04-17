import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      width: '95%',
      height: '50@s',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      borderRadius: '8@s',
      backgroundColor: commonColor.listHeaderBgColor
    },
    inputField: {
      flex: 1,
      fontSize: '14@s',
      height: '100%',
      paddingVertical: 0,
      color: commonColor.textColor
    },
    icon: {
      color: commonColor.textColor
    },
    clearIcon: {
      color: commonColor.disabledDark
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
