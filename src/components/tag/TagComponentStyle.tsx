import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    selected: {
      backgroundColor: commonColor.listItemSelected
    },
    unselected: {
      backgroundColor: commonColor.listHeaderBgColor
    },
    tagContainer: {
      height: '90@s',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      margin: 0,
      padding: '5@s'
    },
    leftContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '30%',
      height: '100%',
      marginHorizontal: '5@s'
    },
    icon: {
      flex: 1,
      width: '90@s',
      resizeMode: 'contain'
    },
    middleContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: '100%',
      paddingVertical: '5@s',
      flex: 1
    },
    text: {
      fontSize: '13@s',
      color: commonColor.textColor
    },
    tagDescription: {
      fontWeight: 'bold',
      width: '100%'
    },
    fullName: {
      alignSelf: 'flex-start'
    },
    tagVisualID: {
      fontSize: '11@s',
      alignSelf: 'flex-start',
      lineHeight: '15@s',
      width: '100%'
    },
    bottomLine: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    statusContainer: {
      marginRight: '8@s',
      paddingRight: '8@s'
    },
    statusContainerWithRightBorder: {
      borderRightWidth: 0.8,
      borderRightColor: commonColor.textColor
    },
    defaultContainer: {
      backgroundColor: commonColor.primary,
      borderRadius: '2@s',
      justifyContent: 'center',
      height: '14@s'
    },
    defaultText: {
      fontSize: '10@s',
      color: commonColor.light,
      paddingHorizontal: '3@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
