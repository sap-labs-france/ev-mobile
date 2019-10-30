import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: commonColor.containerBgColor
  },
  spinner: {
    flex: 1,
    color: commonColor.textColor
  },
  tabHeader: {},
  tabIcon: {
    fontSize: '20@s',
    paddingBottom: '5@s'
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
