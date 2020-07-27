import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import Utils from '../../utils/Utils';

export default function computeStyleSheet(): any {
  const commonColor = Utils.getCurrentCommonColor();
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
      alignItems: 'center'
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
    iconLeftHeader: {
      fontSize: '30@s',
      color: commonColor.textColor,
      paddingRight: '10@s',
    },
    iconRightHeader: {
      fontSize: '30@s',
      color: commonColor.textColor,
      paddingLeft: '10@s',
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
