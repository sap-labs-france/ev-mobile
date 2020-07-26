import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColor.containerBgColor
    },
    viewContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    spinner: {
      flex: 1,
      color: themeColor.textColor
    },
    backgroundImage: {
      width: '100%',
      height: '125@s'
    },
    transactionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent'
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
      backgroundColor: themeColor.headerBgColor
    },
    headerRowContainer: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerName: {
      color: themeColor.headerTextColor,
      fontSize: '18@s',
      marginLeft: '5@s',
      marginRight: '5@s',
      fontWeight: 'bold'
    },
    subHeaderName: {
      color: themeColor.headerTextColor,
      fontSize: '14@s',
      marginLeft: '5@s',
      marginRight: '5@s',
    },
    subSubHeaderName: {
      color: themeColor.headerTextColor,
      fontSize: '12@s',
      marginLeft: '5@s',
      marginRight: '5@s',
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
      alignSelf: 'center',
      color: themeColor.textColor,
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
      marginTop: Platform.OS === 'ios' ? '0@s' : '-5@s',
      color: themeColor.textColor,
      alignSelf: 'center'
    },
    subLabelStatusError: {
      color: themeColor.brandDanger,
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
      borderColor: themeColor.brandPrimaryDark
    },
    success: {
      color: themeColor.success
    },
    warning: {
      color: themeColor.warning
    },
    danger: {
      color: themeColor.danger
    },
    disabled: {
      color: themeColor.disabled,
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
