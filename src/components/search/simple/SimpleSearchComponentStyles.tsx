import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../theme/variables/commonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '40@s',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor,
      backgroundColor: commonColor.headerBgColor
    },
    inputField: {
      flex: 1,
      fontSize: '16@s'
    },
    icon: {
      paddingLeft: '5@s',
      paddingRight: '5@s',
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
