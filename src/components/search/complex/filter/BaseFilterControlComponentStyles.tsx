import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  rowFilter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: '40@s',
    alignItems: 'center'
  },
  textFilter: {
    width: '40%',
    fontSize: '14@s',
    fontWeight: 'bold'
  },
  filterValue: {
    fontSize: '14@s',
    color: commonColor.textColor
  },
  switchFilter: {
    marginLeft: '5@s'
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
