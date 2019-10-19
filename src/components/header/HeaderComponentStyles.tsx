import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  header: {
    height: '45@s',
    paddingTop: '5@s',
    paddingBottom: '5@s',
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.brandPrimaryDark
  },
  leftHeader: {
    marginLeft: '5@s'
  },
  bodyHeader: {
    flex: 3,
    paddingLeft: Platform.OS === 'ios' ? 0 : '50@s'
  },
  rightHeader: {},
  logoHeader: {
    width: '45@s',
    resizeMode: 'contain'
  },
  titleHeader: {
    color: commonColor.inverseTextColor,
    fontSize: '18@s'
  },
  titleHeaderWithSubTitle: {
    fontSize: '18@s'
  },
  subTitleHeader: {
    color: commonColor.inverseTextColor,
    fontWeight: 'bold',
    fontSize: '12@s',
    marginTop: Platform.OS === 'ios' ? '-2@s' : '-3@s'
  },
  iconHeader: {
    color: commonColor.inverseTextColor,
    fontSize: '30@s'
  },
  leftButtonHeader: {
    paddingLeft: 0
  },
  rightButtonHeader: {
    paddingLeft: 0,
    marginTop: Platform.OS === 'ios' ? '-5@s' : 0
  }
});

const portraitStyles = {};

const landscapeStyles = {};

export default function computeStyleSheet(): any {
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
