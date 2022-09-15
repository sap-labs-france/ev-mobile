import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    transactionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    transactionContent: {
      flex: 1,
      justifyContent: 'space-between',
      padding: '10@s',
      alignItems: 'center'
    },
    leftContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      margin: '5@s',
      flex: 1
    },
    statusIndicator: {
      height: '100%',
      width: '5@s',
      borderTopLeftRadius: '8@s',
      borderBottomLeftRadius: '8@s'
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
      paddingBottom: '2@s'
    },
    transactionDetailContainer: {
      marginTop: '3@s',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '25%'
    },
    icon: {
      color: commonColor.textColor,
      justifyContent: 'flex-end'
    },
    arrowIcon: {
      fontSize: '18@s',
      color: commonColor.disabledDark
    },
    labelValue: {
      fontSize: '13@s',
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
