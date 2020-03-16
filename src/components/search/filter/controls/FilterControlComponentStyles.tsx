import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  rowFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '35@s',
    alignItems: 'center',
  },
  rowFilterWithBorder: {
    borderTopWidth: 1,
    borderTopColor: commonColor.listBorderColor
  },
  textFilter: {
    fontSize: '14@s',
  },
  filterValue: {
    fontSize: '14@s',
    color: commonColor.textColor
  },
  switchFilter: {
  },
  connectorTypeFilter: {
    flexDirection: 'row',
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
