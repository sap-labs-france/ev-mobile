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
      elevation: 11
    },
    transactionContent: {
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
    transactionContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      padding: '5@s',
      alignItems: 'center',
      height: '100%'
    },
    leftContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      height: '100%',
      margin: '5@s',
      flex: 1
    },
    rightContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      width: '20@s',
      height: '100%'
    },
    statusIndicator: {
      height: '100%',
      width: '5@s'
    },
    inactivityHigh: {
      backgroundColor: commonColor.danger
    },
    inactivityMedium: {
      backgroundColor: commonColor.warning
    },
    inactivityLow: {
      backgroundColor: commonColor.success
    },
    label: {
      color: commonColor.textColor,
      fontSize: '10@s',
      marginTop: '-3@s'
    },
    info: {
      color: commonColor.textColor
    },
    success: {
      color: commonColor.success
    },
    warning: {
      color: commonColor.warning
    },
    danger: {
      color: commonColor.danger
    },
    transactionDetailsContainer: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      height: '100%'
    },
    transactionDetailsContainer1: {
      paddingTop: '5@s'
    },
    transactionDetailsContainer2: {
      paddingBottom: '5@s'
    },
    transactionDetailContainer: {
      margin: '3@s',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '60@s'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '30@s',
      justifyContent: 'flex-end'
    },
    labelValue: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    subLabelValue: {
      fontSize: '10@s',
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
