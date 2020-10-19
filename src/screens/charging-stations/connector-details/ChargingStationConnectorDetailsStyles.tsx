import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): any {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: commonColor.containerBgColor
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    backgroundImage: {
      width: '100%',
      height: '125@s'
    },
    lastTransactionContainer: {
      width: '50@s',
      height: '50@s',
      marginTop: '-85@s',
      marginLeft: '45@s',
      marginBottom: '25@s',
      backgroundColor: 'transparent'
    },
    buttonLastTransaction: {
      width: '50@s',
      height: '50@s',
      borderRadius: '25@s',
      borderStyle: 'solid',
      borderWidth: '4@s',
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    reportErrorContainer: {
      width: '50@s',
      height: '50@s',
      marginTop: '-75@s',
      marginLeft: '250@s',
      marginBottom: '25@s',
      backgroundColor: 'transparent'
    },
    reportErrorButton: {
      width: '50@s',
      height: '50@s',
      borderRadius: '25@s',
      borderStyle: 'solid',
      borderWidth: '4@s',
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    transactionContainer: {
      width: '100@s',
      height: '100@s',
      padding: '0@s',
      paddingBottom: '25@s',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: '-85@s',
      backgroundColor: 'transparent'
    },
    buttonTransaction: {
      width: '100@s',
      height: '100@s',
      borderRadius: '50@s',
      borderStyle: 'solid',
      borderWidth: '4@s',
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    noButtonStopTransaction: {
      height: '15@s'
    },
    startTransaction: {
      borderColor: commonColor.success
    },
    stopTransaction: {
      borderColor: commonColor.danger
    },
    transactionIcon: {
      fontSize: '75@s'
    },
    lastTransactionIcon: {
      fontSize: '25@s',
      color: commonColor.textColor,
    },
    reportErrorIcon: {
      fontSize: '25@s',
      color: commonColor.textColor,
    },
    startTransactionIcon: {
      color: commonColor.success
    },
    stopTransactionIcon: {
      color: commonColor.danger
    },
    buttonTransactionDisabled: {
      borderColor: commonColor.buttonDisabledBg
    },
    transactionDisabledIcon: {
      color: commonColor.buttonDisabledBg,
      backgroundColor: 'transparent'
    },
    scrollViewContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: '20@s'
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '100@s'
    },
    columnContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%'
    },
    connectorLetter: {
      marginTop: '5@s',
      marginBottom: '5@s'
    },
    label: {
      fontSize: '16@s',
      color: commonColor.textColor,
      alignSelf: 'center'
    },
    labelValue: {
      fontSize: '25@s',
      fontWeight: 'bold',
      color: commonColor.textColor,
    },
    labelUser: {
      fontSize: '10@s',
      color: commonColor.textColor,
    },
    subLabel: {
      fontSize: '10@s',
      marginTop: Platform.OS === 'ios' ? '0@s' : '-2@s',
      color: commonColor.textColor,
      alignSelf: 'center'
    },
    subLabelStatusError: {
      color: commonColor.danger,
      marginTop: '2@s'
    },
    subLabelUser: {
      fontSize: '8@s',
      marginTop: '0@s',
      color: commonColor.textColor,
    },
    icon: {
      fontSize: '25@s',
      color: commonColor.textColor,
    },
    userImage: {
      height: '52@s',
      width: '52@s',
      alignSelf: 'center',
      marginBottom: '5@s',
      borderRadius: '26@s',
      borderWidth: '3@s',
      borderColor: commonColor.textColor
    },
    info: {
      color: commonColor.textColor,
      borderColor: commonColor.textColor
    },
    success: {
      color: commonColor.brandSuccess
    },
    warning: {
      color: commonColor.brandWarning
    },
    danger: {
      color: commonColor.brandDanger
    },
    disabled: {
      color: commonColor.buttonDisabledBg,
      borderColor: commonColor.buttonDisabledBg
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
