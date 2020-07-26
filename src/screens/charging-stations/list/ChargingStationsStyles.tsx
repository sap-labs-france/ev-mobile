import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColor.containerBgColor
    },
    content: {
      flex: 1
    },
    spinner: {
      flex: 1
    },
    map: {
      flex: 1
    },
    filtersExpanded: {
      opacity: 1,
      height: '180@s',
    },
    filtersHidden: {
      opacity: 0,
      height: 0,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
