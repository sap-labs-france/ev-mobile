import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '40@s',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
      backgroundColor: themeColor.headerBgColor
    },
    inputField: {
      flex: 1,
      fontSize: '16@s'
    },
    icon: {
      paddingLeft: '5@s',
      paddingRight: '5@s',
      fontSize: '25@s',
      color: themeColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
