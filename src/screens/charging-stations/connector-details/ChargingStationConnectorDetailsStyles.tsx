import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backgroundColor: themeColor.containerBgColor
    },
    spinner: {
      flex: 1,
      color: themeColor.textColor
    },
    backgroundImage: {
      width: '100%',
      height: '125@s'
    },
    lastTransactionContainer: {
      width: '50@s',
      height: '50@s',
      marginTop: '-90@s',
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
      borderColor: themeColor.textColor,
      backgroundColor: themeColor.containerBgColor,
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
      borderColor: themeColor.textColor,
      backgroundColor: themeColor.containerBgColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    noButtonStopTransaction: {
      height: '15@s'
    },
    startTransaction: {
      borderColor: themeColor.success
    },
    stopTransaction: {
      borderColor: themeColor.danger
    },
    transactionIcon: {
      fontSize: '75@s'
    },
    lastTransactionIcon: {
      fontSize: '25@s',
      color: themeColor.buttonBg,
    },
    startTransactionIcon: {
      color: themeColor.success
    },
    stopTransactionIcon: {
      color: themeColor.danger
    },
    buttonTransactionDisabled: {
      borderColor: themeColor.buttonDisabledBg
    },
    transactionDisabledIcon: {
      color: themeColor.buttonDisabledBg,
      backgroundColor: 'transparent'
    },
    scrollViewContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
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
      color: themeColor.textColor,
      alignSelf: 'center'
    },
    labelValue: {
      fontSize: '25@s',
      fontWeight: 'bold',
      color: themeColor.textColor,
    },
    labelUser: {
      fontSize: '10@s',
      color: themeColor.textColor,
    },
    subLabel: {
      fontSize: '10@s',
      marginTop: Platform.OS === 'ios' ? '0@s' : '-2@s',
      color: themeColor.textColor,
      alignSelf: 'center'
    },
    subLabelStatusError: {
      color: themeColor.danger,
      marginTop: '2@s'
    },
    subLabelUser: {
      fontSize: '8@s',
      marginTop: '0@s',
      color: themeColor.textColor,
    },
    icon: {
      fontSize: '25@s',
      color: themeColor.textColor,
    },
    userImage: {
      height: '52@s',
      width: '52@s',
      alignSelf: 'center',
      marginBottom: '5@s',
      borderRadius: '26@s',
      borderWidth: '3@s',
      borderColor: themeColor.textColor
    },
    info: {
      color: themeColor.textColor,
      borderColor: themeColor.textColor
    },
    success: {
      color: themeColor.brandSuccess
    },
    warning: {
      color: themeColor.brandWarning
    },
    danger: {
      color: themeColor.brandDanger
    },
    disabled: {
      color: themeColor.buttonDisabledBg,
      borderColor: themeColor.buttonDisabledBg
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
