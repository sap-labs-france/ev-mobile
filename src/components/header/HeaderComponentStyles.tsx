import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    header: {
      height: '55@s',
      width: '100%',
      padding: 0,
      margin: 0,
      paddingLeft: '10@s',
      paddingRight: '10@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
      backgroundColor: themeColor.headerBgColor
    },
    buttonRow: {
      flexDirection: 'row',
    },
    leftHeader: {
    },
    leftButtonHeader: {
      paddingLeft: 0
    },
    rightHeader: {
    },
    rightButtonHeader: {
    },
    rightSecondButtonHeader: {
      marginRight: '15@s'
    },
    bodyHeader: {
      flex: 3,
      paddingLeft: Platform.OS === 'ios' ? 0 : '50@s'
    },
    titleHeader: {
      color: themeColor.textColor,
      fontSize: '18@s'
    },
    titleHeaderWithSubTitle: {
      fontSize: '18@s'
    },
    subTitleHeader: {
      color: themeColor.textColor,
      fontWeight: 'bold',
      fontSize: '12@s',
      marginTop: Platform.OS === 'ios' ? 0 : '-3@s'
    },
    logoHeader: {
      width: '45@s',
      resizeMode: 'contain'
    },
    iconHeader: {
      color: themeColor.textColor,
      fontSize: '30@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
