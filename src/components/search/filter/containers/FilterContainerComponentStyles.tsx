import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../../theme/variables/commonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    visibleContainer: {
      paddingLeft: '10@s',
      paddingRight: '10@s',
      justifyContent: 'flex-start',
      borderBottomWidth: '1@s',
      borderColor: commonColor.listBorderColor,
      backgroundColor: commonColor.containerBgColor
    },
    visibleExpandedContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    visibleExpandedIcon: {
      fontSize: '25@s',
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
