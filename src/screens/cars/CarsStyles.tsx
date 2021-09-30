import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    addCarButton: {
      width: '35@s',
      height: '35@s',
      borderRadius: '8@s',
      padding: '5@s',
      marginLeft: '2.5%',
      marginBottom: '5@s',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: commonColor.listItemBackground,
      elevation: 4,
      shadowColor: commonColor.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '27@s'
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
