import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    invoiceContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 1
    },
    invoiceContent: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      padding: '5@s',
      alignItems: 'center'
    },
    statusIndicator: {
      width: '5@s',
      height: '100%',
      borderTopLeftRadius: '8@s',
      borderBottomLeftRadius: '8@s'
    },
    statusOpenOrUncollectible: {
      backgroundColor: commonColor.danger
    },
    statusPaid: {
      backgroundColor: commonColor.success
    },
    statusDeletedOrVoid: {
      backgroundColor: commonColor.warning
    },
    statusDefault: {
      backgroundColor: commonColor.disabledDark
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
      width: '100@s',
      height: '100%'
    },
    userContainer: {
      marginTop: '10@s',
      width: '100%'
    },
    text: {
      fontSize: '13@s',
      color: commonColor.textColor
    },
    userName: {
      fontSize: '15@s',
      fontWeight: 'bold'
    },
    invoiceCreatedOn: {
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
    invoiceStatusContainer: {
      justifyContent: 'flex-start',
      height: '30@s'
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
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      height: '30@s'
    },
    downloadIcon: {
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
