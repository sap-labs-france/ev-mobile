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
      shadowRadius: 3.62,
      elevation: 11,
      marginBottom: '8@s'
    },
    selected: {
      opacity: 0.5
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
    leftContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '55@s'
    },
    icon: {
      width: '100%',
      color: commonColor.textColor,
      textAlign: 'center',
      fontSize: '55@s'
    },
    badgeDefaultContainer: {
      width: '85%',
      backgroundColor: commonColor.disabledDark,
      borderRadius: '2@s'
    },
    badgeDefaultText: {
      fontSize: '10@s',
      textAlign: 'center',
      color: commonColor.light,
      paddingVertical: '1@s',
      paddingHorizontal: '3@s'
    },
    middleContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: '100%',
      paddingVertical: '5@s',
      marginLeft: '5@s',
      flex: 1
    },
    tagDescriptionContainer: {
      flexDirection: 'row'
    },
    text: {
      fontSize: '13@s',
      color: commonColor.textColor
    },
    tagDescription: {
      fontWeight: 'bold',
      width: '100%'
    },
    userContainer: {
      marginTop: '3@s'
    },
    fullName: {
      fontSize: '12@s',
      alignSelf: 'flex-start'
    },
    tagVisualIDContainer: {
      marginTop: '3@s',
      width: '100%'
    },
    tagVisualID: {
      fontSize: '11@s',
      alignSelf: 'flex-start',
      width: '100%'
    },
    rightContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      width: '80@s',
      paddingVertical: '5@s',
      paddingRight: '5@s',
      height: '100%'
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
