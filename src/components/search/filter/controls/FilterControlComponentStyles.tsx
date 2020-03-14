import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  rowFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '40@s',
    alignItems: 'center'
  },
  textFilter: {
    fontSize: '18@s',
    fontWeight: 'bold'
  },
  filterValue: {
    fontSize: '18@s',
    color: commonColor.textColor
  },
  switchFilter: {
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
