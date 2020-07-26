import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../theme/variables/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
      backgroundColor: themeColor.headerBgColorLight
    },
    headerName: {
      color: themeColor.headerTextColor,
      fontSize: '18@s',
      marginLeft: '5@s',
      marginRight: '5@s',
      fontWeight: 'bold'
    },
    subHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5@s',
      paddingLeft: '8@s',
      paddingRight: '8@s',
      backgroundColor: themeColor.containerBgColor
    },
    subHeaderName: {
      color: themeColor.headerTextColor,
      fontSize: '15@s',
      width: '49%'
    },
    subHeaderNameLeft: {},
    subHeaderNameRight: {
      textAlign: 'right'
    },
    transactionContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
      paddingLeft: '5@s',
      paddingRight: '5@s',
      height: '80@s',
      width: '100%'
    },
    label: {
      fontSize: '10@s',
      marginTop: '-3@s',
      color: themeColor.textColor,
    },
    info: {
      color: themeColor.primary
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
    columnContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      fontSize: '30@s',
      justifyContent: 'flex-end',
      color: themeColor.textColor,
    },
    labelValue: {
      fontSize: '15@s',
      color: themeColor.textColor,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
