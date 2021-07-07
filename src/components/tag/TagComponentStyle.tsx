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
      justifyContent: 'space-between',
      padding: '10@s',
      alignItems: 'center',
      height: '100%'
    },
    leftContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      height: '100%',
      flex: 1
    },
    rightContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '90@s',
      height: '100%'
    },
    statusIndicator: {
      height: '100%',
      width: '5@s'
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
    userConstainer: {
      marginTop: '3@s'
    },
    tagVisualIDContainer: {
      marginTop: '3@s'
    },
    text: {
      fontSize: '13@s',
      color: commonColor.textColor
    },
    tagDescription: {
      fontSize: '15@s',
      fontWeight: 'bold'
    },
    tagVisualID: {
      fontSize: '11@s',
      alignSelf: 'flex-start'
    },
    fullName: {
      fontSize: '15@s',
      alignSelf: 'flex-end'
    },
    tagDescriptionContainer: {
      width: '100%'
    },
    statusContainer: {
      alignSelf: 'flex-start',
      height: '22@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
