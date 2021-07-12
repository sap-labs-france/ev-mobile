import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      width: '97%',
      height: '80@s',
      alignSelf: 'center',
      borderColor: 'transparent',
      backgroundColor: commonColor.listHeaderBgColor,
      shadowColor: commonColor.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.23,
      opacity: 82,
      shadowRadius: 3.62,
      elevation: 11,
      marginBottom: '8@s'
    },
    tagContent: {
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      backgroundColor: commonColor.listHeaderBgColor,
      flexDirection: 'row',
      margin: 0,
      flex: 1,
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0
    },
    tagContainer: {
      flexDirection: 'row',
      flex: 1,
      padding: '5@s',
      height: '100%',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    leftContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: '100%',
      flex: 1
    },
    rightContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      width: '80@s',
      height: '100%'
    },
    statusIndicator: {
      height: '100%',
      width: '5@s'
    },
    // Card ratio 1.585
    iconContainer: {
      borderColor: commonColor.containerBgColor,
      backgroundColor: commonColor.containerBgColor,
      marginHorizontal: '1@s',
      borderWidth: 1,
      paddingVertical: '4@s',
      flexDirection: 'column',
      borderRadius: '5@s',
      width: '70@s',
      height: '45@s',
      alignItems: 'center',
      justifyContent: 'center'
    },
    test: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    defaultContainer: {
      backgroundColor: commonColor.brandDisabledDark,
      borderRadius: '2@s',
      width: '70@s',
      marginTop: '4@s'
    },
    badgeText: {
      fontSize: '10@s',
      textAlign: 'center',
      color: commonColor.brandLight,
      paddingVertical: '1@s',
      paddingHorizontal: '3@s'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '30@s'
    },
    statusInactive: {
      backgroundColor: commonColor.brandDanger
    },
    statusActive: {
      backgroundColor: commonColor.brandSuccess
    },
    selected: {
      opacity: 0.5
    },
    userContainer: {
      marginTop: '3@s'
    },
    tagVisualIDContainer: {
      marginTop: '3@s',
      width: '100%'
    },
    text: {
      fontSize: '13@s',
      color: commonColor.textColor
    },
    tagDescription: {
      fontSize: '12@s',
      fontWeight: 'bold',
      width: '100%'
    },
    tagVisualID: {
      fontSize: '11@s',
      alignSelf: 'flex-start',
      width: '100%'
    },
    fullName: {
      fontSize: '12@s',
      alignSelf: 'flex-end'
    },
    tagDescriptionContainer: {
      flexDirection: 'row'
    },
    statusContainer: {
      marginBottom: '2@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
