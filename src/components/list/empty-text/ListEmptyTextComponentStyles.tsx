import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../custom-theme/customCommonColor';

const commonStyles = ScaledSheet.create({
  noRecordFound: {
    flex: 1,
    paddingTop: '20@s',
    fontSize: '14@s',
    alignSelf: 'center',
    color: commonColor.textColor
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
