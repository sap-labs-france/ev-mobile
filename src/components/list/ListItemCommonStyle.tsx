import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      width: '95%',
      alignSelf: 'center',
      borderRadius: '8@s',
      backgroundColor: commonColor.listItemBackground,
      shadowColor: commonColor.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62,
      elevation: 4,
      marginBottom: '11@s'
    },
    noShadowContainer: {
      width: '95%',
      alignSelf: 'center',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderRadius: '8@s',
      backgroundColor: commonColor.listItemBackground,
      marginBottom: '11@s'
    },
    selected: {
      backgroundColor: commonColor.listItemSelected
    },
    unselected: {
      backgroundColor: commonColor.listItemBackground
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
