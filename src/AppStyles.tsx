import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import CommonColor2 from './theme/variables/CommonColor2';

export default function computeStyleSheet(): any {
  const commonColor = new CommonColor2();
  const commonStyles = ScaledSheet.create({
    sideMenu: {
      width: '250@s',
      color: commonColor.textColor,
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
