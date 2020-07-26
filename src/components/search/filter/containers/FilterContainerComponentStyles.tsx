import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    visibleContainer: {
      paddingLeft: '10@s',
      paddingRight: '10@s',
      justifyContent: 'flex-start',
      borderBottomWidth: '1@s',
      borderColor: themeColor.listBorderColor,
      backgroundColor: themeColor.containerBgColor
    },
    visibleExpandedContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: themeColor.containerBgColor
    },
    visibleExpandedIcon: {
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
