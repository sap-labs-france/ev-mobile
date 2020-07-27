import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from '../../../custom-theme/customCommonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    container: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
      backgroundColor: 'white'
    },
    spinner: {
      flex: 2,
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    button: {
      width: '65%'
    },
    inputIcon: {
      width: '7%'
    },
    inputField: {
      width: '58%'
    }
  };
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
