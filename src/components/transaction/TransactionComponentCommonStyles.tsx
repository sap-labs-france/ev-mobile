import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor
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
      color: themeColor.textColor,
      fontSize: '10@s',
      marginTop: '-3@s'
    },
    info: {
      color: themeColor.textColor,
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
    columnContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '60@s'
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      color: themeColor.textColor,
      fontSize: '30@s',
      justifyContent: 'flex-end'
    },
    labelValue: {
      fontSize: '15@s',
      color: themeColor.textColor,
    },
    subLabelValue: {
      fontSize: '10@s',
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
