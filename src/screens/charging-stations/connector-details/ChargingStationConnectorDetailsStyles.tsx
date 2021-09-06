import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    text: {
      color: commonColor.textColor,
      textAlign: 'center'
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: commonColor.containerBgColor,
      width: '100%'
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
      borderColor: commonColor.danger,
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
      color: commonColor.textColor
    },
    reportErrorIcon: {
      fontSize: '25@s',
      color: commonColor.danger
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
    selectUserCarBadgeContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      width: '100%'
    },
    selectUserCarBadgeTitleContainer: {
      width: '100%',
      marginBottom: '5@s'
    },
    selectUserCarBadgeTitle: {
      fontSize: '15@s',
      color: commonColor.textColor,
      textAlign: 'center',
      paddingLeft: '2@s',
      paddingVertical: 0
    },
    scrollViewContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '100@s',
      alignSelf: 'center',
      width: '100%'
    },
    rowUserCarBadgeContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '10@s'
    },
    userCarBadgeIcon: {
      fontSize: '75@s'
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
      color: commonColor.textColor
    },
    labelUser: {
      fontSize: '11@s',
      paddingTop: '5@s',
      color: commonColor.textColor
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
      color: commonColor.textColor
    },
    icon: {
      fontSize: '25@s',
      color: commonColor.textColor
    },
    downArrow: {
      fontSize: '30@s'
    },
    listContainer: {
      width: '100%',
      height: '100%'
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
      color: commonColor.success
    },
    warning: {
      color: commonColor.warning
    },
    danger: {
      color: commonColor.danger
    },
    disabled: {
      color: commonColor.buttonDisabledBg,
      borderColor: commonColor.buttonDisabledBg
    },
    messageText: {
      textAlign: 'left',
      fontSize: '13@s'
    },
    errorMessage: {
      color: commonColor.dangerLight,
      fontSize: '14@s'
    },
    noPaymentMethodIcon: {
      color: commonColor.dangerLight,
      marginHorizontal: '10@s',
      fontSize: '50@s'
    },
    noItemContainer: {
      width: '95%',
      minHeight: '90@s',
      padding: '10@s',
      justifyContent: 'flex-start'
    },
    noCarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '95%'
    },
    noCarIcon: {
      color: commonColor.textColor,
      fontSize: '50@s',
      marginHorizontal: '10@s'
    },
    noTagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: '80@s',
      borderColor: commonColor.dangerLight,
      borderTopWidth: 0.8,
      borderLeftWidth: 0.8,
      borderRightWidth: 0.8,
      borderBottomWidth: 0.8
    },
    noTagIcon: {
      color: commonColor.dangerLight,
      fontSize: '50@s',
      marginHorizontal: '10@s'
    },
    adviceText: {
      fontSize: '12@s',
      flex: 1,
      marginLeft: '10@s'
    },
    messageContainer: {
      backgroundColor: commonColor.listItemBackground,
      flexDirection: 'row',
      alignItems: 'center',
      padding: '12@s',
      width: '95%',
      borderRadius: '8@s',
      marginBottom: '10@s'
    },
    errorMessageContainer: {
      borderColor: commonColor.dangerLight,
      borderWidth: 0.8
    },
    inputContainer: {
      marginBottom: '7@s'
    },
    selectionContainer: {
      width: '100%'
    },
    splitter: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      backgroundColor: commonColor.listItemBackground,
      marginBottom: '15@s'
    },
    splitterButton: {
      flex: 1,
      padding: '10@s',
      width: '100%'
    },
    splitterButtonText: {
      textAlign: 'center'
    },
    splitterButtonFocused: {
      borderColor: commonColor.textColor,
      borderBottomWidth: 1.5
    },
    chargingSettingsContainer: {
      width: '100%',
      alignItems: 'center',
      marginHorizontal: 0
    },
    scrollviewContainer: {
      width: '100%'
    },
    column: {
      flexDirection: 'column',
      flex: 1
    },
    linkText: {
      color: commonColor.brandPrimaryLight,
      alignItems: 'center'
    },
    switchContainer: {
      flexDirection: 'row',
      marginTop: '5@s',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: '20@s',
      width: '100%',
      marginLeft: '5%'
    },
    switchLabel: {
      fontSize: '14@s',
      marginRight: '10@s'
    },
    errorAsterisque: {
      color: commonColor.danger,
      fontSize: '20@s'
    },
    plusSign: {
      fontSize: '28@s',
      color: commonColor.brandPrimaryLight,
      marginRight: '5@s'
    },
    addItemContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    linkLabel: {
      flex: 1
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    reportErrorContainer: {
      marginLeft: '84%'
    }
  };
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
