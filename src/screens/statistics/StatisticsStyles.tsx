import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../theme/variables/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      height: '100%',
      backgroundColor: themeColor.containerBgColor
    },
    spinner: {
      flex: 1,
      color: themeColor.textColor
    },
    content: {
      backgroundColor: themeColor.headerBgColor,
    },
    cards: {
      padding: '10@s',
      backgroundColor: themeColor.headerBgColor,
    },
    card: {
      padding: '5@s',
      backgroundColor: themeColor.headerBgColor,
    },
    cardItem: {
      backgroundColor: themeColor.headerBgColor,
    },
    tabHeader: {},
    cardIcon: {
      textAlign: 'center',
      fontSize: '35@s',
      width: '40@s',
      color: themeColor.textColor
    },
    cardText: {
      fontSize: '20@s',
      color: themeColor.textColor
    },
    cardNote: {
      fontSize: '12@s',
      fontStyle: 'italic',
      color: themeColor.subTextColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
