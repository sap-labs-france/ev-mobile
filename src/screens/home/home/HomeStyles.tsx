import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: commonColor.containerBgColor
  },
  spinner: {
    color: commonColor.textColor
  },
  content: {
    padding: '5@s'
  },
  tabHeader: {},
  cardIcon: {
    fontSize: '50@s',
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
