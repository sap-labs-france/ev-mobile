import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    invoiceContainer: {
      flex: 1,
      width: '97%',
      height: '130@s',
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
    invoiceContent: {
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
    statusIndicator: {
      height: '100%',
      width: '5@s'
    },
    statusUnpaid: {
      backgroundColor: commonColor.brandDanger
    },
    statusPaid: {
      backgroundColor: commonColor.brandSuccess
    },
    statusDraft: {
      backgroundColor: commonColor.brandDisabledDark
    },
    invoiceInfosContainer: {
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
      flex: 1
    },
    userInfosContainer: {
      marginBottom: '10@s',
      width: '100%'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '13@s'
    },
    userName: {
      fontSize: '15@s',
      fontWeight: 'bold'
    },
    invoiceDetailsContainer: {
      width: '100%'
    },
    transactionContainer: {
      flexDirection: 'row'
    },
    sessionsCount: {
      paddingRight: '3@s'
    },
    rightContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '100@s',
      height: '100%'
    },
    invoiceStatusContainer: {
      justifyContent: 'flex-start'
    },
    invoiceAmountContainer: {
      flex: 1,
      justifyContent: 'center'
    },
    invoiceAmount: {
      fontWeight: 'bold',
      fontSize: '23@s',
      width: '100%',
      textAlign: 'right',
      marginBottom: '2@s'
    },
    downloadButtonContainer: {
      justifyContent: 'flex-end'
    },
    downloadIcon: {
      color: commonColor.textColor,
      fontSize: '24@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
