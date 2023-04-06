import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

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
    backgroundImageContainer: {
      width: '95%',
      height: '100@s',
      alignSelf: 'center'
    },
    backgroundImage: {
      borderRadius: scale(18),
      width: '100%'
    },
    imageInnerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      borderRadius: '18@s'
    },
    lastTransactionContainer: {
      width: '50@s',
      height: '50@s',
      backgroundColor: 'transparent'
    },
    buttonLastTransaction: {
      width: '50@s',
      height: '50@s',
      borderRadius: '25@s',
      borderStyle: 'solid',
      borderWidth: '2@s',
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    reportErrorContainer: {
      width: '50@s',
      height: '50@s',
      justifyContent: 'center'
    },
    reportErrorButton: {
      width: '50@s',
      height: '50@s',
      borderRadius: '25@s',
      borderStyle: 'solid',
      borderWidth: '2@s',
      borderColor: commonColor.danger,
      backgroundColor: commonColor.containerBgColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    transactionContainer: {
      padding: '0@s',
      justifyContent: 'center',
      alignSelf: 'center'
    },
    buttonTransaction: {
      width: '90@s',
      height: '90@s',
      borderRadius: '45@s',
      borderStyle: 'solid',
      borderWidth: '2@s',
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
    connectorInfoSettingsContainer: {
      flex: 1,
      width: '100%'
    },
    scrollViewContainer: {
      width: '100%'
    },
    chargingSettingsContainer: {
      alignItems: 'center',
      marginHorizontal: '10@s',
      height: 'auto',
      paddingTop: '10@s',
      paddingBottom: '20@s'
    },
    settingLabel: {
      fontSize: '13@s',
      color: commonColor.textColor,
      marginRight: '10@s',
      maxWidth: '40%'
    },
    departureTimeContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '20@s'
    },
    departureTimeInput: {
      backgroundColor: commonColor.listItemBackground,
      borderRadius: '8@s',
      padding: '11@s',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    departureTimeText: {
      fontSize: '13@s',
      color: commonColor.textColor,
      marginRight: '5@s'
    },
    currentSoCContainer: {
      marginBottom: '13@s',
    },
    socInputsContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '20@s'
    },
    socContainer: {
      width: '100%',
      alignItems: 'center'
    },
    slider: {
      width: '100%'
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
      alignItems: 'center'
    },
    columnContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%',
      height: '100@s',
      paddingHorizontal: '5@s'
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
    batteryStartValue: {
      fontSize: '18@s'
    },
    upToSymbol: {
      fontSize: '21@s'
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
      color: commonColor.textColor
    },
    downArrow: {
      fontSize: '30@s'
    },
    listContainer: {
      width: '100%',
      height: '100%'
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
      fontSize: '13@s',
      color: commonColor.textColor
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
      minHeight: '90@s',
      padding: '10@s',
      marginBottom: '11@s',
      justifyContent: 'flex-start'
    },
    noCarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    noCarIcon: {
      color: commonColor.textColor,
      fontSize: '50@s',
      marginHorizontal: '10@s'
    },
    noTagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
      textAlign: 'center',
      marginLeft: '10@s',
      color: commonColor.light
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
    adviceMessageContainer: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: '3@s',
      marginBottom: 0,
      marginVertical: '4@s',
      justifyContent: 'center'
    },
    adviceMessageIcon: {
      fontSize: '25@s',
      color: commonColor.light
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
    errorAsterisk: {
      color: commonColor.danger,
      fontSize: '20@s'
    },
    plusSign: {
      fontSize: '25@s',
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
    },
    accordion: {
      width: '100%',
      marginBottom: '10@s',
      paddingLeft: '10@s',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    accordionText: {
      color: commonColor.textColor,
      fontSize: '15@s'
    },
    accordionIcon: {
      color: commonColor.textColor,
      fontSize: '35@s'
    },
    itemComponentContainer: {
      marginBottom: '10@s'
    },
    activityIndicator: {
      marginTop: '70@s',
      padding: '10@s',
      backgroundColor: commonColor.containerBgColor,
      zIndex: 2
    },
    percentSign: {
      paddingRight: scale(3),
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    socInput: {
      color: commonColor.textColor,
      fontWeight: 'bold',
      textAlign: 'right',
      paddingHorizontal: scale(5),
      fontSize: scale(14),
      backgroundColor: commonColor.listItemBackground,
      paddingVertical: 0
    },
    currentSocInputContainer: {
      marginRight: '8@s'
    },
    socInputContainer: {
      flex: 1,
      paddingHorizontal: scale(10),
      backgroundColor: commonColor.listItemBackground,
      alignItems: 'center',
      justifyContent: 'flex-end',
      borderRadius: scale(8),
      paddingVertical: '13@s'
    },
    socInputContainerError: {
      borderColor: commonColor.danger,
      borderWidth: 0.7
    },
    socInputText: {
      fontSize: '11@s',
      color: commonColor.textColor
    },
    socInputLabelText: {
      fontStyle: 'italic',
      color: commonColor.disabledDark,
      flex: 1
    },
    sliderMarker: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(28),
      backgroundColor: commonColor.disabled,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65
    },
    sliderTrack: {
      width: '100%',
      height: scale(7),
      borderRadius: scale(8)
    },
    sliderLeftTrack: {
      backgroundColor: commonColor.primary
    },
    sliderMiddleTrack: {
      backgroundColor: commonColor.primary,
      borderStyle: 'dashed',
      borderWidth: 0.6,
      borderColor: commonColor.textColor
    },
    sliderRightTrack: {
      backgroundColor: commonColor.disabledDark,
      opacity: 0.2
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
