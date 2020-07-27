import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../custom-theme/customCommonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    header: {
      height: '45@s',
      width: '100%',
      padding: 0,
      margin: 0,
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor,
      backgroundColor: commonColor.headerBgColor
    },
    leftHeader: {
      flexDirection: 'row',
    },
    rightHeader: {
      flexDirection: 'row',
    },
    bodyHeader: {
      flex: 3,
      paddingLeft: Platform.OS === 'ios' ? 0 : '50@s'
    },
    titleHeader: {
      color: commonColor.textColor,
      fontSize: '18@s'
    },
    titleHeaderWithSubTitle: {
      fontSize: '18@s'
    },
    subTitleHeader: {
      color: commonColor.textColor,
      fontWeight: 'bold',
      fontSize: '12@s',
      marginTop: Platform.OS === 'ios' ? 0 : '-3@s'
    },
    logoHeader: {
      width: '45@s',
      marginLeft: '5@s',
      marginRight: '5@s',
      resizeMode: 'contain'
    },
    iconHeader: {
      color: commonColor.textColor,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
